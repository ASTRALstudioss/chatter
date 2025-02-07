const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));

let chatHistory = {};

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinRoom', ({ username, room }) => {
        socket.join(room);
        if (!chatHistory[room]) {
            chatHistory[room] = [];
        }
        socket.emit('chatHistory', chatHistory[room]);

        socket.on('message', (message) => {
            const fullMessage = { username, message };
            chatHistory[room].push(fullMessage);
            io.to(room).emit('message', fullMessage);
        });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
