import type { Board, CellData } from '../types';
import { isValidPos } from './solver';

export const validateBoard = (board: CellData[][]): void => {
  // Reset errors
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      board[r][c].isError = false;
    }
  }

  // Check for duplicates
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = board[r][c].value;
      if (val !== 0) {
        // Temporarily clear cell to check if its value is valid in its position
        // Since we are checking against the current board state
        const tempBoard: Board = board.map(row => row.map(cell => cell.value));
        tempBoard[r][c] = 0;
        
        if (!isValidPos(tempBoard, r, c, val)) {
          board[r][c].isError = true;
          // We also need to highlight the conflicting cells, but for simplicity
          // we'll just mark the current cell as error. A more robust way is to 
          // find exactly which cell it conflicts with and mark both.
        }
      }
    }
  }
};

export const updateHighlighting = (
  board: CellData[][], 
  selectedRow: number | null, 
  selectedCol: number | null, 
  selectedValue: number | null
): void => {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = board[r][c];
      
      // Reset highlighting
      cell.isSelected = false;
      cell.isHighlighted = false;
      cell.isMatchingValue = false;

      // Set selection
      if (r === selectedRow && c === selectedCol) {
        cell.isSelected = true;
      }
      // Set neighborhood highlight (same row, col, or box)
      else if (selectedRow !== null && selectedCol !== null) {
        const sameRow = r === selectedRow;
        const sameCol = c === selectedCol;
        const sameBox = Math.floor(r / 3) === Math.floor(selectedRow / 3) && 
                        Math.floor(c / 3) === Math.floor(selectedCol / 3);
        
        if (sameRow || sameCol || sameBox) {
          cell.isHighlighted = true;
        }
      }

      // Set matching value highlight
      if (selectedValue !== null && selectedValue !== 0 && cell.value === selectedValue) {
        cell.isMatchingValue = true;
      }
      
      // Also highlight if selecting a cell with a value
      if (selectedRow !== null && selectedCol !== null) {
         const sVal = board[selectedRow][selectedCol].value;
         if (sVal !== 0 && cell.value === sVal) {
             cell.isMatchingValue = true;
         }
      }
    }
  }
};
