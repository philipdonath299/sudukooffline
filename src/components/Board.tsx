import React from 'react';
import { Cell } from './Cell';
import { useGameStore } from '../store/gameStore';
import { useSettingsStore } from '../store/settingsStore';

export const Board: React.FC = () => {
  const board = useGameStore((state) => state.board);
  const selectCell = useGameStore((state) => state.selectCell);
  const inputMode = useSettingsStore((state) => state.inputMode);
  const selectedNumber = useGameStore((state) => state.selectedNumber);
  const inputNumber = useGameStore((state) => state.inputNumber);

  const handleCellClick = (row: number, col: number) => {
    selectCell(row, col);
    if (inputMode === 'number-first' && selectedNumber !== null) {
      inputNumber(selectedNumber);
    }
  };

  if (!board || board.length === 0 || board[0].length === 0) return null;

  return (
    <div className="w-full max-w-lg mx-auto bg-border-color border-2 border-border-color rounded-sm shadow-sm overflow-hidden select-none touch-manipulation">
      <div className="grid grid-cols-9 grid-rows-9 gap-[1px]">
        {board.map((row, rIndex) =>
          row.map((cell, cIndex) => (
            <Cell 
              key={`${rIndex}-${cIndex}`} 
              data={cell} 
              onClick={handleCellClick} 
            />
          ))
        )}
      </div>
    </div>
  );
};
