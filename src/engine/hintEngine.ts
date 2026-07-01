import type { CellData, Board } from '../types';
import { isValidPos } from './solver';

export interface HintResult {
  row: number;
  col: number;
  value: number;
  message: string;
}

const getCandidates = (board: CellData[][], row: number, col: number): number[] => {
  if (board[row][col].value !== 0) return [];
  const tempBoard: Board = board.map(r => r.map(c => c.value));
  const candidates: number[] = [];
  for (let num = 1; num <= 9; num++) {
    if (isValidPos(tempBoard, row, col, num)) {
      candidates.push(num);
    }
  }
  return candidates;
};

// 1. Naked Single
// A cell has only one possible candidate.
const findNakedSingle = (board: CellData[][]): HintResult | null => {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c].value === 0) {
        const candidates = getCandidates(board, r, c);
        if (candidates.length === 1) {
          return {
            row: r, col: c, value: candidates[0],
            message: `Naked Single: The only possible value for row ${r + 1}, column ${c + 1} is ${candidates[0]}.`
          };
        }
      }
    }
  }
  return null;
};

// 2. Hidden Single
// A candidate appears only once in a row, column, or box.
const findHiddenSingle = (board: CellData[][]): HintResult | null => {
  const allCandidates: number[][][] = Array(9).fill(null).map(() => Array(9).fill(null).map(() => []));
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      allCandidates[r][c] = getCandidates(board, r, c);
    }
  }

  for (let num = 1; num <= 9; num++) {
    // Check Rows
    for (let r = 0; r < 9; r++) {
      let count = 0, lastCol = -1;
      for (let c = 0; c < 9; c++) {
        if (allCandidates[r][c].includes(num)) { count++; lastCol = c; }
      }
      if (count === 1) return { row: r, col: lastCol, value: num, message: `Hidden Single: In row ${r + 1}, ${num} can only go in column ${lastCol + 1}.` };
    }

    // Check Cols
    for (let c = 0; c < 9; c++) {
      let count = 0, lastRow = -1;
      for (let r = 0; r < 9; r++) {
        if (allCandidates[r][c].includes(num)) { count++; lastRow = r; }
      }
      if (count === 1) return { row: lastRow, col: c, value: num, message: `Hidden Single: In column ${c + 1}, ${num} can only go in row ${lastRow + 1}.` };
    }

    // Check Boxes
    for (let box = 0; box < 9; box++) {
      const boxRow = Math.floor(box / 3) * 3;
      const boxCol = (box % 3) * 3;
      let count = 0, lastR = -1, lastC = -1;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          if (allCandidates[boxRow + r][boxCol + c].includes(num)) {
            count++; lastR = boxRow + r; lastC = boxCol + c;
          }
        }
      }
      if (count === 1) return { row: lastR, col: lastC, value: num, message: `Hidden Single: In box ${box + 1}, ${num} can only go in row ${lastR + 1}, column ${lastC + 1}.` };
    }
  }

  return null;
};

export const getHint = (board: CellData[][], solution: Board): HintResult | null => {
  let hint = findNakedSingle(board);
  if (hint) return hint;

  hint = findHiddenSingle(board);
  if (hint) return hint;

  // Fallback: Reveal a random correct cell
  const emptyCells: {r: number, c: number}[] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c].value === 0) emptyCells.push({r, c});
    }
  }

  if (emptyCells.length === 0) return null;

  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const correctValue = solution[randomCell.r][randomCell.c];
  
  return {
    row: randomCell.r,
    col: randomCell.c,
    value: correctValue,
    message: `Basic Hint: A ${correctValue} goes here.`
  };
};
