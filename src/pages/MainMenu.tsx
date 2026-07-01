import React from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Trophy, Settings, HelpCircle, Info, Calendar } from 'lucide-react';
import { useUiStore } from '../store/uiStore';
import { useGameStore } from '../store/gameStore';
import { Button } from '../components/ui/Button';

export const MainMenu: React.FC = () => {
  const setScreen = useUiStore(state => state.setScreen);
  const hasSavedGame = useGameStore(state => state.hasSavedGame());

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col items-center justify-center p-6"
    >
      <div className="w-full max-w-sm flex flex-col gap-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Sudoku</h1>
          <p className="text-[var(--text-secondary)] font-medium">Daily Brain Training</p>
        </div>

        {hasSavedGame && (
          <Button variant="primary" onClick={() => setScreen('game')} className="shadow-md py-4 text-lg">
            <Play className="mr-3" size={24} />
            Continue Game
          </Button>
        )}

        <Button variant={hasSavedGame ? 'secondary' : 'primary'} onClick={() => setScreen('new-game')} className={!hasSavedGame ? "shadow-md py-4 text-lg" : ""}>
          <RotateCcw className="mr-3" size={hasSavedGame ? 20 : 24} />
          New Game
        </Button>

        <Button variant="secondary" onClick={() => alert('Coming Soon!')}>
          <Calendar className="mr-3" size={20} />
          Daily Challenge
        </Button>

        <div className="grid grid-cols-2 gap-4 mt-2">
          <Button variant="secondary" onClick={() => setScreen('stats')} className="flex-col py-6 gap-2">
            <Trophy size={28} className="text-[var(--text-secondary)]" />
            <span className="text-sm">Statistics</span>
          </Button>
          <Button variant="secondary" onClick={() => setScreen('achievements')} className="flex-col py-6 gap-2">
            <Trophy size={28} className="text-[var(--text-secondary)]" />
            <span className="text-sm">Achievements</span>
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-2">
          <Button variant="secondary" onClick={() => setScreen('settings')} className="p-4" title="Settings">
            <Settings size={22} className="text-[var(--text-secondary)] mx-auto" />
          </Button>
          <Button variant="secondary" onClick={() => alert('How to play placeholder')} className="p-4" title="How to Play">
            <HelpCircle size={22} className="text-[var(--text-secondary)] mx-auto" />
          </Button>
          <Button variant="secondary" onClick={() => alert('About placeholder')} className="p-4" title="About">
            <Info size={22} className="text-[var(--text-secondary)] mx-auto" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
