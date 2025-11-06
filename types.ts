export type Multiplier = 'DL' | '2X' | '3X' | null;
export type PowerUpType = 'BOMB' | 'SHUFFLE' | 'TIME_BONUS' | 'SCORE_MULTIPLIER';

export interface TileData {
  id: number;
  letter: string;
  multiplier: Multiplier;
  powerUp?: PowerUpType;
  isPowerUp?: boolean;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  combo: number;
  streak: number;
  achievements: string[];
  timeBonus: number;
  isReady?: boolean;
  isHost?: boolean;
}

export type GameState = 'LOBBY' | 'PLAYING' | 'GAME_OVER';

export interface FoundWord {
  word: string;
  score: number;
  bonuses: string[];
  timestamp: number;
  comboMultiplier: number;
}

export interface ScorePopupInfo {
  id: number;
  score: number;
  bonuses: string[];
  combo?: number;
  isPowerUp?: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
}

export interface GameStats {
  totalWords: number;
  totalScore: number;
  longestWord: string;
  highestCombo: number;
  averageWordLength: number;
  timeSpent: number;
  achievements: Achievement[];
}

export interface ParticleEffect {
  id: string;
  type: 'score' | 'combo' | 'achievement' | 'powerup';
  x: number;
  y: number;
  value?: string | number;
  color?: string;
}

export interface GameRoom {
  id: string;
  players: Player[];
  gameState: GameState;
  maxPlayers: number;
  host: string;
  currentPlayerIndex?: number;
  currentRound?: number;
  grid?: TileData[];
  foundWords?: FoundWord[];
  timeLeft?: number;
}

export interface ChatMessage {
  playerName: string;
  message: string;
  timestamp: number;
}
