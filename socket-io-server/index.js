const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

require("dotenv").config();

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());

const port = process.env.PORT;

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"],
  },
});

const MAX_SYNC_TIME = process.env.MAX_SYNC_TIME || 120000;

async function FETCH_SYNC_API() {
  try {
    await fetch(process.env.NEXT_APP_API_ENDPOINT, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.CRON_API_SECRET}`,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.log(err.message);
  }
}
setInterval(async () => {
  await FETCH_SYNC_API();
}, MAX_SYNC_TIME);

// io.on("connection", (socket) => {
//   devLog("User connected", socket.id);

//   socket.on("join-room", (roomId) => {
//     socket.join(roomId);
//     devLog("Joined room", roomId);
//   });

//   socket.on("send-message", ({ message, roomId }) => {
//     io.to(roomId).emit("receive-message", message);
//   });

//   socket.on("exit-from-room", () => {
//     devLog("User exit", socket.id);
//   });

//   socket.on("poll-update", (data) => {
//     devLog("poll-update");
//     io.emit("poll-update", data);
//   });

//   // *** POLL ***
//   socket.on("update-idx", (data) => {
//     io.emit("update-idx", data);
//   });

// });

app.get("/", (req, res) => {
  res.send("socket server is live ");
});

app.listen(port, () => {
  console.log(process.env.PORT);
  console.log(`http://localhost:${port}`);
});
