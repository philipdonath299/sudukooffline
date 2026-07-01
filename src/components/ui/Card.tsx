import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "bg-[var(--bg-secondary)] rounded-2xl p-5 shadow-sm border border-[var(--border-color)]",
        onClick ? "cursor-pointer active:scale-[0.98] transition-transform" : "",
        className
      )}
    >
      {children}
    </div>
  );
};
