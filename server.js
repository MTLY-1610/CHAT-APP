const express = require ('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const bcrypt = require('bcrypt')

app.set('views','./views')
app.set('view engine','ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

const rooms = { }

app.get('/', (req, res) => {
    res.render('index', {rooms: rooms})
})

app.post('/room', async (req, res) =>{
    if (rooms[req.body.room] != null) {
        return res.redirect('/')
    }

    console.log('req.body', req.body)

    if (req.body.isOpen === 'true') {
        rooms[req.body.room] = { users: {} }

    } else if (req.body.isOpen === 'false' && req.body.password != null) {
        rooms[req.body.room] = {users: {}, password: await bcrypt.hash(req.body.password, 10)}
    }
    console.log('rooms:', rooms)

    res.redirect(req.body.room)
    io.emit('room-created', req.body.room)
})

app.get('/:room',(req, res) => {
    if (rooms[req.params.room] == null) {
        return res.redirect('/')
    }
    res.render('room', { roomName: req.params.room })
})

server.listen(3000, () => console.log(`Server listening at http://localhost:3000`))


io.on ('connection', socket => {
    socket.on('new-user', (room, name) => {
        socket.join(room)
        rooms[room].users[socket.id] = name
        socket.to(room).broadcast.emit('user-connected', name)

    })
    socket.on('send-chat-message', (room, message) => {
        socket.to(room).broadcast.emit('chat-message', {message: message, name: rooms[room].users[socket.id]})
    })
    socket.on('disconnect', () => {
        getUserRooms(socket).forEach(room => {
        socket.broadcast.emit('user-disconnected', rooms[room].users[socket.id])
        delete rooms[room].users[socket.id]
        })
    })
})

function getUserRooms(socket) {
    return Object.entries(rooms).reduce((names, [name, room ]) => {
        if (room.users[socket.id] != null) names.push(name)
        return names

    }, [])
}
