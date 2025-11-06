
import React, { useState } from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import Grid from './Grid';
import Leaderboard from './Leaderboard';
import WordPreview from './WordPreview';
import ScorePopup from './ScorePopup';
import BonusBanner from './BonusBanner';
import ScoringGuide from './ScoringGuide';
import { FoundWord } from '../types';
import { QuestionMarkCircleIcon } from './icons';
import { TOTAL_ROUNDS } from '../constants';

interface GameUIProps {
  logic: ReturnType<typeof useGameLogic>;
}

const FoundWordsList: React.FC<{ words: FoundWord[] }> = ({ words }) => (
  <div className="w-full bg-medium-gray p-4 rounded-xl shadow-lg mt-4">
    <h3 className="text-lg font-bold text-coral mb-2 text-center">Found Words</h3>
    <div className="max-h-32 overflow-y-auto pr-2">
      {words.length === 0 ? (
        <p className="text-center text-gray-400">No words found yet.</p>
      ) : (
        <ul className="space-y-1">
          {words.map(({ word, score }, index) => (
            <li key={`${word}-${index}`} className="flex justify-between items-center text-sm bg-light-gray p-1 rounded">
              <span className="font-semibold">{word}</span>
              <span className="font-bold text-coral">+{score}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);

const GameUI: React.FC<GameUIProps> = ({ logic }) => {
  const {
    gameState, grid, players, currentPlayerIndex, currentRound,
    foundWords, scorePopups, bonusBanner, isVerifying, handleWordSubmit
  } = logic;

  const [currentWord, setCurrentWord] = useState('');
  const [isScoringGuideOpen, setIsScoringGuideOpen] = useState(false);

  const currentPlayer = players[currentPlayerIndex];
  const isMyTurn = currentPlayer?.id === 'p1';

  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col lg:flex-row gap-6">
      <ScorePopup popups={scorePopups} />
      <BonusBanner text={bonusBanner} />
      {isScoringGuideOpen && <ScoringGuide onClose={() => setIsScoringGuideOpen(false)} />}

      {/* Left/Top Panel */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4 order-2 lg:order-1">
        <Leaderboard players={players} currentPlayerId={currentPlayer?.id} />
        <FoundWordsList words={foundWords} />
      </div>

      {/* Center Panel */}
      <div className="w-full lg:w-2/3 flex flex-col items-center gap-4 order-1 lg:order-2">
        <div className="w-full flex justify-between items-center bg-medium-gray p-2 rounded-lg">
          <button onClick={() => setIsScoringGuideOpen(true)} className="text-gray-400 hover:text-coral transition-colors p-2">
            <QuestionMarkCircleIcon className="w-7 h-7" />
          </button>
          <div className="text-center">
            <div className="text-sm text-gray-400">ROUND</div>
            <div className="text-2xl font-bold text-white">{currentRound} / {TOTAL_ROUNDS}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400">YOUR SCORE</div>
            <div className="text-2xl font-bold text-coral">{players.find(p => p.id === 'p1')?.score || 0}</div>
          </div>
        </div>
        
        <div className="h-12 w-full text-center p-2 flex items-center justify-center bg-dark-bg rounded-lg">
            <p className={`text-xl font-bold ${isMyTurn ? 'text-coral animate-pulse' : 'text-gray-400'}`}>
                {isMyTurn ? 'Your Turn!' : `${currentPlayer?.name}'s Turn...`}
            </p>
        </div>
        
        <WordPreview word={currentWord} isVerifying={isVerifying} />
        
        <Grid
          gridData={grid}
          onWordSubmit={handleWordSubmit}
          disabled={gameState !== 'PLAYING' || isVerifying || !isMyTurn}
          onWordChange={setCurrentWord}
        />
      </div>
    </div>
  );
};

export default GameUI;
