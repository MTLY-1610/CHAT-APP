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
        <div id="new-room-container">
          <h3>CREATE A ROOM</h3>
          <div id="room-name">
            <input name="room" type="text" required placeholder="room name"/>
          </div>
          <div id="new-room-pref-box">
            <div id="radio-open-container">
              <div id="open">
                  <input type="radio" id="room-open"
                        name="isOpen"
                        value={true}
                        defaultChecked={true}
                        onChange={() => this.setState({isOpen: true})}
                  />
              </div>
              <div id="open-text">
                  <label htmlFor="room-open">Open</label>
              </div>
            </div>
            <div id="closed">

                <input type="radio" id="room-closed"
                      name="isOpen"
                      value={false}
                      onChange={() => this.setState({isOpen: false})}
                />

                <label htmlFor="room-closed">Closed</label>
              

              {
                this.state.isOpen ? '' :
                    <input id="close-password" name="password" type="password" placeholder="password"
                          defaultValue=""/>
              }
            </div>
          </div>
        
          <button type="submit">ADD ROOM</button>
        </div>
    )
  }
}

const newRoomContainer = document.getElementById('new-room')
ReactDOM.render(<NewRoom/>, newRoomContainer)
