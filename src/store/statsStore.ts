import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import localforage from 'localforage';
import type { Difficulty } from '../types';

export interface GameStats {
  gamesPlayed: number;
  gamesCompleted: number;
  fastestTime: number | null;
  averageTime: number;
  currentStreak: number;
  longestStreak: number;
  totalMistakes: number;
  totalHints: number;
  perfectGames: number; // 0 mistakes, 0 hints
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: number | null; // timestamp
}

interface StatsState {
  statsByDifficulty: Record<Difficulty, GameStats>;
  globalStats: GameStats;
  achievements: Achievement[];
  recordGameCompletion: (difficulty: Difficulty, time: number, mistakes: number, hints: number) => void;
  recordGameStarted: (difficulty: Difficulty) => void;
}

const emptyStats: GameStats = {
  gamesPlayed: 0,
  gamesCompleted: 0,
  fastestTime: null,
  averageTime: 0,
  currentStreak: 0,
  longestStreak: 0,
  totalMistakes: 0,
  totalHints: 0,
  perfectGames: 0,
};

const defaultAchievements: Achievement[] = [
  { id: 'first_win', name: 'First Win', description: 'Complete your first Sudoku puzzle.', unlockedAt: null },
  { id: 'win_10', name: '10 Wins', description: 'Complete 10 Sudoku puzzles.', unlockedAt: null },
  { id: 'win_100', name: '100 Wins', description: 'Complete 100 Sudoku puzzles.', unlockedAt: null },
  { id: 'perfect', name: 'Perfection', description: 'Win without making any mistakes or using hints.', unlockedAt: null },
  { id: 'speed_demon', name: 'Speed Demon', description: 'Complete a puzzle in under 5 minutes.', unlockedAt: null },
];

const lfStorage = {
  getItem: async (name: string): Promise<string | null> => (await localforage.getItem(name)) || null,
  setItem: async (name: string, value: string): Promise<void> => { await localforage.setItem(name, value); },
  removeItem: async (name: string): Promise<void> => { await localforage.removeItem(name); },
};

export const useStatsStore = create<StatsState>()(
  persist(
    (set) => ({
      statsByDifficulty: {
        Beginner: { ...emptyStats },
        Easy: { ...emptyStats },
        Medium: { ...emptyStats },
        Hard: { ...emptyStats },
        Expert: { ...emptyStats },
        Evil: { ...emptyStats },
        Extreme: { ...emptyStats },
      },
      globalStats: { ...emptyStats },
      achievements: defaultAchievements,

      recordGameStarted: (difficulty) => set((state) => {
        const newStats = { ...state.statsByDifficulty };
        newStats[difficulty] = { ...newStats[difficulty], gamesPlayed: newStats[difficulty].gamesPlayed + 1 };
        return {
          statsByDifficulty: newStats,
          globalStats: { ...state.globalStats, gamesPlayed: state.globalStats.gamesPlayed + 1 }
        };
      }),

      recordGameCompletion: (difficulty, time, mistakes, hints) => set((state) => {
        const isPerfect = mistakes === 0 && hints === 0;
        
        const updateStats = (old: GameStats): GameStats => {
          const newCompleted = old.gamesCompleted + 1;
          return {
            ...old,
            gamesCompleted: newCompleted,
            fastestTime: old.fastestTime ? Math.min(old.fastestTime, time) : time,
            averageTime: old.averageTime === 0 ? time : (old.averageTime * old.gamesCompleted + time) / newCompleted,
            currentStreak: old.currentStreak + 1,
            longestStreak: Math.max(old.longestStreak, old.currentStreak + 1),
            totalMistakes: old.totalMistakes + mistakes,
            totalHints: old.totalHints + hints,
            perfectGames: old.perfectGames + (isPerfect ? 1 : 0),
          };
        };

        const newGlobal = updateStats(state.globalStats);
        const diffStats = { ...state.statsByDifficulty, [difficulty]: updateStats(state.statsByDifficulty[difficulty]) };

        const newAchievements = [...state.achievements];
        const unlock = (id: string) => {
          const a = newAchievements.find(a => a.id === id);
          if (a && !a.unlockedAt) a.unlockedAt = Date.now();
        };

        if (newGlobal.gamesCompleted === 1) unlock('first_win');
        if (newGlobal.gamesCompleted >= 10) unlock('win_10');
        if (newGlobal.gamesCompleted >= 100) unlock('win_100');
        if (isPerfect) unlock('perfect');
        if (time < 300) unlock('speed_demon');

        return { globalStats: newGlobal, statsByDifficulty: diffStats, achievements: newAchievements };
      })
    }),
    {
      name: 'sudoku-stats',
      storage: createJSONStorage(() => lfStorage),
    }
  )
);
