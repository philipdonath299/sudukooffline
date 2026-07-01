import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import localforage from 'localforage';
import type { GameSettings } from '../types';

const lfStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await localforage.getItem(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await localforage.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await localforage.removeItem(name);
  },
};

interface SettingsState extends GameSettings {
  updateSetting: <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      darkMode: 'system',
      haptics: true,
      sound: true,
      highlightDuplicates: true,
      autoCheck: true,
      autoRemoveNotes: true,
      timerEnabled: true,
      mistakeLimit: 3,
      inputMode: 'cell-first',
      animationSpeed: 'normal',
      defaultDifficulty: 'Medium',
      masterSound: true,
      buttonSounds: true,
      winSound: true,
      largerNumbers: false,
      highContrast: false,
      colorblindMode: false,
      reduceMotion: false,
      showCandidates: false,
      highlightMatchingNumbers: true,
      updateSetting: (key, value) => set((state) => ({ ...state, [key]: value })),
    }),
    {
      name: 'sudoku-settings',
      storage: createJSONStorage(() => lfStorage),
    }
  )
);
