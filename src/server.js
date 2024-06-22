// src/server.js
const express = require('express'); 
const app = require('./app');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const mongoose = require('mongoose');
const Message = require('./models/message'); // Assuming you have a Message model

const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
    console.log('New client connected');
    
    socket.on('joinRoom', ({ roomId }) => {
        socket.join(roomId);
        console.log(`User joined room ${roomId}`);
    });
    
    socket.on('leaveRoom', ({ roomId }) => {
        socket.leave(roomId);
        console.log(`User left room ${roomId}`);
    });

    socket.on('sendMessage', async ({ roomId, content, sender }) => {
        const message = new Message({ roomId, content, sender });
        await message.save();

        io.to(roomId).emit('message', {
            sender,
            content,
            roomId,
            timestamp: message.timestamp
        });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

const PORT = process.env.PORT || 3000;

// Start server only after ensuring database connection
mongoose.connection.once('open', () => {
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

// Add the SIGINT handler for graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Mongoose connection disconnected through app termination');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
