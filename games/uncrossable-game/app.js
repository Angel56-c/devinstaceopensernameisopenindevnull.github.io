const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*", // Allow all origins for development
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.static('public'));

// Track online users
let usersOnline = 0;

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New user connected');
  usersOnline++;
  io.emit('users online', usersOnline);

  // Handle chat messages
  socket.on('chat message', (data) => {
    console.log('Message:', data);
    io.emit('chat message', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
    usersOnline--;
    io.emit('users online', usersOnline);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});