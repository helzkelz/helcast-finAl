import { motion } from 'framer-motion';
import React, { useMemo, useState } from 'react';
import { useMultiplayer } from '../hooks/useMultiplayer';
import { Player } from '../types';

const Lobby: React.FC = () => {
  const { currentRoom, chatMessages, isConnected, joinRoom, sendMessage, setPlayerReady, startGame } = useMultiplayer();
  const [roomId, setRoomId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [message, setMessage] = useState('');
  const [hasJoinedRoom, setHasJoinedRoom] = useState(false);

  // Memoize random letters to avoid calling Math.random in render
  const randomLetters = useMemo(() => 
    // eslint-disable-next-line react-hooks/purity
    Array.from({ length: 25 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))),
    []
  );

  const handleJoinRoom = () => {
    if (roomId.trim() && playerName.trim()) {
      joinRoom(roomId.trim(), playerName.trim());
      setHasJoinedRoom(true);
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen animated-gradient flex items-center justify-center p-4"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral mx-auto mb-4"></div>
          <p className="text-white text-lg">Connecting to server...</p>
        </div>
      </motion.div>
    );
  }

  if (!hasJoinedRoom) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen animated-gradient flex items-center justify-center p-4"
      >
        <div className="backdrop-blur-sm bg-glass border border-card-border rounded-3xl p-8 shadow-glass max-w-md w-full">
          <h1 className="text-5xl font-black bg-gradient-to-r from-coral to-teal bg-clip-text text-transparent text-center mb-2 font-display">
            Helcast
          </h1>
          <p className="text-center text-text-muted mb-8">A Real-time Multiplayer Word Game</p>

          <div className="space-y-6">
            <div>
              <label className="block text-text-secondary text-sm font-medium mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-4 py-3 bg-card-bg border border-card-border rounded-xl text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-coral/50"
                placeholder="Enter your name"
                maxLength={20}
              />
            </div>

            <div>
              <label className="block text-text-secondary text-sm font-medium mb-2">
                Room Code
              </label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-card-bg border border-card-border rounded-xl text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-coral/50 font-mono"
                placeholder="Enter room code"
                maxLength={10}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05, y: -2, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleJoinRoom}
              disabled={!roomId.trim() || !playerName.trim()}
              className="w-full py-4 bg-gradient-to-r from-coral to-teal text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Join or Create Room
            </motion.button>

            <div className="text-center">
              <button
                onClick={() => setRoomId(Math.random().toString(36).substring(2, 8).toUpperCase())}
                className="text-teal hover:text-coral transition-colors text-sm"
              >
                Generate Random Room
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!currentRoom) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen animated-gradient flex items-center justify-center p-4"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral mx-auto mb-4"></div>
          <p className="text-white text-lg">Joining room...</p>
        </div>
      </motion.div>
    );
  }

  const currentPlayer = currentRoom.players.find((p: Player) => p.id === currentRoom.players.find((cp: Player) => cp.isHost)?.id);
  const isHost = currentPlayer?.isHost || false;
  const allReady = currentRoom.players.every((p: Player) => p.isReady);
  const canStart = isHost && allReady && currentRoom.players.length >= 2;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen animated-gradient p-4"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 h-screen">
        {/* Left Panel - Room Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-sm bg-glass border border-card-border rounded-3xl p-6 shadow-glass"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">Room: <span className="text-coral">{currentRoom.id}</span></h2>
            <div className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
              isConnected ? 'bg-teal/20 text-teal' : 'bg-red-500/20 text-red-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-teal' : 'bg-red-400'}`}></div>
              {isConnected ? 'Connected' : 'Disconnected'}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-3">Players ({currentRoom.players.length}/4)</h3>
            {currentRoom.players.map((player: Player) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-between p-4 bg-card-bg/50 rounded-xl border border-card-border"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    player.isReady ? 'bg-teal' : 'bg-gray-500'
                  }`}></div>
                  <span className="text-white font-medium">{player.name}</span>
                  {player.isHost && (
                    <span className="px-2 py-1 bg-coral/20 text-coral text-xs rounded-full">Host</span>
                  )}
                </div>
                <div className="text-text-secondary text-sm">
                  {player.isReady ? 'Ready' : 'Not Ready'}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            {!currentPlayer?.isReady && (
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPlayerReady(true)}
                className="w-full py-3 bg-teal text-white font-bold rounded-xl hover:bg-teal/80 transition-all duration-300 shadow-lg"
              >
                Ready Up
              </motion.button>
            )}

            {currentPlayer?.isReady && (
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPlayerReady(false)}
                className="w-full py-3 bg-gray-600 text-white font-bold rounded-xl hover:bg-gray-500 transition-all duration-300 shadow-lg"
              >
                Not Ready
              </motion.button>
            )}

            {isHost && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startGame}
                disabled={!canStart}
                className="w-full py-3 bg-gradient-to-r from-coral to-teal text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200"
              >
                Start Game
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Center Panel - Game Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="backdrop-blur-sm bg-glass border border-card-border rounded-3xl p-6 shadow-glass flex flex-col items-center justify-center"
        >
          <h1 className="text-6xl font-black bg-gradient-to-r from-coral to-teal bg-clip-text text-transparent mb-4 font-display">
            Helcast
          </h1>
          <p className="text-text-secondary text-center mb-8">
            Fast-paced word finding game with combos and power-ups
          </p>

          <div className="grid grid-cols-5 gap-2 mb-8">
            {Array.from({ length: 25 }, (_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.02 }}
                className="w-8 h-8 bg-gradient-to-br from-coral/20 to-teal/20 border border-card-border rounded-lg flex items-center justify-center"
              >
                <span className="text-xs font-bold text-white">
                  {randomLetters[i]}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-text-muted text-sm mb-2">Waiting for players...</p>
            <div className="flex justify-center gap-2">
              {Array.from({ length: 3 }, (_, i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  className="w-2 h-2 bg-teal rounded-full"
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Panel - Chat */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="backdrop-blur-sm bg-glass border border-card-border rounded-3xl p-6 shadow-glass flex flex-col"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Chat</h3>

          <div className="flex-1 overflow-y-auto mb-4 space-y-3">
            {chatMessages.length === 0 ? (
              <p className="text-text-muted text-center text-sm">No messages yet. Say hello!</p>
            ) : (
              chatMessages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-card-bg/50 rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-teal font-medium text-sm">{msg.playerName}</span>
                    <span className="text-text-muted text-xs">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-white text-sm">{msg.message}</p>
                </motion.div>
              ))
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-3 py-2 bg-card-bg border border-card-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-coral/50 text-sm"
              placeholder="Type a message..."
              maxLength={200}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="px-4 py-2 bg-teal text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal/80 transition-colors text-sm font-medium"
            >
              Send
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Lobby;