const socket = io().connect("localhost:3000");

const chat = document.getElementById("chat");
const usernameInput = document.getElementById("username");
const messageInput = document.getElementById("message");
const submitBtn = document.getElementById("submit");

function sendMessage() {
  const username = usernameInput.value;
  const message = messageInput.value;

  if (username && message) {
    socket.emit("chat", { username, message });
    messageInput.value = "";
  }
}

submitBtn.addEventListener("click", sendMessage);

messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

socket.on("chat", (data) => {
  const messageElement = document.createElement("p");
  messageElement.innerHTML = `<span style="font-weight:bold;">${data.username}</span>: ${data.message}`;
  chat.appendChild(messageElement);
  chat.scrollTop = chat.scrollHeight;
});
