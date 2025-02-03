const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const MESSAGE_DIR = path.join(__dirname, 'messages');

if (!fs.existsSync(MESSAGE_DIR)) {
  fs.mkdirSync(MESSAGE_DIR);
  console.log(`Created directory: ${MESSAGE_DIR}`);
}

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('createRoom', (callback) => {
    const roomCode = uuidv4();
    const roomFile = path.join(MESSAGE_DIR, `${roomCode}.json`);
    try {
      fs.writeFileSync(roomFile, JSON.stringify([]));
      console.log(`Created file for room: ${roomFile}`);
      socket.join(roomCode);
      console.log(`Room created: ${roomCode}`);
      callback(roomCode);
    } catch (err) {
      console.error(`Error creating room file: ${err}`);
      callback(null);
    }
  });

  socket.on('joinRoom', (roomCode) => {
    const roomFile = path.join(MESSAGE_DIR, `${roomCode}.json`);
    console.log(`Checking for file: ${roomFile}`);
    if (fs.existsSync(roomFile)) {
      try {
        const messages = JSON.parse(fs.readFileSync(roomFile, 'utf-8'));
        console.log(`Loaded messages for room ${roomCode}`);
        socket.join(roomCode);
        console.log(`User joined room: ${roomCode}`);
        socket.emit('history', messages);
      } catch (err) {
        console.error(`Error reading room file: ${err}`);
      }
    } else {
      console.log(`No file found for room ${roomCode}`);
      console.log(`Creating file for room ${roomCode}`);
      fs.writeFileSync(roomFile, JSON.stringify([]));
      console.log(`Created file for room: ${roomFile}`);
    }
  });

  socket.on('message', ({ roomCode, message }) => {
    const roomFile = path.join(MESSAGE_DIR, `${roomCode}.json`);
    console.log(`Checking for file to write message: ${roomFile}`);
    if (!fs.existsSync(roomFile)) {
      console.log(`File does not exist, creating file: ${roomFile}`);
      fs.writeFileSync(roomFile, JSON.stringify([]));
    }
    try {
      const messages = JSON.parse(fs.readFileSync(roomFile, 'utf-8'));
      messages.push({ message, timestamp: new Date() });
      fs.writeFileSync(roomFile, JSON.stringify(messages));
      console.log(`Updated file for room ${roomCode}: ${roomFile}`);
      io.to(roomCode).emit('message', { roomCode, message });
    } catch (err) {
      console.error(`Error writing to room file: ${err}`);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(3000, () => {
  console.log('Listening on port 3000');
});
