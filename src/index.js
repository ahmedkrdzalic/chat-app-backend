require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const cookieParaser = require("cookie-parser");
const connectDB = require("./databases/mongodb");
const { validateToken } = require("./services/JWT");
const { verify } = require("jsonwebtoken");
const Message = require("./models/message/Message");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

app.use(express.json());
app.use(cookieParaser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

//migrate sign in and sign up to separate router
const signRouter = require("./routes/Sign");
app.use("/sign", signRouter);

//token validation middleware
app.use(validateToken);

//connect to database
connectDB();

//Routes
const usersRouter = require("./routes/Users");
app.use("/users", usersRouter);
const roomsRouter = require("./routes/Rooms");
app.use("/rooms", roomsRouter);
const messagesRouter = require("./routes/Messages");
const redis = require("./databases/redis-client");
app.use("/messages", messagesRouter);

//authorization middleware with getting user token from cookie headers
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    next(new Error("Unauthorized!"));
  }

  // console.log(token);

  try {
    const isValid = verify(token, process.env.JWT_SECRET);
    if (isValid) {
      // console.log("Authenticated");
      socket.request.user = isValid;
      return next();
    }
  } catch (error) {
    console.log("Not authenticated");
    next(new Error(JSON.stringify(error)));
  }
});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", async (data) => {
    //using token as key and incrementing it by 1 every time user sends a message
    let redis_result = await redis.incr(socket.handshake.auth.token);

    let ttl;
    //when user starts sending messages, we set the key to expire in 60 seconds
    if (redis_result === 1) {
      ttl = await redis.expire(socket.handshake.auth.token, 60);
      ttl = 60;
    } else {
      //if user has sent messages before, we get the time to see how much time is left
      ttl = await redis.ttl(socket.handshake.auth.token);
    }

    //if user has sent more than 20 messages in 60 seconds, we emit an error and stop the user from sending more messages
    if (redis_result > 20 && ttl > 0) {
      socket.emit("error", "You are sending too many messages");
    }

    Message.create(data).then((message) => {
      socket.to(data.room).emit("receive_message", data);
    });
  });

  socket.on("leave_room", (data) => {
    socket.leave(data);
    console.log(`User with ID: ${socket.id} left room: ${data}`);
  });

  // add new user
  if (!onlineUsers.some((user) => user._id === socket.request.user)) {
    // if user is not added before
    onlineUsers.push({
      _id: socket.request.user._id,
      email: socket.request.user.email,
      socketId: socket.id,
    });
    // send all active users to new user
    io.emit("get-users", onlineUsers);
  }

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    // send all online users to all users
    io.emit("get-users", onlineUsers);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running on: ${process.env.PORT} 💯`);
});
