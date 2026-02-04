const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const User = require("./models/user.model"); // 👈 apna user model import karna

const app = express();
const server = http.createServer(app);

// Socket.io server attach
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Map to store userId -> socketId
const userSocketMap = new Map();

// Helper to get online users (sirf ids ka array)
const getOnlineUsers = () => {
  return [...userSocketMap.keys()];
};

// Middleware for socket handshake
io.use((socket, next) => {
  const userId = socket.handshake.auth.userId;
  if (!userId) {
    return next(new Error("UserId required for connection"));
  }
  socket.userId = userId;
  next();
});

io.on("connection", async (socket) => {
  console.log(`✅ User connected: ${socket.userId} (${socket.id})`);

  // socket id ko userId ke sath map me store
  userSocketMap.set(socket.userId, socket.id);

  // 1️⃣ DB update -> user ko online mark karo
  await User.findByIdAndUpdate(socket.userId, { isOnline: true });

  // 2️⃣ Sabko update karo ki online users kaun hain
  io.emit("getOnlineUsers", getOnlineUsers());

  // 🔹 Agar private message ka listener chahiye toh yahan rakho (abhi hata diya tha)

  // Handle disconnect
  socket.on("disconnect", async () => {
    console.log(`❌ User disconnected: ${socket.userId}`);

    // map se user ko hata do
    userSocketMap.delete(socket.userId);

    // 1️⃣ DB update -> user ko offline mark karo + lastSeen save karo
    await User.findByIdAndUpdate(socket.userId, {
      isOnline: false,
      lastSeen: new Date(),
    });

    // 2️⃣ Sabko update karo
    io.emit("getOnlineUsers", getOnlineUsers());
  });
});

module.exports = { io, app, server, userSocketMap };
