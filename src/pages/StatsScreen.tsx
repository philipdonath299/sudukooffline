import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStatsStore } from '../store/statsStore';
import { Card } from '../components/ui/Card';
import { Select } from '../components/ui/Select';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import type { Difficulty } from '../types';

export const StatsScreen: React.FC = () => {
  const { globalStats, statsByDifficulty } = useStatsStore();
  const [filter, setFilter] = useState<Difficulty | 'All'>('All');

  const stats = filter === 'All' ? globalStats : statsByDifficulty[filter];

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return '--:--';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const winRate = stats.gamesPlayed > 0 
    ? Math.round((stats.gamesCompleted / stats.gamesPlayed) * 100) 
    : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center pb-8"
    >
      <ScreenHeader title="Statistics" />

      <div className="w-full max-w-lg px-4 flex flex-col gap-6">
        <Select 
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          options={[
            { label: 'All Difficulties', value: 'All' },
            { label: 'Beginner', value: 'Beginner' },
            { label: 'Easy', value: 'Easy' },
            { label: 'Medium', value: 'Medium' },
            { label: 'Hard', value: 'Hard' },
            { label: 'Expert', value: 'Expert' },
            { label: 'Evil', value: 'Evil' },
            { label: 'Extreme', value: 'Extreme' },
          ]}
        />

        <div className="grid grid-cols-2 gap-4">
          <Card className="flex flex-col items-center justify-center py-6">
            <div className="text-3xl font-bold text-[var(--text-primary)]">{stats.gamesPlayed}</div>
            <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mt-1">Games Played</div>
          </Card>
          <Card className="flex flex-col items-center justify-center py-6">
            <div className="text-3xl font-bold text-[var(--text-primary)]">{stats.gamesCompleted}</div>
            <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mt-1">Games Won</div>
          </Card>
          <Card className="flex flex-col items-center justify-center py-6">
            <div className="text-3xl font-bold text-[var(--text-primary)]">{winRate}%</div>
            <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mt-1">Win Rate</div>
          </Card>
          <Card className="flex flex-col items-center justify-center py-6">
            <div className="text-3xl font-bold text-[var(--text-primary)]">{stats.perfectGames}</div>
            <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mt-1">Perfect Games</div>
          </Card>
        </div>

        <div className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mt-2 ml-1">Time & Streaks</div>
        
        <div className="grid grid-cols-2 gap-4">
          <Card className="flex flex-col items-center justify-center py-6">
            <div className="text-3xl font-bold text-[var(--text-primary)]">{formatTime(stats.fastestTime)}</div>
            <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mt-1">Best Time</div>
          </Card>
          <Card className="flex flex-col items-center justify-center py-6">
            <div className="text-3xl font-bold text-[var(--text-primary)]">{formatTime(stats.averageTime)}</div>
            <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mt-1">Avg Time</div>
          </Card>
          <Card className="flex flex-col items-center justify-center py-6">
            <div className="text-3xl font-bold text-[var(--text-primary)]">{stats.currentStreak}</div>
            <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mt-1">Current Streak</div>
          </Card>
          <Card className="flex flex-col items-center justify-center py-6">
            <div className="text-3xl font-bold text-[var(--text-primary)]">{stats.longestStreak}</div>
            <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mt-1">Best Streak</div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};
