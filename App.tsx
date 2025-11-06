import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import GameOverScreen from './components/GameOverScreen';
import GameUI from './components/GameUI';
import { useGameLogic } from './hooks/useGameLogic';

// Helper to determine if running locally
const isLocalDev = () => {
  if (typeof window === 'undefined') return false;
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
};

// Discord SDK logic separated for clarity
let DiscordSDK: unknown = undefined;
if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
  // @ts-expect-error Discord SDK types are not available in development
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  DiscordSDK = require('@discord/embedded-app-sdk').DiscordSDK;
}

const App: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(isLocalDev());
  const discordSdk = DiscordSDK ? new (DiscordSDK as any)('1414340248741351527') : null; // eslint-disable-line @typescript-eslint/no-explicit-any

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


  const gameLogic = useGameLogic();
  const { gameState, players, startGame, playAgain } = gameLogic;

  const renderContent = () => {
    if (!authenticated) {
      return <div className="text-white">Loading Discord SDK...</div>;
    }
    switch (gameState) {
      case 'LOBBY':
        return (
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-6xl font-black text-coral mb-4"
            >
              HELCAST
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-white mb-8"
            >
              The Ultimate Word Challenge
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="bg-coral text-dark-bg font-bold py-4 px-10 rounded-lg text-2xl shadow-lg hover:bg-coral-bright transition-colors"
            >
              Start Classic Game
            </motion.button>
          </div>
        );
      case 'PLAYING':
        return <GameUI logic={gameLogic} />;
      case 'GAME_OVER':
        return <GameOverScreen players={players} onPlayAgain={playAgain} />;
      default:
        return null;
    }
  };

  return (
    <main className="bg-dark-bg text-white min-h-screen w-full flex items-center justify-center p-4 no-select">
      {renderContent()}
    </main>
  );
};

export default App;
