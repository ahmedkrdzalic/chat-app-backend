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
      return next();
    }
  } catch (error) {
    console.log("Not authenticated");
    next(new Error(JSON.stringify(error)));
  }
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", async (data) => {
    console.log(data);
    Message.create(data).then((message) => {
      socket.to(data.room).emit("receive_message", data);
    });
  });

  socket.on("leave_room", (data) => {
    console.log(`User with ID: ${socket.id} left room: ${data}`);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running on: ${process.env.PORT} 💯`);
});
