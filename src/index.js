require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const cookieParaser = require("cookie-parser");
const connectDB = require("./databases/mongodb");
const { validateToken } = require("./services/JWT");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(express.json());
app.use(cookieParaser());

app.use(
  cors({
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

// io.on("connection", (socket) => {
//   console.log(`User Connected: ${socket.id}`);

//   socket.on("join_room", (data) => {
//     socket.join(data);
//     console.log(`User with ID: ${socket.id} joined room: ${data}`);
//   });

//   socket.on("send_message", (data) => {
//     socket.to(data.room).emit("receive_message", data);
//   });

//   socket.on("disconnect", () => {
//     console.log("User Disconnected", socket.id);
//   });
// });

server.listen(process.env.PORT, () => {
  console.log(`Server is running on: ${process.env.PORT} 💯`);
});
