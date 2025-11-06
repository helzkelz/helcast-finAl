const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const port = process.env.PORT || 8080;

// Store active game rooms
const gameRooms = new Map();

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// For any other request, serve the index.html file
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle joining a room
  socket.on('join-room', (data) => {
    const { roomId, playerName } = data;
    socket.join(roomId);

    // Initialize room if it doesn't exist
    if (!gameRooms.has(roomId)) {
      gameRooms.set(roomId, {
        id: roomId,
        players: [],
        gameState: 'LOBBY',
        maxPlayers: 4,
        host: socket.id
      });
    }

    const room = gameRooms.get(roomId);

    // Add player to room
    const player = {
      id: socket.id,
      name: playerName,
      score: 0,
      isReady: false,
      isHost: room.players.length === 0
    };

    room.players.push(player);

    // Update host if this is the first player
    if (room.players.length === 1) {
      room.host = socket.id;
      player.isHost = true;
    }

    // Broadcast updated room info to all players in room
    io.to(roomId).emit('room-update', room);

    console.log(`Player ${playerName} joined room ${roomId}`);
  });

  // Handle player ready status
  socket.on('player-ready', (data) => {
    const { roomId, isReady } = data;
    const room = gameRooms.get(roomId);

    if (room) {
      const player = room.players.find(p => p.id === socket.id);
      if (player) {
        player.isReady = isReady;
        io.to(roomId).emit('room-update', room);
      }
    }
  });

  // Handle game start
  socket.on('start-game', (roomId) => {
    const room = gameRooms.get(roomId);

    if (room && room.host === socket.id) {
      // Check if all players are ready
      const allReady = room.players.every(p => p.isReady);

      if (allReady && room.players.length >= 2) {
        room.gameState = 'PLAYING';
        room.currentPlayerIndex = 0;
        room.currentRound = 1;
        room.grid = generateInitialGrid();
        room.foundWords = [];
        room.timeLeft = 15000; // 15 seconds

        io.to(roomId).emit('game-started', room);
        console.log(`Game started in room ${roomId}`);
      }
    }
  });

  // Handle word submission
  socket.on('submit-word', (data) => {
    const { roomId } = data;
    const room = gameRooms.get(roomId);

    if (room && room.gameState === 'PLAYING') {
      const currentPlayer = room.players[room.currentPlayerIndex];

      if (currentPlayer.id === socket.id) {
        // Process word submission
        // This would include word validation, scoring, etc.
        // For now, just advance turn
        room.currentPlayerIndex = (room.currentPlayerIndex + 1) % room.players.length;
        room.timeLeft = 15000; // Reset timer

        io.to(roomId).emit('turn-update', room);
      }
    }
  });

  // Handle chat messages
  socket.on('send-message', (data) => {
    const { roomId, message, playerName } = data;
    io.to(roomId).emit('new-message', {
      playerName,
      message,
      timestamp: Date.now()
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    // Remove player from all rooms
    for (const [roomId, room] of gameRooms.entries()) {
      const playerIndex = room.players.findIndex(p => p.id === socket.id);

      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);

        // If room is empty, delete it
        if (room.players.length === 0) {
          gameRooms.delete(roomId);
        } else {
          // Update host if host left
          if (room.host === socket.id) {
            room.host = room.players[0].id;
            room.players[0].isHost = true;
          }

          // Notify remaining players
          io.to(roomId).emit('player-left', { playerId: socket.id });
          io.to(roomId).emit('room-update', room);
        }
      }
    }
  });
});

// Helper function to generate initial grid
function generateInitialGrid() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const grid = [];

  for (let i = 0; i < 25; i++) { // 5x5 grid
    grid.push({
      id: i,
      letter: letters[Math.floor(Math.random() * letters.length)],
      multiplier: Math.random() < 0.1 ? (Math.random() < 0.5 ? '2X' : '3X') : null
    });
  }

  return grid;
}

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
