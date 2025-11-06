import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { TOTAL_ROUNDS, TURN_TIME_LIMIT } from '../constants';
import { useMultiplayer } from '../hooks/useMultiplayer';
import { FoundWord, ParticleEffect, Player, ScorePopupInfo, TileData } from '../types';
import BonusBanner from './BonusBanner';
import Grid from './Grid';
import { QuestionMarkCircleIcon } from './icons';
import Leaderboard from './Leaderboard';
import ParticleSystem from './ParticleSystem';
import ScorePopup from './ScorePopup';
import ScoringGuide from './ScoringGuide';
import WordPreview from './WordPreview';

const FoundWordsList: React.FC<{ words: FoundWord[] }> = ({ words }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="w-full backdrop-blur-sm bg-glass border border-card-border rounded-2xl p-6 shadow-glass"
  >
    <h3 className="text-lg font-bold bg-gradient-to-r from-coral to-teal bg-clip-text text-transparent mb-4 text-center font-display">
      Found Words
    </h3>
    <div className="max-h-40 overflow-y-auto pr-2 custom-scrollbar">
      {words.length === 0 ? (
        <p className="text-center text-text-muted py-4">No words found yet.</p>
      ) : (
        <motion.ul className="space-y-2">
          {words.map(({ word, score }, index) => (
            <motion.li 
              key={`${word}-${index}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex justify-between items-center text-sm bg-card-bg/50 hover:bg-card-bg/80 p-3 rounded-xl border border-card-border/50 transition-all duration-200"
            >
              <span className="font-semibold text-text-primary">{word}</span>
              <span className="font-bold text-coral bg-coral/10 px-2 py-1 rounded-lg">+{score}</span>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div>
  </motion.div>
);

const GameUI: React.FC = () => {
  const { currentRoom, submitWord } = useMultiplayer();
  const [currentWord, setCurrentWord] = useState('');
  const [isScoringGuideOpen, setIsScoringGuideOpen] = useState(false);

  // If no room or not playing, don't render
  if (!currentRoom || currentRoom.gameState !== 'PLAYING') {
    return null;
  }

  const currentPlayer = currentRoom.players[currentRoom.currentPlayerIndex || 0];
  const isMyTurn = currentPlayer?.id === currentRoom.players.find((p: Player) => p.isHost)?.id; // For now, assume host is player 1
  const timeLeft = currentRoom.timeLeft || 0;
  const timePercentage = (timeLeft / TURN_TIME_LIMIT) * 100;

  // Mock data for now - will be replaced with real multiplayer data
  const foundWords: FoundWord[] = currentRoom.foundWords || [];
  const scorePopups: ScorePopupInfo[] = [];
  const bonusBanner: string | null = null;
  const isVerifying = false;
  const particleEffects: ParticleEffect[] = [];

  const handleWordSubmit = (tiles: TileData[]) => {
    if (tiles.length > 0) {
      const word = tiles.map(tile => tile.letter).join('');
      const path = tiles.map(tile => (currentRoom.grid || []).findIndex((t: TileData) => t.id === tile.id));
      submitWord(word, path);
      setCurrentWord('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-8xl mx-auto p-4 sm:p-6 flex flex-col lg:flex-row gap-8 relative"
    >
      <ParticleSystem particles={particleEffects} />
      <ScorePopup popups={scorePopups} />
      <BonusBanner text={bonusBanner} />
      {isScoringGuideOpen && <ScoringGuide onClose={() => setIsScoringGuideOpen(false)} />}

      {/* Left/Top Panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full lg:w-1/3 flex flex-col gap-6 order-2 lg:order-1"
      >
        <Leaderboard players={currentRoom.players} currentPlayerId={currentPlayer?.id} />
        <FoundWordsList words={foundWords} />
      </motion.div>

      {/* Center Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="w-full lg:w-2/3 flex flex-col items-center gap-6 order-1 lg:order-2"
      >
        {/* Enhanced Status Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="w-full backdrop-blur-sm bg-glass border border-card-border rounded-2xl p-6 shadow-glass-sm"
        >
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => setIsScoringGuideOpen(true)} className="text-text-muted hover:text-coral transition-colors p-3 rounded-xl hover:bg-card-bg/50">
              <QuestionMarkCircleIcon className="w-6 h-6" />
            </button>

            <div className="text-center">
              <div className="text-xs text-text-muted uppercase tracking-wider font-medium mb-1">Round</div>
              <div className="text-4xl font-black bg-gradient-to-r from-coral to-teal bg-clip-text text-transparent font-display">
                {currentRoom.currentRound || 1} / {TOTAL_ROUNDS}
              </div>
            </div>

            <div className="text-center">
              <div className="text-xs text-text-muted uppercase tracking-wider font-medium mb-1">Your Score</div>
              <div className="text-4xl font-black text-coral font-display drop-shadow-lg">
                {currentRoom.players.find((p: Player) => p.isHost)?.score || 0}
              </div>
            </div>
          </div>

          {/* Timer and Combo Bar */}
          <div className="space-y-3">
            {/* Timer */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex justify-between text-xs text-text-muted mb-1">
                  <span>Time Left</span>
                  <span>{Math.ceil(timeLeft / 1000)}s</span>
                </div>
                <div className="w-full bg-card-bg/50 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      timePercentage > 50 ? 'bg-teal' :
                      timePercentage > 25 ? 'bg-warning' : 'bg-error'
                    }`}
                    initial={{ width: '100%' }}
                    animate={{ width: `${timePercentage}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Turn Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className={`h-16 w-full backdrop-blur-sm bg-glass border border-card-border rounded-2xl p-4 shadow-glass-sm flex items-center justify-center ${
            isMyTurn ? 'ring-2 ring-coral/50' : ''
          }`}
        >
          <p className={`text-xl font-bold transition-all duration-300 ${
            isMyTurn
              ? 'text-coral animate-pulse-glow bg-coral/10 px-4 py-2 rounded-lg border border-coral/20'
              : 'text-text-secondary'
          }`}>
            {isMyTurn ? '🎯 Your Turn!' : `${currentPlayer?.name}'s Turn...`}
          </p>
        </motion.div>

        <WordPreview word={currentWord} isVerifying={isVerifying} />

        <Grid
          gridData={currentRoom.grid || []}
          onWordSubmit={handleWordSubmit}
          disabled={!isMyTurn || isVerifying}
          onWordChange={setCurrentWord}
        />
      </motion.div>
    </motion.div>
  );
};

export default GameUI;
