// src/server.js
const app = require('./app'); // Correct path to app.js
const http = require('http');
const socketIO = require('socket.io');

const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinRoom', ({ roomId }) => {
        socket.join(roomId);
    });

    socket.on('leaveRoom', ({ roomId }) => {
        socket.leave(roomId);
    });

    socket.on('sendMessage', async ({ roomId, message }) => {
        io.to(roomId).emit('message', message);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
