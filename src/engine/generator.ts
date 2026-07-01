import type { Board, Difficulty } from '../types';
import { emptyBoard, isValidPos, hasUniqueSolution } from './solver';

const shuffle = (array: number[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const generateFullBoard = (): Board => {
  const board = emptyBoard();
  
  const fillBoard = (b: Board): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (b[row][col] === 0) {
          const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          for (const num of numbers) {
            if (isValidPos(b, row, col, num)) {
              b[row][col] = num;
              if (fillBoard(b)) return true;
              b[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };
  
  fillBoard(board);
  return board;
};

const getHolesCount = (difficulty: Difficulty): number => {
  switch (difficulty) {
    case 'Beginner': return 20; // 61 given
    case 'Easy': return 30;     // 51 given
    case 'Medium': return 40;   // 41 given
    case 'Hard': return 50;     // 31 given
    case 'Expert': return 54;   // 27 given
    case 'Evil': return 58;     // 23 given
    case 'Extreme': return 64;  // 17 given (minimum for unique solution)
    default: return 40;
  }
};

export const generatePuzzle = (difficulty: Difficulty): { puzzle: Board, solution: Board } => {
  const solution = generateFullBoard();
  const puzzle = solution.map(r => [...r]);
  const cellsToRemove = getHolesCount(difficulty);
  
  const positions = shuffle(Array.from({length: 81}, (_, i) => i));
  
  let removed = 0;
  for (const pos of positions) {
    if (removed >= cellsToRemove) break;
    
    const row = Math.floor(pos / 9);
    const col = pos % 9;
    
    const temp = puzzle[row][col];
    puzzle[row][col] = 0;
    
    // Check if the puzzle still has a unique solution
    if (!hasUniqueSolution(puzzle)) {
      puzzle[row][col] = temp; // Put it back
    } else {
      removed++;
    }
  }
  
  return { puzzle, solution };
};
