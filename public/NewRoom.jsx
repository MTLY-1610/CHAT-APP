// To make web page reactive and interactive
// React component was added "locally"
// NO npm or webpack is needed
//
// these lines are added to html:
//     <script src="https://unpkg.com/react@16/umd/react.development.js" crossorigin></script>
//     <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js" crossorigin></script>
//     <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
//     <script defer src="NewRoom.jsx" type="text/babel"></script>
//

'use strict'

class NewRoom extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: true
    }
  }

  render() {
    return (
        <div>
          <h3>Add new room</h3>
          <div>
            <input name="room" type="text" required placeholder="room name"/>

            <div style={{display: 'inline-block'}}>
              <span>Room is:</span>
              <input type="radio" id="room-open"
                     name="isOpen"
                     defaultValue={this.state.isOpen}
                     defaultChecked={true}
                     onChange={() => this.setState({isOpen: true})}
              />

              <label htmlFor="room-open">Open</label>

              <input type="radio" id="room-closed"
                     name="isOpen"
                     defaultValue={!this.state.isOpen}
                     onChange={() => this.setState({isOpen: false})}
              />

              <label htmlFor="room-closed">Closed</label>
            </div>

            {
              this.state.isOpen ? '' :
                  <input name="password" type="password" placeholder="password"
                         defaultValue=""/>
            }
          </div>
        </div>
    )
  }
}

const newRoomContainer = document.getElementById('new-room')
ReactDOM.render(<NewRoom/>, newRoomContainer)
