import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { Player } from '../types';
import { TrophyIcon } from './icons';

interface LeaderboardProps {
  players: Player[];
  currentPlayerId: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ players, currentPlayerId }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full backdrop-blur-sm bg-glass border border-card-border rounded-2xl p-6 shadow-glass"
    >
      <h2 className="text-xl font-bold bg-gradient-to-r from-coral via-purple to-teal bg-clip-text text-transparent mb-6 text-center font-display">
        🏆 Leaderboard
      </h2>
      <ul className="space-y-3">
        <AnimatePresence>
          {players.map((player, index) => {
            const isTopPlayer = index === 0;
            const isActivePlayer = player.id === currentPlayerId;

            return (
              <motion.li
                key={player.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                  isTopPlayer 
                    ? 'bg-gradient-to-r from-coral/20 to-teal/20 border border-coral/30 shadow-glow' 
                    : 'bg-card-bg/50 hover:bg-card-bg/80 border border-card-border/50'
                } ${isActivePlayer ? 'ring-2 ring-coral/50 shadow-glow' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`font-black w-8 text-center text-lg ${
                    isTopPlayer ? 'text-coral' : 'text-text-secondary'
                  }`}>
                    #{index + 1}
                  </span>
                  <div>
                    <span className="font-semibold text-text-primary">{player.name}</span>
                    {player.id === 'p1' && (
                      <span className="text-xs text-coral ml-2 bg-coral/10 px-2 py-1 rounded-full">
                        You
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isTopPlayer && <TrophyIcon className="w-5 h-5 text-coral animate-bounce-gentle" />}
                  <span className={`font-black text-xl ${
                    isTopPlayer ? 'text-coral' : 'text-text-primary'
                  }`}>
                    {player.score}
                  </span>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </motion.div>
  );
};

export default Leaderboard;
