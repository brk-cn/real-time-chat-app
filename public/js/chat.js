const chatForm = document.getElementById("chat-form");
const chatMessages = document.getElementById("chat-messages");
const roomName = document.getElementById("room-name");
const roomUserList = document.getElementById("users");

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const socket = io();
socket.emit("joinRoom", { username, room });

socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputRoomUsers(users);
});

socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const msg = event.target.elements.msg.value;

  socket.emit("chatMessage", msg);

  event.target.elements.msg.value = "";
  event.target.elements.msg.focus();
});

function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">${message.text}</p>`;
  chatMessages.appendChild(div);
}

function outputRoomName(room) {
  roomName.innerText = room;
}

function outputRoomUsers(users) {
  roomUserList.innerHTML = `
  ${users.map((user) => `<li>${user.username}</li>`).join("")}`;
}
