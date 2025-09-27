// backend/server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors()); // allow all origins (adjust in production)

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // allow your frontend URL in production
    methods: ["GET", "POST"],
  },
});

// Optional: simple room management
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join a match room
  socket.on("joinMatch", (matchId) => {
    socket.join(matchId);
    console.log(`Socket ${socket.id} joined match ${matchId}`);
  });

  // Receive chat message and broadcast to the room
  socket.on("sendMessage", ({ matchId, message, user }) => {
    io.to(matchId).emit("receiveMessage", { message, user });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });

    // Receive code updates and broadcast to the room
    socket.on("codeUpdate", ({ matchId, code }) => {
      socket.to(matchId).emit("codeUpdate", code);
    });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Socket.io server running on port ${PORT}`));