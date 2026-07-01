import React from 'react';
import { useGameStore } from '../store/gameStore';
import { useSettingsStore } from '../store/settingsStore';
import { cn } from '../utils/cn';
import { Eraser, Lightbulb, Undo2, Pencil } from 'lucide-react';

export const InputPad: React.FC = () => {
  const { 
    inputNumber, erase, undo, hint, toggleNotesMode, notesMode, 
    selectedNumber, selectNumber, hintsUsed 
  } = useGameStore();
  const { inputMode } = useSettingsStore();

  const handleNumberClick = (num: number) => {
    if (inputMode === 'number-first') {
      selectNumber(num);
    } else {
      inputNumber(num);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-4 sm:mt-6 px-2 sm:px-0 select-none">
      {/* Action Controls */}
      <div className="flex justify-between items-center mb-6 sm:mb-8 px-4 max-w-sm mx-auto">
        <button onClick={undo} className="flex flex-col items-center text-[var(--text-secondary)] hover:text-accent transition-colors active:scale-95">
          <div className="bg-[var(--bg-secondary)] p-3 rounded-full shadow-sm mb-1"><Undo2 size={24} /></div>
          <span className="text-xs font-medium">Undo</span>
        </button>
        <button onClick={erase} className="flex flex-col items-center text-[var(--text-secondary)] hover:text-accent transition-colors active:scale-95">
          <div className="bg-[var(--bg-secondary)] p-3 rounded-full shadow-sm mb-1"><Eraser size={24} /></div>
          <span className="text-xs font-medium">Erase</span>
        </button>
        <button onClick={toggleNotesMode} className={cn("flex flex-col items-center transition-colors active:scale-95", notesMode ? "text-accent" : "text-[var(--text-secondary)] hover:text-accent")}>
          <div className={cn("p-3 rounded-full shadow-sm mb-1", notesMode ? "bg-accent text-[var(--bg-primary)]" : "bg-[var(--bg-secondary)]")}><Pencil size={24} /></div>
          <span className="text-xs font-medium">Notes</span>
        </button>
        <button onClick={hint} className="flex flex-col items-center text-[var(--text-secondary)] hover:text-accent transition-colors active:scale-95 relative">
          <div className="bg-[var(--bg-secondary)] p-3 rounded-full shadow-sm mb-1"><Lightbulb size={24} /></div>
          <span className="text-xs font-medium">Hint</span>
          {hintsUsed > 0 && <span className="absolute -top-1 -right-1 bg-accent text-[var(--bg-primary)] text-[10px] w-4 h-4 flex items-center justify-center rounded-full">{hintsUsed}</span>}
        </button>
      </div>

      {/* Number Pad */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleNumberClick(num)}
            className={cn(
              "aspect-[4/5] sm:aspect-square flex items-center justify-center text-3xl sm:text-4xl rounded-xl shadow-sm transition-all duration-150 active:scale-95",
              inputMode === 'number-first' && selectedNumber === num
                ? "bg-accent text-[var(--bg-primary)] font-semibold"
                : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--cell-bg-highlight)] font-medium"
            )}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};
