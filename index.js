const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/message");
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require("./utils/user");

const app = express();
app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);
const io = socketio(server);

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    socket.emit("message", formatMessage("SERVER", "Welcome to Real-Time Chat App"));

    socket.broadcast.to(user.room).emit("message", formatMessage("SERVER", `${user.username} has joined the room`));

    io.to(user.room).emit("roomUsers", { room: user.room, users: getRoomUsers(user.room) });
  });

  socket.on("chatMessage", (message) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, message));
  });

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit("message", formatMessage("SERVER", `${user.username} has left the room`));
      io.to(user.room).emit("roomUsers", { room: user.room, users: getRoomUsers(user.room) });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
