import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useUiStore } from '../store/uiStore';
import { useGameStore } from '../store/gameStore';
import { useSettingsStore } from '../store/settingsStore';
import { Button } from '../components/ui/Button';
import { Toggle } from '../components/ui/Toggle';
import { Card } from '../components/ui/Card';
import { Select } from '../components/ui/Select';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import type { Difficulty } from '../types';

export const NewGameSetup: React.FC = () => {
  const setScreen = useUiStore(state => state.setScreen);
  const newGame = useGameStore(state => state.newGame);
  const settings = useSettingsStore();

  const [difficulty, setDifficulty] = useState<Difficulty>(settings.defaultDifficulty);
  const [timerEnabled, setTimerEnabled] = useState(settings.timerEnabled);
  const [mistakeLimit, setMistakeLimit] = useState<number | null>(settings.mistakeLimit);
  const [autoCheck, setAutoCheck] = useState(settings.autoCheck);
  const [autoRemoveNotes, setAutoRemoveNotes] = useState(settings.autoRemoveNotes);
  const [highlightMatching, setHighlightMatching] = useState(settings.highlightMatchingNumbers);

  const difficultyDescriptions: Record<Difficulty, string> = {
    Beginner: "A great place to start. Very few empty cells.",
    Easy: "Relaxing gameplay for casual solving.",
    Medium: "A balanced challenge for regular players.",
    Hard: "Requires intermediate solving techniques.",
    Expert: "Advanced techniques needed. Very challenging.",
    Evil: "Fiendishly difficult. For masters only.",
    Extreme: "The ultimate test of logic and patience."
  };

  const handleStart = () => {
    // We update settings before starting so they apply to this game
    settings.updateSetting('timerEnabled', timerEnabled);
    settings.updateSetting('mistakeLimit', mistakeLimit);
    settings.updateSetting('autoCheck', autoCheck);
    settings.updateSetting('autoRemoveNotes', autoRemoveNotes);
    settings.updateSetting('highlightMatchingNumbers', highlightMatching);
    
    newGame(difficulty);
    setScreen('game');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center pb-8"
    >
      <ScreenHeader title="New Game Setup" />

      <div className="w-full max-w-lg px-4 flex flex-col gap-4">
        <Card>
          <Select 
            label="Difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            options={[
              { label: 'Beginner', value: 'Beginner' },
              { label: 'Easy', value: 'Easy' },
              { label: 'Medium', value: 'Medium' },
              { label: 'Hard', value: 'Hard' },
              { label: 'Expert', value: 'Expert' },
              { label: 'Evil', value: 'Evil' },
              { label: 'Extreme', value: 'Extreme' },
            ]}
          />
          <p className="text-sm text-[var(--text-secondary)] mt-2 ml-1">
            {difficultyDescriptions[difficulty]}
          </p>
        </Card>

        <Card>
          <div className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 ml-1">Game Options</div>
          
          <Toggle 
            label="Timer" 
            description="Track how long it takes to solve"
            checked={timerEnabled} 
            onChange={setTimerEnabled} 
          />
          
          <div className="w-full h-px bg-[var(--border-color)]/50 my-1" />
          
          <Select 
            label="Mistake Limit"
            value={mistakeLimit === null ? 'none' : mistakeLimit.toString()}
            onChange={(e) => setMistakeLimit(e.target.value === 'none' ? null : parseInt(e.target.value))}
            options={[
              { label: 'Unlimited', value: 'none' },
              { label: '3 Mistakes', value: '3' },
              { label: '5 Mistakes', value: '5' },
            ]}
          />
        </Card>

        <Card>
          <div className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 ml-1">Assistance</div>
          
          <Toggle 
            label="Auto Check" 
            description="Immediately highlight incorrect placements"
            checked={autoCheck} 
            onChange={setAutoCheck} 
          />
          <div className="w-full h-px bg-[var(--border-color)]/50 my-1" />
          <Toggle 
            label="Highlight Matching" 
            description="Highlight all instances of the selected number"
            checked={highlightMatching} 
            onChange={setHighlightMatching} 
          />
          <div className="w-full h-px bg-[var(--border-color)]/50 my-1" />
          <Toggle 
            label="Auto Remove Notes" 
            description="Remove notes when a number is placed in the same row, col, or box"
            checked={autoRemoveNotes} 
            onChange={setAutoRemoveNotes} 
          />
        </Card>

        <Button variant="primary" onClick={handleStart} className="mt-4 shadow-md py-4 text-lg">
          <Play className="mr-3" size={24} />
          Start Game
        </Button>
      </div>
    </motion.div>
  );
};
