import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, TileData, Player, FoundWord, ScorePopupInfo, Multiplier, PowerUpType, Achievement, ParticleEffect } from '../types';
import { GRID_SIZE, TOTAL_ROUNDS, LETTER_SCORES, RARE_LETTERS, BONUS_POINTS, LETTER_DISTRIBUTION, TURN_TIME_LIMIT, COMBO_TIME_WINDOW, ACHIEVEMENTS, POWER_UP_TYPES } from '../constants';
import { isValidWord } from '../lib/gemini';

const initialPlayers: Player[] = [
  { id: 'p1', name: 'Player 1', score: 0, combo: 0, streak: 0, achievements: [], timeBonus: 0 },
  { id: 'p2', name: 'Bot Alice', score: 0, combo: 0, streak: 0, achievements: [], timeBonus: 0 },
  { id: 'p3', name: 'Bot Bob', score: 0, combo: 0, streak: 0, achievements: [], timeBonus: 0 },
  { id: 'p4', name: 'Bot Charlie', score: 0, combo: 0, streak: 0, achievements: [], timeBonus: 0 },
  { id: 'p5', name: 'Bot Dave', score: 0, combo: 0, streak: 0, achievements: [], timeBonus: 0 },
  { id: 'p6', name: 'Bot Eve', score: 0, combo: 0, streak: 0, achievements: [], timeBonus: 0 },
];

