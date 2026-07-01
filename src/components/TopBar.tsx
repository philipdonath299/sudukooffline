import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { useSettingsStore } from '../store/settingsStore';

export const TopBar: React.FC = () => {
  const { difficulty, mistakes, timer, setTimer, isPaused, isGameOver } = useGameStore();
  const { mistakeLimit, timerEnabled } = useSettingsStore();

  useEffect(() => {
    if (!timerEnabled || isPaused || isGameOver) return;
    
    // We use a small timeout trick to avoid React warning on rapid state updates during render
    const timeout = setTimeout(() => {
      setTimer(timer + 1);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [timer, timerEnabled, isPaused, isGameOver, setTimer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="w-full max-w-lg mx-auto flex justify-between items-center px-4 mb-2 sm:mb-4 text-sm font-medium text-[var(--text-secondary)] select-none">
      <div>{difficulty}</div>
      <div className="flex space-x-6">
        <div>Mistakes: {mistakes}{mistakeLimit ? `/${mistakeLimit}` : ''}</div>
        {timerEnabled && <div>{formatTime(timer)}</div>}
      </div>
    </div>
  );
};
