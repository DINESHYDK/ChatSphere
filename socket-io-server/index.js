const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const devLog = require("../utils/logger");

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  devLog("User connected", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    devLog("Joined room", roomId);
  });

  socket.on("send-message", ({ message, roomId }) => {
    io.to(roomId).emit("receive-message", message);
  });

  socket.on("exit-from-room", () => {
    devLog("User exit", socket.id);
  });

  socket.on("poll-update", (data) => {
    devLog("poll-update");
    io.emit("poll-update", data);
  });

  // *** POLL ***
  socket.on("update-idx", (data) => {
    io.emit("update-idx", data);
  });
  
  
});

app.get("/", (req, res) => {
  res.send("socket server is live ");
});

app.listen(port, () => {
  devLog(`http://localhost:${port}`);
});
