import type { Board } from '../types';

export const emptyBoard = (): Board => Array(9).fill(null).map(() => Array(9).fill(0));

export const isValidPos = (board: Board, row: number, col: number, num: number): boolean => {
  for (let i = 0; i < 9; i++) {
    // Check row
    if (board[row][i] === num && i !== col) return false;
    // Check col
    if (board[i][col] === num && i !== row) return false;
    
    // Check box
    const boxRow = Math.floor(row / 3) * 3 + Math.floor(i / 3);
    const boxCol = Math.floor(col / 3) * 3 + i % 3;
    if (board[boxRow][boxCol] === num && (boxRow !== row || boxCol !== col)) return false;
  }
  return true;
};

export const solveSudoku = (board: Board): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValidPos(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
};

// Returns number of solutions. If it finds 2, it early exits.
export const countSolutions = (board: Board, limit: number = 2): number => {
  let solutions = 0;
  
  const solve = (b: Board) => {
    if (solutions >= limit) return;
    
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (b[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValidPos(b, row, col, num)) {
              b[row][col] = num;
              solve(b);
              b[row][col] = 0;
            }
          }
          return;
        }
      }
    }
    solutions++;
  };
  
  solve(board.map(r => [...r]));
  return solutions;
};

export const hasUniqueSolution = (board: Board): boolean => {
  return countSolutions(board) === 1;
};
