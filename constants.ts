export const GRID_SIZE = 5; // Increased from 4 for more strategy
export const TOTAL_ROUNDS = 6; // Increased rounds for longer gameplay
export const TURN_TIME_LIMIT = 15000; // 15 seconds per turn
export const COMBO_TIME_WINDOW = 3000; // 3 seconds to maintain combo

export const LETTER_SCORES: { [key: string]: number } = {
  A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8, K: 5, L: 1, M: 3,
  N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1, U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10,
};

export const RARE_LETTERS = ['J', 'X', 'Q', 'Z'];
export const POWER_UP_TYPES = ['BOMB', 'SHUFFLE', 'TIME_BONUS', 'SCORE_MULTIPLIER'] as const;

export const BONUS_POINTS = {
  LENGTH_5_6: 15,
  LENGTH_7_8: 30,
  LENGTH_9_PLUS: 60,
  RARE_LETTER_COMBO: 35,
  PERFECT_SWEEP: 75,
  COMBO_2X: 25,
  COMBO_3X: 50,
  COMBO_5X: 100,
  STREAK_BONUS: 20,
  TIME_BONUS: 15,
  POWER_UP_USED: 10,
};

// Enhanced letter distribution with more variety
export const LETTER_DISTRIBUTION = 'AAAAAAAAABBBCCDDDDEEEEEEEEEEEEEFFGGGHHHIIIIIIIJKLLLLMMNNNNNNOOOOOOOOPPQRRRRRRSSSSTTTTTTUUUUVVWWXYYZ';

// Achievement definitions
export const ACHIEVEMENTS = {
  FIRST_WORD: { name: 'First Steps', description: 'Find your first word', icon: '🎯' },
  LONG_WORD: { name: 'Word Smith', description: 'Find a word with 7+ letters', icon: '📚' },
  RARE_COMBO: { name: 'Rare Collector', description: 'Use 2+ rare letters in one word', icon: '💎' },
  PERFECT_SWEEP: { name: 'Perfectionist', description: 'Clear the entire grid', icon: '⭐' },
  COMBO_MASTER: { name: 'Combo Master', description: 'Achieve a 5x combo', icon: '🔥' },
  SPEED_DEMON: { name: 'Speed Demon', description: 'Find a word in under 3 seconds', icon: '⚡' },
  HIGH_SCORER: { name: 'High Scorer', description: 'Score over 500 points in one game', icon: '🏆' },
};
