import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Lock } from 'lucide-react';
import { useStatsStore } from '../store/statsStore';
import { Card } from '../components/ui/Card';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { cn } from '../utils/cn';

export const AchievementsScreen: React.FC = () => {
  const { achievements } = useStatsStore();

  const unlockedCount = achievements.filter(a => a.unlockedAt).length;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center pb-8"
    >
      <ScreenHeader title="Achievements" />

      <div className="w-full max-w-lg px-4 flex flex-col gap-6">
        
        <div className="flex items-center justify-between px-2 mb-2">
          <span className="text-[var(--text-primary)] font-medium">Unlocked</span>
          <span className="text-[var(--text-secondary)] font-bold">{unlockedCount} / {achievements.length}</span>
        </div>

        <div className="flex flex-col gap-4">
          {achievements.map((achievement) => {
            const isUnlocked = !!achievement.unlockedAt;

            return (
              <Card key={achievement.id} className={cn(
                "flex items-center gap-4 transition-opacity duration-300",
                !isUnlocked && "opacity-50 grayscale"
              )}>
                <div className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0",
                  isUnlocked ? "bg-[var(--accent)] text-[var(--bg-primary)]" : "bg-[var(--border-color)] text-[var(--text-secondary)]"
                )}>
                  {isUnlocked ? <Trophy size={28} /> : <Lock size={28} />}
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-[var(--text-primary)]">{achievement.name}</span>
                  <span className="text-sm text-[var(--text-secondary)]">{achievement.description}</span>
                  {isUnlocked && achievement.unlockedAt && (
                    <span className="text-xs text-[var(--text-secondary)] mt-1 opacity-70">
                      Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

      </div>
    </motion.div>
  );
};
