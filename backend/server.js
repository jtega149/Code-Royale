// backend/server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Track users and their rooms
const matchRooms = new Map();

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join a match room with user info
  socket.on("joinMatch", (matchId) => {  // Fixed: expecting just matchId string
    console.log(`Attempting to join match: ${matchId}`);
    
    // Leave any previous rooms (except socket's own room)
    const previousRooms = Array.from(socket.rooms).filter(room => room !== socket.id);
    previousRooms.forEach(room => {
      socket.leave(room);
      console.log(`Socket ${socket.id} left room ${room}`);
    });

    // Join the new room
    socket.join(matchId);
    
    // Track user in room
    if (!matchRooms.has(matchId)) {
      matchRooms.set(matchId, new Set());
    }
    matchRooms.get(matchId).add(socket.id);
    
    console.log(`Socket ${socket.id} joined match ${matchId}`);
    console.log(`Room ${matchId} now has ${matchRooms.get(matchId).size} users`);
    
    // Debug: log all rooms this socket is in
    console.log(`Socket ${socket.id} rooms:`, Array.from(socket.rooms));
  });

  // Receive chat message and send to other clients in the room
  socket.on("sendMessage", (data) => {
    try {
      const { matchId, message, user } = data;
      
      // Validate data
      if (!matchId || !message || !user) {
        console.error('Invalid message data:', data);
        return;
      }
      
      console.log(`Received message for room: ${matchId}`);
      console.log(`Socket ${socket.id} rooms:`, Array.from(socket.rooms));
      
      // Check if socket is in the room (safer method)
      const rooms = Array.from(socket.rooms);
      if (rooms.includes(matchId)) {
        socket.to(matchId).emit("receiveMessage", { 
          message, 
          user, 
          timestamp: new Date() 
        });
        console.log(`Message from ${user} in ${matchId}: ${message}`);
      } else {
        console.log(`Socket ${socket.id} not in room ${matchId}. Current rooms:`, rooms);
      }
    } catch (error) {
      console.error('Error handling sendMessage:', error);
    }
  });

  // Receive code updates and broadcast to the room
  socket.on("codeUpdate", (data) => {
    try {
      const { matchId, code } = data;
      
      if (!matchId) {
        console.error('Invalid codeUpdate data:', data);
        return;
      }
      
      const rooms = Array.from(socket.rooms);
      if (rooms.includes(matchId)) {
        socket.to(matchId).emit("codeUpdate", code);
        console.log(`Code update in ${matchId} from ${socket.id}`);
      }
    } catch (error) {
      console.error('Error handling codeUpdate:', error);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    
    // Clean up room tracking
    matchRooms.forEach((users, matchId) => {
      if (users.has(socket.id)) {
        users.delete(socket.id);
        console.log(`Removed ${socket.id} from room ${matchId}`);
        if (users.size === 0) {
          matchRooms.delete(matchId);
          console.log(`Room ${matchId} is now empty and removed`);
        }
      }
    });
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () =>
  console.log(`Socket.io server running on port ${PORT}`)
);