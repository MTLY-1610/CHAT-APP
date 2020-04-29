// To make web page reactive and interactive
// React component was added "locally"
// NO npm or webpack is needed
//
// these lines are added to html:
//     <script src="https://unpkg.com/react@16/umd/react.development.js" crossorigin></script>
//     <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js" crossorigin></script>
//     <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
//     <script defer src="RoomBox.jsx" type="text/babel"></script>
//

'use strict'

class RoomBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      rooms: {},
      userPassword: ''
    }
    axios.get('/rooms')
        .then((res) => {
          if (res.data) {
            this.setState({rooms: res.data})
            console.log('data rooms:', this.state)
          }
        })
  }

  join = (key) => {
    const data = {password: this.state.userPassword, isOpen:this.state.rooms[key].isOpen }
    axios.post('/' + key, data)
        .then(res => {
          console.log('res', res)
          if (typeof res.data.redirect == 'string') {
            window.location = res.data.redirect
          }
        })
        .catch(err => {

        })
  }

  setPassword = (event) => {
    this.setState({userPassword: event.target.value})
  }

  render() {
    return (
        <div>
          <h2>Rooms to join</h2>
        <div>
          <h4>Private</h4>
          <div>
            {Object.keys(this.state.rooms)
                .filter(key => this.state.rooms[key].isOpen === false)
                .map((key, index) =>
                    <div key={index} style={{display: 'flex'}}>
                      <div>{key}</div>
                      <input type="password" placeholder="password"
                             onChange={this.setPassword}/>
                      <button onClick={() => {
                        this.join(key)
                      }}>JOIN
                      </button>
                    </div>
                )}
          </div>

          <h5>Open</h5>
          <div>
            {Object.keys(this.state.rooms)
                .filter(key => this.state.rooms[key].isOpen === true)
                .map((key, index) =>
                <div key={index} style={{display: 'flex'}}>
                  <div>{key}</div>
                  <button onClick={() => {
                    this.join(key)
                  }}>JOIN
                  </button>
                </div>
            )}
          </div>

        </div>
        </div>
    )
  }

}

const newRoomBox = document.getElementById('room-box')
ReactDOM.render(<RoomBox/>, newRoomBox)



