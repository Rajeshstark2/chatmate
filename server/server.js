// server.js
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';

import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import userRoutes from './routes/user.routes.js';

import connectToMongoDB from './db/connectToMongoDB.js';
import { app, server  } from './socket/socket.js';

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

dotenv.config();
app.use(express.json()); // to parse incoming JSON
app.use(cookieParser());

// ✅ API ROUTES (These must come first!)
app.use("/api/auth", authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

// ✅ Serve frontend **AFTER** API routes
app.use(express.static(path.join(__dirname, '/client/dist')));

// ✅ Handle React Routing (but only if the request is NOT for an API)
app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: "API route not found" }); // Prevent React from taking over API routes
    }
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

// ✅ Start Server
server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is running on port ${PORT}`);
});
