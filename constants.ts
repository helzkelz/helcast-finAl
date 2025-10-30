
export const GRID_SIZE = 4;
export const TOTAL_ROUNDS = 5; // Each player gets 5 turns

export const LETTER_SCORES: { [key: string]: number } = {
  A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8, K: 5, L: 1, M: 3,
  N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1, U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10,
};

export const RARE_LETTERS = ['J', 'X', 'Q', 'Z'];

export const BONUS_POINTS = {
  LENGTH_5_6: 10,
  LENGTH_7_8: 20,
  LENGTH_9_PLUS: 40,
  RARE_LETTER_COMBO: 25,
  PERFECT_SWEEP: 50,
};

// Weighted letter distribution for more interesting grids
export const LETTER_DISTRIBUTION = 'AAAAAAAAABBCCDDDDEEEEEEEEEEEEFFGGGHHIIIIIIIIIJKLLLLMMNNNNNNOOOOOOOOPPQRRRRRRSSSSTTTTTTUUUUVVWWXYYZ';
