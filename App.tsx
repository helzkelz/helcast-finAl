import { motion } from 'framer-motion';
import React, { useEffect, useMemo, useState } from 'react';
import GameOverScreen from './components/GameOverScreen';
import GameUI from './components/GameUI';
import Lobby from './components/Lobby';
import { useGameLogic } from './hooks/useGameLogic';
import { MultiplayerProvider, useMultiplayer } from './hooks/useMultiplayer';

// Helper to determine if running locally
const isLocalDev = () => {
  if (typeof window === 'undefined') return false;
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
};

// Discord SDK logic separated for clarity
let DiscordSDK: unknown = undefined;
if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  DiscordSDK = require('@discord/embedded-app-sdk').DiscordSDK;
}

const GameApp: React.FC = () => {
  const { currentRoom } = useMultiplayer();
  const gameLogic = useGameLogic();

  // Show lobby if not in a game room or game hasn't started
  if (!currentRoom || currentRoom.gameState === 'LOBBY') {
    return <Lobby onGameStart={() => {}} />;
  }

  // Show game if room exists and game is playing
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
    >
      <GameUI logic={gameLogic} />
      {gameLogic.gameState === 'GAME_OVER' && (
        <GameOverScreen
          players={gameLogic.players}
          onPlayAgain={gameLogic.playAgain}
        />
      )}
    </motion.div>
  );
};

const App: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(isLocalDev());
  const discordSdk = useMemo(() => DiscordSDK ? new (DiscordSDK as any)('1414340248741351527') : null, []); // eslint-disable-line @typescript-eslint/no-explicit-any

  useEffect(() => {
    if (isLocalDev()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAuthenticated(true);
      return;
    }
    if (!discordSdk) return;
    async function setupDiscordSdk() {
      await discordSdk.ready();
      console.log('Discord SDK is ready');

      // Authorize with Discord Game SDK
      const { code } = await discordSdk.commands.authorize({
        client_id: '1414340248741351527',
        response_type: 'code',
        state: '',
        prompt: 'none',
        scope: ['identify', 'guilds'],
      });

      // Exchange code for an access token
      const response = await fetch('/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      const { access_token } = await response.json();

      // Authenticate with Discord Game SDK
      await discordSdk.commands.authenticate({
        access_token,
      });

      setAuthenticated(true);
    }
    setupDiscordSdk();
  }, [discordSdk]);

  if (!authenticated) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral mx-auto mb-4"></div>
          <p className="text-white text-lg">Authenticating...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <MultiplayerProvider>
      <GameApp />
    </MultiplayerProvider>
  );
};

export default App;
