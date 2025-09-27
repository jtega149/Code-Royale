// backend/server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from 'dotenv';

import { addUser, updateUser, deleteUser, getUsers } from './controllers/userControllers.js'; 


dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// User routes
app.post('/add-user', addUser);
app.put('/update-user/:id', updateUser);
app.delete('/delete-user/:id', deleteUser);
app.get('/users', getUsers);
// Your Express routes, etc.
app.get("/", (req, res) => {
  res.send("Hello World");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Matchmaking queue and active matches
const matchmakingQueue = [];
const activeMatches = new Map(); // matchId -> { players: [], createdAt: Date }

// Track users and their rooms
const matchRooms = new Map();

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join matchmaking queue
  // Join matchmaking queue
socket.on("joinQueue", (userData) => {
  try {
    const { userId, username, skillLevel = 1 } = userData;
    
    // Check if user is already in queue
    const alreadyInQueue = matchmakingQueue.find(entry => entry.userId === userId);
    if (alreadyInQueue) {
      socket.emit("queueStatus", { status: "already_in_queue" });
      return;
    }

    // Add user to queue
    const queueEntry = {
      socketId: socket.id,
      userId,
      username,
      skillLevel,
      joinedAt: new Date()
    };
    
    matchmakingQueue.push(queueEntry);
    console.log(`User ${username} joined queue. Queue length: ${matchmakingQueue.length}`);
    
    // Emit to client: confirmed in queue
    socket.emit("queueStatus", { 
      status: "joined", 
      position: matchmakingQueue.length,
      estimatedWait: matchmakingQueue.length * 10
    });

    // Optionally broadcast to everyone else that queue length changed
    io.emit("queueUpdated", { length: matchmakingQueue.length });

    // Try to match players
    attemptMatchmaking();

    // Leave any previous rooms
    const previousRooms = Array.from(socket.rooms).filter(room => room !== socket.id);
    previousRooms.forEach(room => socket.leave(room));
    
  } catch (error) {
    console.error('Error joining queue:', error);
    socket.emit("queueStatus", { status: "error", error: error.message });
  }
});

  // Leave matchmaking queue
  socket.on("leaveQueue", (userData) => {
    const index = matchmakingQueue.findIndex(entry => entry.socketId === socket.id);
    if (index !== -1) {
      const removed = matchmakingQueue.splice(index, 1)[0];
      console.log(`User ${removed.username} left queue`);
      socket.emit("queueStatus", { status: "left" });
    }
  });

  // Join a specific match room (for existing matches)
  // Join a specific match room
socket.on("joinMatch", (matchId) => {
  const match = activeMatches.get(matchId);
  if (!match) {
    socket.emit("matchError", { error: "Match not found" });
    return;
  }

  // Leave any previous rooms (except socket.id)
  Array.from(socket.rooms)
    .filter((room) => room !== socket.id)
    .forEach((room) => socket.leave(room));

  // Join the match room
  socket.join(matchId);

  // Track user in room
  if (!matchRooms.has(matchId)) matchRooms.set(matchId, new Set());
  matchRooms.get(matchId).add(socket.id);

  console.log(`Socket ${socket.id} joined room ${matchId}`);

  // Notify the user that they've successfully joined
  socket.emit("matchJoined", {
    matchId,
    players: match.players,
    problem: match.problem,
  });
});


  // Receive chat message
  // Receive chat message and broadcast to the room
socket.on("sendMessage", (data) => {
  const { matchId, message, user } = data;

  console.error("MatchId:", matchId);
  console.error("Message:", message);
  console.error("User:", user);

  if (!matchId || !message || !user) {
    console.error("Invalid message data:", data);
    return;
  }

  // Broadcast to all sockets in the room, including sender
  io.in(matchId).emit("receiveMessage", {
    message,
    user,
    timestamp: new Date(),
  });
});


  // Receive code updates
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
      }
    } catch (error) {
      console.error('Error handling codeUpdate:', error);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    
    // Remove from queue if they were in it
    const queueIndex = matchmakingQueue.findIndex(entry => entry.socketId === socket.id);
    if (queueIndex !== -1) {
      const removed = matchmakingQueue.splice(queueIndex, 1)[0];
      console.log(`User ${removed.username} removed from queue due to disconnect`);
    }
    
    // Clean up room tracking
    matchRooms.forEach((users, matchId) => {
      if (users.has(socket.id)) {
        users.delete(socket.id);
        if (users.size === 0) {
          matchRooms.delete(matchId);
          // Optionally mark match as completed after some timeout
        }
      }
    });
  });

  // Matchmaking function
  function attemptMatchmaking() {
    if (matchmakingQueue.length < 2) return;

    // Simple FIFO matching - you can enhance this with skill-based matching
    const player1 = matchmakingQueue.shift();
    const player2 = matchmakingQueue.shift();

    const matchId = `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Select a problem (you can have a problem pool)
    const problems = [
      {
        title: "Two Sum",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        solution: "def twoSum(nums, target):\n    hashmap = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in hashmap:\n            return [hashmap[complement], i]\n        hashmap[num] = i\n    return []",
        hints: ["Use a hash map", "Iterate once", "Check complement for each element"]
      },
      {
        title: "Reverse String",
        description: "Write a function that reverses a string.",
        input: "hello",
        output: "olleh",
        solution: "def reverseString(s):\n    return s[::-1]",
        hints: ["Use slicing", "Try two-pointer approach"]
      }
    ];
    
    const selectedProblem = problems[Math.floor(Math.random() * problems.length)];

    const match = {
      id: matchId,
      players: [
        { socketId: player1.socketId, userId: player1.userId, username: player1.username },
        { socketId: player2.socketId, userId: player2.userId, username: player2.username }
      ],
      problem: selectedProblem,
      createdAt: new Date(),
      status: "active"
    };

    activeMatches.set(matchId, match);

    // Notify both players
    io.to(player1.socketId).emit("matchFound", {
      matchId,
      opponent: player2.username,
      problem: selectedProblem,
      players: match.players
    });

    io.to(player2.socketId).emit("matchFound", {
      matchId,
      opponent: player1.username,
      problem: selectedProblem,
      players: match.players
    });

    console.log(`Match created: ${matchId} between ${player1.username} and ${player2.username}`);
  }
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () =>
  console.log(`Socket.io server running on port ${PORT}`)
);