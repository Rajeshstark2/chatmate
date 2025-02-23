import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["*"], // Allow all origins (for testing, restrict later)
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {}; // {userId: socketId}

// Function to get receiver's socket ID
export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Get userId from query params when connecting
  const userId = socket.handshake.query.userId;
  if (userId !== "undefined") userSocketMap[userId] = socket.id;

  // Send updated list of online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // ✅ **Handle real-time messaging**
  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    console.log(`Message from ${senderId} to ${receiverId}: ${message}`);

    // Get receiver socket ID
    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      // Send message to the receiver in real time
      io.to(receiverSocketId).emit("receiveMessage", { senderId, message });
    }
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete userSocketMap[userId]; // Remove user from active list
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
