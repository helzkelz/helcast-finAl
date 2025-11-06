# Helcast Word Game

[![CI/CD](https://github.com/helzkelz/helcast-finAl/actions/workflows/ci.yml/badge.svg)](https://github.com/helzkelz/helcast-finAl/actions/workflows/ci.yml)
[![Deployed on Railway](https://railway.app/button)](https://railway.app)

A fast-paced, drag-and-release word finding game built with React, TypeScript, and Tailwind CSS. This project features a sleek dark and coral theme, real-time scoring, and dynamic gameplay.

## Features

- **Dynamic Grid**: A "turn-by-turn" system where used letters are immediately replaced by new ones falling from above.
- **Drag-and-Release Mechanic**: Intuitively find words by dragging your cursor across adjacent letters (horizontally, vertical, or diagonally).
- **Visual Path Drawing**: See your current word selection traced with a satisfying coral line on the grid.
- **Advanced Scoring Engine**:
  - Scrabble-style letter values.
  - Length bonuses for long words.
  - Special bonuses for using rare letters (J, X, Q, Z).
  - Word and Letter multipliers (2X, 3X, DL) randomly placed on the grid.
- **Simulated Live Leaderboard**: Compete against 5 other simulated players on a leaderboard that updates in real-time.
- **Engaging Animations**: Smooth animations for score popups, bonus banners, and tile transitions, powered by Framer Motion.
- **Word Validation**: Uses the Gemini API to validate submitted words against a dictionary.

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **AI/Services**: Google Gemini API for word validation

## Note on Multiplayer & Discord Integration

This version **simulates** a live multiplayer experience by having bots populate and update the leaderboard. This is done entirely on the frontend to demonstrate the UI and game flow.

### True Multiplayer Implementation

To create a true real-time multiplayer game suitable for a Discord Activity, you would need to implement a backend server with WebSockets.

1.  **Backend Server**: Use a technology like Node.js with `ws` or `socket.io`.
2.  **Game State Management**: The server would be the single source of truth for the game state (grid, scores, timer).
3.  **WebSocket Communication**:
    - When a player starts a game, they connect to a game room via a WebSocket.
    - Player actions (like submitting a word) are sent to the server.
    - The server validates the action, updates the central game state, and broadcasts the new state to all players in the room.
    - The React frontend would then listen for these WebSocket messages and update the UI accordingly, rather than managing the game logic itself.

This architecture ensures that all players see the same game state at the same time.
