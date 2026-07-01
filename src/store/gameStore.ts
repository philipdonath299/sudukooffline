import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import localforage from 'localforage';
import type { GameState, Difficulty, CellData } from '../types';
import { useSettingsStore } from './settingsStore';
import { useStatsStore } from './statsStore';
import { generatePuzzle } from '../engine/generator';
import { validateBoard, updateHighlighting } from '../engine/validator';
import { getHint } from '../engine/hintEngine';
import { triggerHaptic } from '../utils/haptics';

const lfStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await localforage.getItem(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await localforage.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await localforage.removeItem(name);
  },
};

interface GameStore extends GameState {
  newGame: (difficulty: Difficulty) => void;
  selectCell: (row: number, col: number) => void;
  selectNumber: (num: number) => void;
  inputNumber: (num: number) => void;
  toggleNotesMode: () => void;
  erase: () => void;
  undo: () => void;
  hint: () => void;
  setTimer: (time: number) => void;
  togglePause: () => void;
  checkGameCompletion: (boardToCheck: CellData[][]) => void;
  hasSavedGame: () => boolean;
}

const createEmptyState = (): GameState => ({
  board: Array(9).fill(null).map((_, r) => Array(9).fill(null).map((_, c) => ({
    row: r, col: c, value: 0, isFixed: false, notes: [], isError: false,
    isSelected: false, isHighlighted: false, isMatchingValue: false
  }))),
  solution: [],
  difficulty: 'Medium',
  isPaused: false,
  isGameOver: false,
  timer: 0,
  mistakes: 0,
  hintsUsed: 0,
  notesMode: false,
  selectedCell: null,
  selectedNumber: null,
  history: [],
  historyIndex: -1,
});

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...createEmptyState(),

      hasSavedGame: () => {
        const { board, isGameOver } = get();
        if (isGameOver) return false;
        // Check if board has any values set by user
        for (let r = 0; r < 9; r++) {
          for (let c = 0; c < 9; c++) {
            if (board[r][c].value !== 0 && !board[r][c].isFixed) {
              return true;
            }
          }
        }
        return false;
      },

      newGame: (difficulty) => {
        const { puzzle, solution } = generatePuzzle(difficulty);
        const newBoard: CellData[][] = puzzle.map((row, r) =>
          row.map((val, c) => ({
            row: r, col: c, value: val, isFixed: val !== 0,
            notes: [], isError: false, isSelected: false,
            isHighlighted: false, isMatchingValue: false
          }))
        );
        
        set({
          board: newBoard,
          solution,
          difficulty,
          isPaused: false,
          isGameOver: false,
          timer: 0,
          mistakes: 0,
          hintsUsed: 0,
          notesMode: false,
          selectedCell: null,
          selectedNumber: null,
          history: [{ board: newBoard.map(r => r.map(c => ({...c, notes: [...c.notes]}))) }],
          historyIndex: 0
        });

        useStatsStore.getState().recordGameStarted(difficulty);
      },

      selectCell: (row, col) => {
        const { board, selectedNumber } = get();
        const newBoard = board.map((r: CellData[]) => r.map((c: CellData) => ({...c})));
        updateHighlighting(newBoard, row, col, selectedNumber);
        set({ board: newBoard, selectedCell: { row, col } });
        triggerHaptic('selection');
      },

      selectNumber: (num) => {
        const { board, selectedCell } = get();
        const row = selectedCell?.row ?? null;
        const col = selectedCell?.col ?? null;
        
        const newBoard = board.map((r: CellData[]) => r.map((c: CellData) => ({...c})));
        updateHighlighting(newBoard, row, col, num);
        
        set({ board: newBoard, selectedNumber: num });
      },

      inputNumber: (num) => {
        const { board, selectedCell, notesMode, solution, mistakes } = get();
        if (!selectedCell) return;
        const { row, col } = selectedCell;
        const cell = board[row][col];
        if (cell.isFixed) return;

        const newBoard = board.map((r: CellData[]) => r.map((c: CellData) => ({...c, notes: [...c.notes]})));
        const targetCell = newBoard[row][col];

        const historyCopy = get().history ? [...get().history] : [];
        const historyIndex = get().historyIndex ?? -1;
        const currentHistory = historyIndex >= 0 ? historyCopy.slice(0, historyIndex + 1) : [];

        currentHistory.push({
          board: board.map((r: CellData[]) => r.map((c: CellData) => ({...c, notes: [...c.notes]})))
        });

        let newMistakes = mistakes;

        if (notesMode) {
          if (targetCell.value !== 0) {
            targetCell.value = 0;
          }
          if (targetCell.notes.includes(num)) {
            targetCell.notes = targetCell.notes.filter(n => n !== num);
          } else {
            targetCell.notes.push(num);
            targetCell.notes.sort();
          }
        } else {
          if (targetCell.value === num) {
            targetCell.value = 0;
            triggerHaptic('selection');
          } else {
            targetCell.value = num;
            if (solution.length > 0 && num !== solution[row][col]) {
               newMistakes += 1;
               triggerHaptic('error');
            } else {
               triggerHaptic('success');
            }
          }
          targetCell.notes = [];
          
          const { autoRemoveNotes } = useSettingsStore.getState();
          if (autoRemoveNotes && targetCell.value !== 0) {
             for (let i = 0; i < 9; i++) {
                newBoard[row][i].notes = newBoard[row][i].notes.filter(n => n !== num);
                newBoard[i][col].notes = newBoard[i][col].notes.filter(n => n !== num);
             }
             const boxRow = Math.floor(row / 3) * 3;
             const boxCol = Math.floor(col / 3) * 3;
             for (let r = 0; r < 3; r++) {
               for (let c = 0; c < 3; c++) {
                 newBoard[boxRow + r][boxCol + c].notes = newBoard[boxRow + r][boxCol + c].notes.filter(n => n !== num);
               }
             }
          }
        }

        validateBoard(newBoard);
        updateHighlighting(newBoard, row, col, targetCell.value);

        set({ board: newBoard, history: currentHistory, historyIndex: currentHistory.length - 1, mistakes: newMistakes });
        get().checkGameCompletion(newBoard);
      },
      
      toggleNotesMode: () => set((state) => ({ notesMode: !state.notesMode })),
      
      erase: () => {
        const { board, selectedCell } = get();
        if (!selectedCell) return;
        const { row, col } = selectedCell;
        const cell = board[row][col];
        if (cell.isFixed || (cell.value === 0 && cell.notes.length === 0)) return;

        const historyCopy = get().history ? [...get().history] : [];
        const historyIndex = get().historyIndex ?? -1;
        const currentHistory = historyIndex >= 0 ? historyCopy.slice(0, historyIndex + 1) : [];
        currentHistory.push({
          board: board.map((r: CellData[]) => r.map((c: CellData) => ({...c, notes: [...c.notes]})))
        });

        const newBoard = board.map((r: CellData[]) => r.map((c: CellData) => ({...c, notes: [...c.notes]})));
        newBoard[row][col].value = 0;
        newBoard[row][col].notes = [];
        validateBoard(newBoard);
        updateHighlighting(newBoard, row, col, 0);

        set({ board: newBoard, history: currentHistory, historyIndex: currentHistory.length - 1 });
      },
      
      undo: () => {
        const { history, historyIndex, selectedCell, selectedNumber } = get();
        if (!history || historyIndex < 0) return;

        const previousState = history[historyIndex];
        const newBoard = previousState.board.map((r: CellData[]) => r.map((c: CellData) => ({...c, notes: [...c.notes]})));
        
        validateBoard(newBoard);
        updateHighlighting(newBoard, selectedCell?.row ?? null, selectedCell?.col ?? null, selectedNumber);

        set({ board: newBoard, historyIndex: historyIndex - 1 });
      },

      hint: () => {
        const { board, solution, hintsUsed } = get();
        if (solution.length === 0) return;
        const h = getHint(board, solution);
        if (h) {
          const newBoard = board.map((r: CellData[]) => r.map((c: CellData) => ({...c, notes: [...c.notes]})));
          newBoard[h.row][h.col].value = h.value;
          newBoard[h.row][h.col].notes = [];
          
          validateBoard(newBoard);
          updateHighlighting(newBoard, h.row, h.col, h.value);
          
          set({ board: newBoard, hintsUsed: hintsUsed + 1 });
          get().checkGameCompletion(newBoard);
          
          // Using standard alert for now; could upgrade to toast
          alert(h.message);
        } else {
           alert("No hints available. The board might be complete or broken.");
        }
      },

      setTimer: (time) => set({ timer: time }),
      togglePause: () => set((state) => ({ isPaused: !state.isPaused })),

      checkGameCompletion: (boardToCheck) => {
        const { solution, difficulty, timer, mistakes, hintsUsed, isGameOver } = get();
        if (isGameOver || solution.length === 0) return;
        
        let isComplete = true;
        for (let r = 0; r < 9; r++) {
          for (let c = 0; c < 9; c++) {
            if (boardToCheck[r][c].value !== solution[r][c]) {
              isComplete = false;
              break;
            }
          }
        }
        
        if (isComplete) {
          set({ isGameOver: true });
          useStatsStore.getState().recordGameCompletion(difficulty, timer, mistakes, hintsUsed);
          triggerHaptic('victory');
        }
      },
    }),
    {
      name: 'sudoku-game',
      storage: createJSONStorage(() => lfStorage),
    }
  )
);
