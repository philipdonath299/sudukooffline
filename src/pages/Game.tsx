import React, { useEffect } from 'react';
import { Board } from '../components/Board';
import { InputPad } from '../components/InputPad';
import { TopBar } from '../components/TopBar';
import { Confetti } from '../components/Confetti';
import { useGameStore } from '../store/gameStore';

export const Game: React.FC = () => {
  const newGame = useGameStore(state => state.newGame);
  const board = useGameStore(state => state.board);

  useEffect(() => {
    // Generate new game if board is empty/uninitialized
    let isInitialized = false;
    if (board && board.length === 9 && board[0].length === 9) {
      for (let r = 0; r < 9; r++) {
         for (let c = 0; c < 9; c++) {
            if (board[r][c].value !== 0) isInitialized = true;
         }
      }
    }
    
    if (!isInitialized) {
      newGame('Medium');
    }
  }, [board, newGame]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col items-center pt-safe-area-pt pb-safe-area-pb">
      <header className="w-full max-w-lg px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Sudoku</h1>
        <button onClick={() => newGame('Medium')} className="text-sm font-medium text-accent hover:text-accent-hover transition-colors">
          New Game
        </button>
      </header>
      
      <main className="w-full flex-1 flex flex-col justify-center max-w-xl mx-auto px-2 sm:px-4 pb-8">
        <TopBar />
        <Board />
        <InputPad />
      </main>
      <Confetti trigger={useGameStore(state => state.isGameOver)} />
    </div>
  );
};
