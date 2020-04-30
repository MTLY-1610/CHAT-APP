const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const bcrypt = require("bcrypt");

app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
// Parse request body as json
app.use(express.json());

const rooms = {};
// const users = [];

app.get("/", (req, res) => {
  res.render("index", { rooms: rooms });
});

app.get("/rooms", (req, res) => {
  let obj = {};
  Object.keys(rooms).forEach((key) => {
    obj[key] = { users: rooms[key].users, isOpen: rooms[key].isOpen };
  });
  const data = JSON.stringify(rooms);
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(data);
});

app.post("/room", async (req, res) => {
  if (rooms[req.body.room] != null) {
    return res.redirect("/");
  }
  // console.log("req.body", req.body);

  if (req.body.isOpen === "true") {
    rooms[req.body.room] = { users: {}, isOpen: true };
  } else if (req.body.isOpen === "false" && req.body.password != null) {
    rooms[req.body.room] = {
      users: {},
      password: await bcrypt.hash(req.body.password, 10),
      isOpen: false,
    };
  }
  // console.log("rooms:", rooms);

  res.redirect(req.body.room);
  io.emit("room-created", req.body.room);
});

app.post("/:room", (req, res) => {
  // if (rooms[req.params.room] == null) {
  //     return res.redirect('/')
  // }
  if (req.body.isOpen === true) {
    res.send({ redirect: "/" + req.params.room });
    return;
  }
  const password = req.body.password;
  const hash = rooms[req.params.room].password;

  const valid = bcrypt.compareSync(password, hash);

  if (valid) {
    res.send({ redirect: "/" + req.params.room });
  } else {
    res.statusCode = 401;
    res.setHeader("Content-Type", "text/plain");
    res.end("wrong password");
  }
});

app.get("/:room", (req, res) => {
  if (rooms[req.params.room] == null) {
    return res.redirect("/");
  }
  res.render("room", { roomName: req.params.room });
});

server.listen(3000, () =>
  console.log(`Server listening at http://localhost:3000`)
);

io.on("connection", (socket) => {
  socket.on("new-user", (room, name) => {
    socket.join(room);
    rooms[room].users[socket.id] = name;
    socket.to(room).broadcast.emit("user-connected", name);
    io.to(room).emit("room-users", {
      users: name,
    });
  });
  socket.on("send-chat-message", (room, message) => {
    socket.to(room).broadcast.emit("chat-message", {
      message: message,
      name: rooms[room].users[socket.id],
    });
  });
  socket.on("disconnect", () => {
    getUserRooms(socket).forEach((room) => {
      socket.broadcast.emit("user-disconnected", rooms[room].users[socket.id]);
      const arrayifyObject = Object.keys(rooms[room].users);
      if (arrayifyObject.length > 1) delete rooms[room].users[socket.id];
      else delete rooms[room];
    });
  });
});

function getUserRooms(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room.users[socket.id] != null) names.push(name);
    return names;
  }, []);
}
