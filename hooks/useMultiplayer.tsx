import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChatMessage, GameRoom, Player } from '../types';

interface MultiplayerContextType {
  socket: Socket | null;
  currentRoom: GameRoom | null;
  chatMessages: ChatMessage[];
  isConnected: boolean;
  joinRoom: (roomId: string, playerName: string) => void;
  leaveRoom: () => void;
  sendMessage: (message: string) => void;
  setPlayerReady: (ready: boolean) => void;
  startGame: () => void;
  submitWord: (word: string, path: number[]) => void;
}

const MultiplayerContext = createContext<MultiplayerContextType | null>(null);

export const useMultiplayer = () => {
  const context = useContext(MultiplayerContext);
  if (!context) {
    throw new Error('useMultiplayer must be used within a MultiplayerProvider');
  }
  return context;
};

interface MultiplayerProviderProps {
  children: React.ReactNode;
}

export const MultiplayerProvider: React.FC<MultiplayerProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentRoom, setCurrentRoom] = useState<GameRoom | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(window.location.origin, {
      transports: ['websocket', 'polling']
    });

    socketRef.current = newSocket;

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      setSocket(newSocket);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    // Room events
    newSocket.on('room-update', (room: GameRoom) => {
      setCurrentRoom(room);
    });

    newSocket.on('game-started', (room: GameRoom) => {
      setCurrentRoom(room);
    });

    newSocket.on('turn-update', (room: GameRoom) => {
      setCurrentRoom(room);
    });

    newSocket.on('player-left', (data: { playerId: string }) => {
      console.log('Player left:', data.playerId);
    });

    // Chat events
    newSocket.on('new-message', (message: ChatMessage) => {
      setChatMessages(prev => [...prev, message]);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const joinRoom = useCallback((_roomId: string, _playerName: string) => {
    if (socket) {
      socket.emit('join-room', { roomId: _roomId, playerName: _playerName });
    }
  }, [socket]);

  const leaveRoom = useCallback(() => {
    if (socket && currentRoom) {
      socket.emit('leave-room', currentRoom.id);
      setCurrentRoom(null);
      setChatMessages([]);
    }
  }, [socket, currentRoom]);

  const sendMessage = useCallback((_message: string) => {
    if (socket && currentRoom) {
      const playerName = currentRoom.players.find((p: Player) => p.id === socket.id)?.name || 'Unknown';
      socket.emit('send-message', {
        roomId: currentRoom.id,
        message: _message,
        playerName
      });
    }
  }, [socket, currentRoom]);

  const setPlayerReady = useCallback((_ready: boolean) => {
    if (socket && currentRoom) {
      socket.emit('player-ready', { roomId: currentRoom.id, isReady: _ready });
    }
  }, [socket, currentRoom]);

  const startGame = useCallback(() => {
    if (socket && currentRoom) {
      socket.emit('start-game', currentRoom.id);
    }
  }, [socket, currentRoom]);

  const submitWord = useCallback((_word: string, _path: number[]) => {
    if (socket && currentRoom) {
      socket.emit('submit-word', { roomId: currentRoom.id, word: _word, path: _path });
    }
  }, [socket, currentRoom]);

  const value: MultiplayerContextType = {
    socket,
    currentRoom,
    chatMessages,
    isConnected,
    joinRoom,
    leaveRoom,
    sendMessage,
    setPlayerReady,
    startGame,
    submitWord
  };

  return (
    <MultiplayerContext.Provider value={value}>
      {children}
    </MultiplayerContext.Provider>
  );
};