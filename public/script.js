const socket = io("http://localhost:3000");
const messageContainer = document.getElementById("message-container");
const roomContainer = document.getElementById("room-container");
const messageForm = document.getElementById("send-container");
const messageInput = document.getElementById("message-input");
const roomTitle = document.getElementById("room-title");
const userList = document.getElementById("userList");

const usersInRoom = [];

if (messageForm != null) {
  const name = prompt("what is your name?");
  appendMessage("you joined");
  socket.emit("new-user", roomName, name);

  messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = messageInput.value;
    appendMessage(`You: ${message}`);
    socket.emit("send-chat-message", roomName, message);
    messageInput.value = "";
  });
}

if (roomTitle) {
  roomTitle.innerText += roomName;
}

socket.on("room-created", (room) => {
  const roomElement = document.createElement("div");
  roomElement.innerText = room;
  const roomLink = document.createElement("a");
  //   roomlink.href = `/${room}`;
  roomlink.innerText = "join";
  roomContainer.append(roomElement);
  roomContainer.append(roomLink);
});

socket.on("chat-message", (data) => {
  appendMessage(`${data.name}: ${data.message}`);
});

socket.on("user-connected", (name) => {
  appendMessage(`${name} joined the chat`);
});

socket.on("user-disconnected", (name, usersInRoom) => {
  appendMessage(`${name} left the chat`);
  const index = usersInRoom.indexOf(name);
  if (index !== -1) {
    usersInRoom.splice(index, 1);
    outputRoomUsers(usersInRoom);
  }
});

socket.on("room-users", ({ users }) => {
  outputRoomUsers(users);
});

function appendMessage(message) {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageContainer.appendChild(messageElement);
}

function outputRoomUsers(users) {
  console.log(users);
  userList.innerHTML = `
  ${users.map((user) => `<li>${user}</li>`).join("")}`;
}
