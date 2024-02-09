const express = require("express");
const socketIO = require("socket.io");

const app = express();
const server = app.listen(3000);

app.use(express.static("public"));

const io = socketIO(server);

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
  });

  socket.on("chat", (data) => {
    io.emit("chat", data);
  });
});
