
import { useState, useEffect, useCallback } from 'react';
import { GameState, TileData, Player, FoundWord, ScorePopupInfo, Multiplier } from '../types';
import { GRID_SIZE, TOTAL_ROUNDS, LETTER_SCORES, RARE_LETTERS, BONUS_POINTS, LETTER_DISTRIBUTION } from '../constants';
import { isValidWord } from '../lib/gemini';

const initialPlayers: Player[] = [
  { id: 'p1', name: 'Player 1', score: 0 },
  { id: 'p2', name: 'Bot Alice', score: 0 },
  { id: 'p3', name: 'Bot Bob', score: 0 },
  { id: 'p4', name: 'Bot Charlie', score: 0 },
  { id: 'p5', name: 'Bot Dave', score: 0 },
  { id: 'p6', name: 'Bot Eve', score: 0 },
];

const generateNewTile = (id: number): TileData => {
    const letter = LETTER_DISTRIBUTION[Math.floor(Math.random() * LETTER_DISTRIBUTION.length)];
    let multiplier: Multiplier = null;
    const rand = Math.random();
    if (rand < 0.03) multiplier = '3X';
    else if (rand < 0.08) multiplier = '2X';
    else if (rand < 0.18) multiplier = 'DL';
    return { id, letter, multiplier };
};

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>('LOBBY');
  const [grid, setGrid] = useState<TileData[]>([]);
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [foundWords, setFoundWords] = useState<FoundWord[]>([]);
  const [scorePopups, setScorePopups] = useState<ScorePopupInfo[]>([]);
  const [bonusBanner, setBonusBanner] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const advanceTurn = useCallback(() => {
    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
    
    if (nextPlayerIndex === 0) { // A full round of turns has passed
        const nextRound = currentRound + 1;
        if (nextRound > TOTAL_ROUNDS) {
            setGameState('GAME_OVER');
            return;
        }
        setCurrentRound(nextRound);
    }
    setCurrentPlayerIndex(nextPlayerIndex);
  }, [currentPlayerIndex, players.length, currentRound]);

  const updateGridWithFallingTiles = useCallback((usedTiles: TileData[]) => {
    setGrid(currentGrid => {
        const nextGrid = [...currentGrid];
        const usedTileIds = new Set(usedTiles.map(t => t.id));
        
        for (let col = 0; col < GRID_SIZE; col++) {
            let emptySlots = 0;
            for (let row = GRID_SIZE - 1; row >= 0; row--) {
                const currentId = row * GRID_SIZE + col;
                if (usedTileIds.has(currentId)) {
                    emptySlots++;
                } else if (emptySlots > 0) {
                    const newId = (row + emptySlots) * GRID_SIZE + col;
                    nextGrid[newId] = { ...nextGrid[currentId], id: newId };
                }
            }
            for (let i = 0; i < emptySlots; i++) {
                const newId = i * GRID_SIZE + col;
                nextGrid[newId] = generateNewTile(newId);
            }
        }
        return nextGrid;
    });
  }, []);

  const handleBotTurn = useCallback(() => {
    if (gameState !== 'PLAYING') return;
    const bot = players[currentPlayerIndex];
    const randomScore = Math.floor(Math.random() * 35) + 8; // Score between 8 and 43

    // Simulate finding a word and replacing tiles
    const tilesToReplaceCount = Math.floor(Math.random() * 3) + 3; // 3 to 5 tiles
    const dummyTiles: TileData[] = Array.from({ length: tilesToReplaceCount }).map((_, i) => ({ id: i, letter: 'A', multiplier: null }));
    updateGridWithFallingTiles(dummyTiles);

    setPlayers(prevPlayers => {
        const updatedPlayers = prevPlayers.map(p => 
            p.id === bot.id ? { ...p, score: p.score + randomScore } : p
        );
        updatedPlayers.sort((a, b) => b.score - a.score);
        return updatedPlayers;
    });
    
    setFoundWords(prev => [{ word: `BOT WORD`, score: randomScore, bonuses: [] }, ...prev]);
    
    setTimeout(advanceTurn, 500); // Give a moment for tile animation before next turn
  }, [gameState, players, currentPlayerIndex, advanceTurn, updateGridWithFallingTiles]);

  useEffect(() => {
    if (gameState === 'PLAYING' && players[currentPlayerIndex]?.id !== 'p1') {
        const thinkTime = Math.random() * 1500 + 1000; // 1-2.5s
        const timeoutId = setTimeout(handleBotTurn, thinkTime);
        return () => clearTimeout(timeoutId);
    }
  }, [gameState, currentPlayerIndex, players, handleBotTurn]);

  const handleWordSubmit = useCallback(async (tiles: TileData[]) => {
    if (isVerifying || tiles.length < 3) return;
    const word = tiles.map(t => t.letter).join('');
    if (foundWords.some(fw => fw.word === word)) return;

    setIsVerifying(true);
    const isValid = await isValidWord(word);
    setIsVerifying(false);
    if (!isValid) return;

    let baseScore = 0, wordMultiplier = 1;
    const bonuses: string[] = [];
    tiles.forEach(tile => {
      let letterScore = LETTER_SCORES[tile.letter] || 0;
      if (tile.multiplier === 'DL') letterScore *= 2;
      if (tile.multiplier === '2X') wordMultiplier *= 2;
      if (tile.multiplier === '3X') wordMultiplier *= 3;
      baseScore += letterScore;
    });
    let totalScore = baseScore * wordMultiplier;

    if (word.length >= 9) { totalScore += BONUS_POINTS.LENGTH_9_PLUS; bonuses.push(`LONG WORD! +${BONUS_POINTS.LENGTH_9_PLUS}`); setBonusBanner('LONG WORD!'); }
    else if (word.length >= 7) { totalScore += BONUS_POINTS.LENGTH_7_8; bonuses.push(`+${BONUS_POINTS.LENGTH_7_8}`); }
    else if (word.length >= 5) { totalScore += BONUS_POINTS.LENGTH_5_6; bonuses.push(`+${BONUS_POINTS.LENGTH_5_6}`); }
    if (tiles.filter(t => RARE_LETTERS.includes(t.letter)).length >= 2) { totalScore += BONUS_POINTS.RARE_LETTER_COMBO; bonuses.push(`RARE COMBO +${BONUS_POINTS.RARE_LETTER_COMBO}`); }
    if (tiles.length === GRID_SIZE * GRID_SIZE) { totalScore += BONUS_POINTS.PERFECT_SWEEP; bonuses.push(`PERFECT SWEEP! +${BONUS_POINTS.PERFECT_SWEEP}`); setBonusBanner('PERFECT SWEEP!'); }
    setTimeout(() => setBonusBanner(null), 2000);

    setPlayers(prevPlayers => {
        const updatedPlayers = prevPlayers.map(p => p.id === 'p1' ? { ...p, score: p.score + totalScore } : p);
        updatedPlayers.sort((a, b) => b.score - a.score);
        return updatedPlayers;
    });
    setFoundWords(prev => [{ word, score: totalScore, bonuses }, ...prev]);
    setScorePopups(prev => [...prev, { id: Date.now(), score: totalScore, bonuses }]);
    updateGridWithFallingTiles(tiles);
    setTimeout(advanceTurn, 500);
  }, [isVerifying, foundWords, advanceTurn, updateGridWithFallingTiles]);

  const startGame = useCallback(() => {
    const newGrid = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => generateNewTile(i));
    setGrid(newGrid);
    setPlayers(initialPlayers.map(p => ({ ...p, score: 0 })));
    setCurrentPlayerIndex(0);
    setCurrentRound(1);
    setFoundWords([]);
    setGameState('PLAYING');
  }, []);

  const playAgain = useCallback(() => {
    setGameState('LOBBY');
    setPlayers(initialPlayers);
  }, []);

  return { gameState, grid, players, currentPlayerIndex, currentRound, foundWords, scorePopups, bonusBanner, isVerifying, startGame, handleWordSubmit, playAgain };
};
