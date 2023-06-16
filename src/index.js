const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    // methods: ["GET", "POST"]
  },
});

// app.use((req, res, next) => {
//   const token = req.query.token;

//   // Validate the token here (e.g., verify signature, check expiration)
//   // If the token is invalid, you can respond with an error or send a 401 Unauthorized status

//   // If the token is valid, you can attach the decoded token or relevant user information to the request object
//   // For example: req.user = decodedToken;

//   next();
// });

// io.use((socket, next) => {
//   const token = socket.handshake.query.token;

//   // Validate the token here (e.g., verify signature, check expiration)
//   // If the token is invalid, call `next(new Error('Invalid token'))` to reject the connection

//   // If the token is valid, you can attach the decoded token or relevant user information to the socket object
//   // For example: socket.user = decodedToken;

//   next();
// });

io.on("connection", (socket) => {
  console.log(`User with id:${socket.id} has been connected`);

  socket.on("disconnect", () => {
    console.log(`User with id:${socket.id} has been disconnected`);
  });
});

server.listen(4000, () => {
  console.log("Server is running");
});
