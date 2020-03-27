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
    console.log(status);
    io.emit("walk status", status);
  });

  // Send walk status change notification to specific walker
  // listeners - Safewalker
  // senders - User
  socket.on("user walk status", ({walkerId, status}) => {
    io.sockets.connected[walkerId].emit("user walk status", status);
  })

  // Send walk status change notification to specific user
  // listeners - User
  // senders - Safewalker
  socket.on("walker walk status", ({userId, status}) => {
    console.log(userId);
    console.log(status);
    io.sockets.connected[userId].emit("walker walk status", status);
  })

  // Send location change notification to specific user
  // listeners - User
  // senders - Safewalker
  socket.on("walker location", ({userId, location}) => {
    console.log(userId);
    console.log(location);
    io.sockets.connected[userId].emit("walker location", location);
  })
  
});

server.listen(port, () => console.log("server running on port: " + port));