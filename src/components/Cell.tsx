import React from 'react';
import { motion } from 'framer-motion';
import type { CellData } from '../types';
import { cn } from '../utils/cn';

interface CellProps {
  data: CellData;
  onClick: (row: number, col: number) => void;
}

export const Cell: React.FC<CellProps> = ({ data, onClick }) => {
  const { row, col, value, isFixed, notes, isError, isSelected, isHighlighted, isMatchingValue } = data;

  const renderNotes = () => {
    return (
      <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-[1px] sm:p-0.5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <div key={num} className="flex items-center justify-center">
            <span className={cn(
              "text-[0.55rem] sm:text-[0.65rem] leading-none select-none",
              notes.includes(num) ? "text-text-secondary" : "text-transparent"
            )}>
              {num}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const rightBorder = (col === 2 || col === 5) ? 'border-r-[3px] border-r-border-color z-10' : 'border-r border-r-border-color/30';
  const bottomBorder = (row === 2 || row === 5) ? 'border-b-[3px] border-b-border-color z-10' : 'border-b border-b-border-color/30';

  const isAltBox = (Math.floor(row / 3) + Math.floor(col / 3)) % 2 !== 0;

  return (
    <div
      onClick={() => onClick(row, col)}
      className={cn(
        "relative w-full aspect-square cursor-pointer touch-manipulation select-none flex items-center justify-center",
        "transition-colors duration-150",
        rightBorder, bottomBorder,
        isError ? 'bg-cell-bg-error' :
        isSelected ? 'bg-cell-bg-selected' :
        isHighlighted ? 'bg-cell-bg-highlight' : 
        isAltBox ? 'bg-[var(--cell-bg-alt)]' : 'bg-[var(--cell-bg)]'
      )}
    >
      {value !== 0 ? (
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className={cn(
            "text-xl sm:text-2xl md:text-3xl font-medium",
            isError ? "text-text-error" : 
            isSelected ? "text-white font-bold" :
            isFixed ? "text-text-fixed font-bold" : "text-text-input",
            isMatchingValue && !isSelected ? "scale-110 font-bold" : ""
          )}
        >
          {value}
        </motion.span>
      ) : (
        notes.length > 0 && renderNotes()
      )}
    </div>
  );
};