const generateNewTile = (id: number): TileData => {
    const letter = LETTER_DISTRIBUTION[Math.floor(Math.random() * LETTER_DISTRIBUTION.length)];
    let multiplier: Multiplier = null;
    let powerUp: PowerUpType | undefined = undefined;
    let isPowerUp = false;

    const rand = Math.random();
    if (rand < 0.02) multiplier = '3X';
    else if (rand < 0.06) multiplier = '2X';
    else if (rand < 0.15) multiplier = 'DL';
    else if (rand < 0.18) {
      // Power-up tile
      powerUp = POWER_UP_TYPES[Math.floor(Math.random() * POWER_UP_TYPES.length)];
      isPowerUp = true;
    }

    return { id, letter, multiplier, powerUp, isPowerUp };
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
  const [timeLeft, setTimeLeft] = useState(TURN_TIME_LIMIT);
  const [comboTimer, setComboTimer] = useState<number | null>(null);
  const [particleEffects, setParticleEffects] = useState<ParticleEffect[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>(
    Object.keys(ACHIEVEMENTS).map(id => ({
      id,
      ...ACHIEVEMENTS[id as keyof typeof ACHIEVEMENTS],
      unlocked: false
    }))
  );

  const timerRef = useRef<number | null>(null);

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
    setTimeLeft(TURN_TIME_LIMIT); // Reset timer for next player
  }, [currentPlayerIndex, players.length, currentRound]);

  // Timer effect
  useEffect(() => {
    if (gameState === 'PLAYING' && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 100);
      }, 100);
    } else if (timeLeft <= 0 && gameState === 'PLAYING') {
      // Time's up - advance turn (use setTimeout to avoid synchronous setState)
      setTimeout(() => advanceTurn(), 0);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, gameState, advanceTurn]);

  // Combo timer effect
  useEffect(() => {
    if (comboTimer) {
      const timeout = setTimeout(() => {
        setComboTimer(null);
        // Reset combo if time window expires
        setPlayers(prev => prev.map(p => ({ ...p, combo: 0 })));
      }, COMBO_TIME_WINDOW);
      return () => clearTimeout(timeout);
    }
  }, [comboTimer]);

  const addParticleEffect = useCallback((type: ParticleEffect['type'], x: number, y: number, value?: string | number, color?: string) => {
    const particle: ParticleEffect = {
      id: Date.now().toString(),
      type,
      x,
      y,
      value,
      color
    };
    setParticleEffects(prev => [...prev, particle]);
    setTimeout(() => {
      setParticleEffects(prev => prev.filter(p => p.id !== particle.id));
    }, 2000);
  }, []);

  const unlockAchievement = useCallback((achievementId: string) => {
    setAchievements(prev => prev.map(a => 
      a.id === achievementId ? { ...a, unlocked: true, unlockedAt: Date.now() } : a
    ));
    setPlayers(prev => prev.map(p => 
      p.id === 'p1' ? { ...p, achievements: [...p.achievements, achievementId] } : p
    ));
  }, []);

  const updateGridWithFallingTiles = useCallback((newTiles: TileData[]) => {
    setGrid(prevGrid => {
      const updatedGrid = [...prevGrid];
      // Replace random tiles with new ones (simulating falling tiles)
      for (let i = 0; i < Math.min(newTiles.length, updatedGrid.length); i++) {
        const randomIndex = Math.floor(Math.random() * updatedGrid.length);
        updatedGrid[randomIndex] = { ...newTiles[i], id: updatedGrid[randomIndex].id };
      }
      return updatedGrid;
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
    
    setFoundWords(prev => [{ word: 'BOT WORD', score: randomScore, bonuses: [] }, ...prev]);
    
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

    const startTime = Date.now();
    setIsVerifying(true);
    const isValid = await isValidWord(word);
    setIsVerifying(false);
    if (!isValid) return;

    const wordTime = Date.now() - startTime;
    const currentPlayer = players.find(p => p.id === 'p1')!;
    let comboMultiplier = Math.max(1, currentPlayer.combo);

    // Calculate base score
    let baseScore = 0, wordMultiplier = 1;
    const bonuses: string[] = [];
    let hasRareCombo = false;
    let powerUpBonus = 0;

    tiles.forEach(tile => {
      let letterScore = LETTER_SCORES[tile.letter] || 0;
      if (tile.multiplier === 'DL') letterScore *= 2;
      if (tile.multiplier === '2X') wordMultiplier *= 2;
      if (tile.multiplier === '3X') wordMultiplier *= 3;
      if (tile.isPowerUp) powerUpBonus += BONUS_POINTS.POWER_UP_USED;
      baseScore += letterScore;
    });

    // Check for rare letter combo
    if (tiles.filter(t => RARE_LETTERS.includes(t.letter)).length >= 2) {
      hasRareCombo = true;
    }

    let totalScore = (baseScore * wordMultiplier) + powerUpBonus;

    // Length bonuses
    if (word.length >= 9) { 
      totalScore += BONUS_POINTS.LENGTH_9_PLUS; 
      bonuses.push(`EPIC WORD! +${BONUS_POINTS.LENGTH_9_PLUS}`);
      setBonusBanner('EPIC WORD!');
    }
    else if (word.length >= 7) { 
      totalScore += BONUS_POINTS.LENGTH_7_8; 
      bonuses.push(`+${BONUS_POINTS.LENGTH_7_8}`);
    }
    else if (word.length >= 5) { 
      totalScore += BONUS_POINTS.LENGTH_5_6; 
      bonuses.push(`+${BONUS_POINTS.LENGTH_5_6}`);
    }

    // Special bonuses
    if (hasRareCombo) { 
      totalScore += BONUS_POINTS.RARE_LETTER_COMBO; 
      bonuses.push(`RARE COMBO +${BONUS_POINTS.RARE_LETTER_COMBO}`);
    }
    if (tiles.length === GRID_SIZE * GRID_SIZE) { 
      totalScore += BONUS_POINTS.PERFECT_SWEEP; 
      bonuses.push(`PERFECT SWEEP! +${BONUS_POINTS.PERFECT_SWEEP}`);
      setBonusBanner('PERFECT SWEEP!');
    }

    // Combo bonuses
    if (comboMultiplier >= 2) {
      const comboBonus = comboMultiplier === 2 ? BONUS_POINTS.COMBO_2X :
                         comboMultiplier === 3 ? BONUS_POINTS.COMBO_3X :
                         BONUS_POINTS.COMBO_5X;
      totalScore += comboBonus;
      bonuses.push(`${comboMultiplier}X COMBO! +${comboBonus}`);
    }

    // Time bonus
    if (wordTime < 3000) {
      totalScore += BONUS_POINTS.TIME_BONUS;
      bonuses.push(`SPEED BONUS +${BONUS_POINTS.TIME_BONUS}`);
    }

    // Apply combo multiplier to final score
    totalScore *= comboMultiplier;

    // Update player stats
    setPlayers(prevPlayers => {
        const updatedPlayers = prevPlayers.map(p => {
          if (p.id === 'p1') {
            const newCombo = comboMultiplier + 1;
            const newStreak = p.streak + 1;
            return { 
              ...p, 
              score: p.score + totalScore,
              combo: newCombo,
              streak: newStreak
            };
          }
          return p;
        });
        updatedPlayers.sort((a, b) => b.score - a.score);
        return updatedPlayers;
    });

    // Add found word
    const foundWord: FoundWord = {
      word,
      score: totalScore,
      bonuses,
      timestamp: Date.now(),
      comboMultiplier
    };
    setFoundWords(prev => [foundWord, ...prev]);

    // Add score popup
    setScorePopups(prev => [...prev, { 
      id: Date.now(), 
      score: totalScore, 
      bonuses,
      combo: comboMultiplier,
      isPowerUp: tiles.some(t => t.isPowerUp)
    }]);

    // Add particle effects
    addParticleEffect('score', 50, 50, totalScore, '#ff6b6b');
    if (comboMultiplier > 1) {
      addParticleEffect('combo', 50, 30, `${comboMultiplier}x`, '#00d4aa');
    }

    // Check achievements
    if (foundWords.length === 0) unlockAchievement('FIRST_WORD');
    if (word.length >= 7) unlockAchievement('LONG_WORD');
    if (hasRareCombo) unlockAchievement('RARE_COMBO');
    if (tiles.length === GRID_SIZE * GRID_SIZE) unlockAchievement('PERFECT_SWEEP');
    if (comboMultiplier >= 5) unlockAchievement('COMBO_MASTER');
    if (wordTime < 3000) unlockAchievement('SPEED_DEMON');

    // Reset combo timer
    if (comboTimer) clearTimeout(comboTimer);
    setComboTimer(setTimeout(() => {
      setPlayers(prev => prev.map(p => ({ ...p, combo: 0 })));
    }, COMBO_TIME_WINDOW));

    // Update grid and advance turn
    updateGridWithFallingTiles(tiles);
    setTimeout(() => setBonusBanner(null), 2000);
    setTimeout(advanceTurn, 800);
  }, [isVerifying, foundWords, advanceTurn, updateGridWithFallingTiles, players, comboTimer, addParticleEffect, unlockAchievement]);

  const startGame = useCallback(() => {
    const newGrid = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => generateNewTile(i));
    setGrid(newGrid);
    setPlayers(initialPlayers.map(p => ({ ...p, score: 0, combo: 0, streak: 0, achievements: [], timeBonus: 0 })));
    setCurrentPlayerIndex(0);
    setCurrentRound(1);
    setFoundWords([]);
    setScorePopups([]);
    setTimeLeft(TURN_TIME_LIMIT);
    setParticleEffects([]);
    setAchievements(Object.keys(ACHIEVEMENTS).map(id => ({
      id,
      ...ACHIEVEMENTS[id as keyof typeof ACHIEVEMENTS],
      unlocked: false
    })));
    setGameState('PLAYING');
  }, []);

  const playAgain = useCallback(() => {
    setGameState('LOBBY');
    setPlayers(initialPlayers);
    setTimeLeft(TURN_TIME_LIMIT);
    setParticleEffects([]);
  }, []);

  return { 
    gameState, 
    grid, 
    players, 
    currentPlayerIndex, 
    currentRound, 
    foundWords, 
    scorePopups, 
    bonusBanner, 
    isVerifying, 
    timeLeft,
    particleEffects,
    achievements,
    startGame, 
    handleWordSubmit, 
    playAgain 
  };
};
