export type Difficulty = 'Beginner' | 'Easy' | 'Medium' | 'Hard' | 'Expert' | 'Evil' | 'Extreme';

export interface CellData {
  row: number;
  col: number;
  value: number; // 0 means empty
  isFixed: boolean;
  notes: number[]; // Using array for easier JSON serialization
  isError: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  isMatchingValue: boolean;
}

export type Board = number[][]; // 9x9 array

export interface GameSettings {
  darkMode: boolean | 'system' | 'amoled';
  haptics: boolean;
  sound: boolean;
  highlightDuplicates: boolean;
  autoCheck: boolean;
  autoRemoveNotes: boolean;
  timerEnabled: boolean;
  mistakeLimit: number | null; // null for no limit
  inputMode: 'cell-first' | 'number-first';
  animationSpeed: 'fast' | 'normal' | 'slow';
  defaultDifficulty: Difficulty;
  masterSound: boolean;
  buttonSounds: boolean;
  winSound: boolean;
  largerNumbers: boolean;
  highContrast: boolean;
  colorblindMode: boolean;
  reduceMotion: boolean;
  showCandidates: boolean;
  highlightMatchingNumbers: boolean;
}

export interface GameHistoryState {
  board: CellData[][];
}

export interface GameState {
  board: CellData[][];
  solution: Board;
  difficulty: Difficulty;
  isPaused: boolean;
  isGameOver: boolean;
  timer: number;
  mistakes: number;
  hintsUsed: number;
  notesMode: boolean;
  selectedCell: { row: number; col: number } | null;
  selectedNumber: number | null;
  history: GameHistoryState[];
  historyIndex: number;
}
