import React from 'react';
import { motion } from 'framer-motion';
import { useSettingsStore } from '../store/settingsStore';
import { Toggle } from '../components/ui/Toggle';
import { Card } from '../components/ui/Card';
import { Select } from '../components/ui/Select';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import type { Difficulty } from '../types';

export const SettingsScreen: React.FC = () => {
  const settings = useSettingsStore();

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center pb-8"
    >
      <ScreenHeader title="Settings" />

      <div className="w-full max-w-lg px-4 flex flex-col gap-6">
        
        <Card>
          <div className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 ml-1">Appearance</div>
          
          <Select 
            label="Theme"
            value={settings.darkMode.toString()}
            onChange={(e) => {
              const val = e.target.value;
              settings.updateSetting('darkMode', val === 'true' ? true : val === 'false' ? false : (val as 'system' | 'amoled'));
            }}
            options={[
              { label: 'System Default', value: 'system' },
              { label: 'Light (Paper)', value: 'false' },
              { label: 'Dark (Classic)', value: 'true' },
              { label: 'AMOLED (Pitch Black)', value: 'amoled' },
            ]}
          />
          
          <div className="w-full h-px bg-[var(--border-color)]/50 my-1" />
          
          <Select 
            label="Animation Speed"
            value={settings.animationSpeed}
            onChange={(e) => settings.updateSetting('animationSpeed', e.target.value as any)}
            options={[
              { label: 'Fast', value: 'fast' },
              { label: 'Normal', value: 'normal' },
              { label: 'Slow', value: 'slow' },
            ]}
          />
        </Card>

        <Card>
          <div className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 ml-1">Gameplay Defaults</div>
          
          <Select 
            label="Default Difficulty"
            value={settings.defaultDifficulty}
            onChange={(e) => settings.updateSetting('defaultDifficulty', e.target.value as Difficulty)}
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

          <div className="w-full h-px bg-[var(--border-color)]/50 my-2" />
          
          <Toggle 
            label="Default Timer" 
            checked={settings.timerEnabled} 
            onChange={(v) => settings.updateSetting('timerEnabled', v)} 
          />
          <div className="w-full h-px bg-[var(--border-color)]/50 my-1" />
          <Select 
            label="Default Mistake Limit"
            value={settings.mistakeLimit === null ? 'none' : settings.mistakeLimit.toString()}
            onChange={(e) => settings.updateSetting('mistakeLimit', e.target.value === 'none' ? null : parseInt(e.target.value))}
            options={[
              { label: 'Unlimited', value: 'none' },
              { label: '3 Mistakes', value: '3' },
              { label: '5 Mistakes', value: '5' },
            ]}
          />
          
          <div className="w-full h-px bg-[var(--border-color)]/50 my-2" />

          <Select 
            label="Default Input Mode"
            value={settings.inputMode}
            onChange={(e) => settings.updateSetting('inputMode', e.target.value as any)}
            options={[
              { label: 'Cell First (Tap cell, then number)', value: 'cell-first' },
              { label: 'Number First (Tap number, then cells)', value: 'number-first' },
            ]}
          />
        </Card>

        <Card>
          <div className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 ml-1">Audio & Haptics</div>
          
          <Toggle 
            label="Master Sound" 
            checked={settings.masterSound} 
            onChange={(v) => settings.updateSetting('masterSound', v)} 
          />
          <div className="w-full h-px bg-[var(--border-color)]/50 my-1" />
          <Toggle 
            label="Button Sounds" 
            checked={settings.buttonSounds} 
            onChange={(v) => settings.updateSetting('buttonSounds', v)} 
          />
          <div className="w-full h-px bg-[var(--border-color)]/50 my-1" />
          <Toggle 
            label="Win Sound" 
            checked={settings.winSound} 
            onChange={(v) => settings.updateSetting('winSound', v)} 
          />
          <div className="w-full h-px bg-[var(--border-color)]/50 my-1" />
          <Toggle 
            label="Haptic Feedback" 
            checked={settings.haptics} 
            onChange={(v) => settings.updateSetting('haptics', v)} 
          />
        </Card>

        <Card>
          <div className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 ml-1">Accessibility</div>
          
          <Toggle 
            label="Larger Numbers" 
            checked={settings.largerNumbers} 
            onChange={(v) => settings.updateSetting('largerNumbers', v)} 
          />
          <div className="w-full h-px bg-[var(--border-color)]/50 my-1" />
          <Toggle 
            label="High Contrast" 
            checked={settings.highContrast} 
            onChange={(v) => settings.updateSetting('highContrast', v)} 
          />
          <div className="w-full h-px bg-[var(--border-color)]/50 my-1" />
          <Toggle 
            label="Colorblind Mode" 
            checked={settings.colorblindMode} 
            onChange={(v) => settings.updateSetting('colorblindMode', v)} 
          />
          <div className="w-full h-px bg-[var(--border-color)]/50 my-1" />
          <Toggle 
            label="Reduce Motion" 
            checked={settings.reduceMotion} 
            onChange={(v) => settings.updateSetting('reduceMotion', v)} 
          />
        </Card>

      </div>
    </motion.div>
  );
};
