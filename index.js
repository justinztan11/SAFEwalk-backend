const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const port = 3000;

io.on("connection", socket => {
  console.log("a user/safewalker has connected");
  console.log(socket.id);

  // Broadcast walk status change notifications to all walkers
  // listeners - Safewalker
  // senders - User, Safewalker
  socket.on("walk status", status => {
    try {
      io.emit("walk status", status);
    } catch (error) { }
  });

  // Send walk status change notification to specific walker
  // listeners - Safewalker
  // senders - User
  socket.on("user walk status", ({ walkerId, status }) => {
    try {
      io.sockets.connected[walkerId].emit("user walk status", status);
    } catch (error) {
      socket.emit("connection lost", true);
    }
  })

  // Send walk status change notification to specific user
  // listeners - User
  // senders - Safewalker
  socket.on("walker walk status", ({ userId, status }) => {
    try {
      io.sockets.connected[userId].emit("walker walk status", status);
    } catch (error) {
      socket.emit("connection lost", true);
    }
  })

  // Send location change notification to specific user
  // listeners - User
  // senders - Safewalker
  socket.on("walker location", ({ userId, lat, lng }) => {
    try {
      io.sockets.connected[userId].emit("walker location", { lat, lng });
    } catch (error) {
      socket.emit("connection lost", true);
    }
  })

});

server.listen(port, () => console.log("server running on port: " + port));