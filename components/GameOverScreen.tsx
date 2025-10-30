
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Player } from '../types';
import { TrophyIcon, ShareIcon, ClipboardCheckIcon } from './icons';

interface GameOverScreenProps {
  players: Player[];
  onPlayAgain: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ players, onPlayAgain }) => {
  const winner = players[0];
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(() => {
    const title = "HELCAST Word Game - Final Results!\n";
    const rankings = players.map((p, i) => {
        const medal = i === 0 ? '🏆' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
        return `${medal} ${p.name} - ${p.score} pts`;
    }).join('\n');

    const shareText = `${title}\n${rankings}`;

    navigator.clipboard.writeText(shareText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    });
  }, [players]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-dark-bg">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-medium-gray p-8 rounded-2xl shadow-2xl text-center max-w-md w-full"
      >
        <h1 className="text-4xl font-black text-coral mb-2">GAME OVER</h1>
        {winner && (
          <div className="my-6">
            <TrophyIcon className="w-16 h-16 text-yellow-400 mx-auto animate-bounce" />
            <p className="text-xl mt-2">Winner</p>
            <p className="text-3xl font-bold text-white">{winner.name}</p>
            <p className="text-2xl font-semibold text-coral">{winner.score} pts</p>
          </div>
        )}
        
        <div className="w-full my-8">
            <h3 className="text-lg font-bold text-teal mb-3">Final Rankings</h3>
            <ul className="space-y-2 text-left">
                {players.map((player, index) => (
                    <li key={player.id} className="flex justify-between items-center bg-light-gray p-2 rounded-md">
                        <span className="font-semibold">
                            <span className="font-bold text-coral w-6 inline-block">{index + 1}.</span>
                            {player.name}
                        </span>
                        <span className="font-bold">{player.score}</span>
                    </li>
                ))}
            </ul>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onPlayAgain}
              className="bg-coral text-dark-bg font-bold py-3 px-8 rounded-lg text-xl hover:bg-coral-bright transition-colors transform hover:scale-105"
            >
              Play Again
            </button>
            <button
              onClick={handleShare}
              disabled={copied}
              className="bg-teal text-white font-bold py-3 px-8 rounded-lg text-xl hover:bg-opacity-90 transition-all transform hover:scale-105 flex items-center justify-center gap-2 disabled:bg-opacity-70 disabled:cursor-not-allowed"
            >
              {copied ? (
                <>
                  <ClipboardCheckIcon className="w-6 h-6" />
                  Copied!
                </>
              ) : (
                <>
                  <ShareIcon className="w-6 h-6" />
                  Share Results
                </>
              )}
            </button>
        </div>
      </motion.div>
    </div>
  );
};

export default GameOverScreen;
