import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { cn } from '../../utils/cn';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  rightElement?: React.ReactNode;
  className?: string;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, onBack, rightElement, className }) => {
  const setScreen = useUiStore(state => state.setScreen);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setScreen('menu');
    }
  };

  return (
    <header className={cn("w-full max-w-lg px-4 py-4 flex items-center justify-between sticky top-0 z-50 bg-[var(--bg-primary)] border-b border-[var(--border-color)]/30 mb-4", className)}>
      <button 
        onClick={handleBack}
        className="flex items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-1 -ml-1 active:scale-95"
      >
        <ChevronLeft size={24} />
      </button>
      <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)] truncate px-2">{title}</h1>
      <div className="w-8 flex justify-end">
        {rightElement}
      </div>
    </header>
  );
};
