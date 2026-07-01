import React from 'react';
import { cn } from '../../utils/cn';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label, description }) => {
  return (
    <div className="flex items-center justify-between py-3 w-full" onClick={() => onChange(!checked)}>
      <div className="flex flex-col pr-4">
        {label && <span className="text-base font-medium text-[var(--text-primary)]">{label}</span>}
        {description && <span className="text-sm text-[var(--text-secondary)] mt-0.5">{description}</span>}
      </div>
      <div 
        className={cn(
          "w-12 h-7 rounded-full relative transition-colors duration-200 ease-in-out cursor-pointer flex-shrink-0",
          checked ? "bg-[var(--accent)]" : "bg-[var(--border-color)]"
        )}
      >
        <div 
          className={cn(
            "absolute top-[2px] left-[2px] bg-[var(--bg-primary)] w-6 h-6 rounded-full shadow-sm transition-transform duration-200 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </div>
    </div>
  );
};
