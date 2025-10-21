const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { Socket } = require("dgram");

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
Socket.on("connection", (socket) => {
    console.log('User connected', socket.id);

    Socket.on("join-room", (roomId) => {
        Socket.join(roomId);
        console.log('Joined room', roomId);
    })
    
    Socket.on("send-message", ({message, roomId}) => {
      io.to(roomId).emit("receive-message", message)
    })

    Socket.on("exit-from-room", () => {
      console.log('User exit from room', socket.id);
    })

    
})
app.get("/", (req, res) => {
res.send("Socket server is live ");
});
    


app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})