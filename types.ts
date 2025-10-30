
export type Multiplier = 'DL' | '2X' | '3X' | null;

export interface TileData {
  id: number;
  letter: string;
  multiplier: Multiplier;
}

export interface Player {
  id: string;
  name: string;
  score: number;
}

export type GameState = 'LOBBY' | 'PLAYING' | 'GAME_OVER';

export interface FoundWord {
  word: string;
  score: number;
  bonuses: string[];
}

export interface ScorePopupInfo {
  id: number;
  score: number;
  bonuses: string[];
}
