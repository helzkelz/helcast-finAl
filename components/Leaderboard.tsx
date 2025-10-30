
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Player } from '../types';
import { TrophyIcon } from './icons';

interface LeaderboardProps {
  players: Player[];
  currentPlayerId: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ players, currentPlayerId }) => {
  return (
    <div className="w-full bg-medium-gray p-4 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-coral mb-4 text-center">Leaderboard</h2>
      <ul className="space-y-2">
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
                className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                  isTopPlayer ? 'bg-coral text-dark-bg' : 'bg-light-gray'
                } ${isActivePlayer ? 'ring-2 ring-coral-bright' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`font-bold w-6 text-center ${isTopPlayer ? 'text-dark-bg' : 'text-coral'}`}>
                    {index + 1}
                  </span>
                  <span className="font-semibold">{player.name} {player.id === 'p1' && '(You)'}</span>
                </div>
                <div className="flex items-center gap-2">
                  {isTopPlayer && <TrophyIcon className="w-5 h-5 text-dark-bg" />}
                  <span className="font-bold text-lg">{player.score}</span>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default Leaderboard;
