import React from 'react';
import { cn } from '../../utils/cn';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { label: string; value: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className, ...props }) => {
  return (
    <div className="flex flex-col w-full py-2">
      {label && <label className="text-sm text-[var(--text-secondary)] mb-1.5 ml-1">{label}</label>}
      <div className="relative">
        <select
          className={cn(
            "w-full appearance-none bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)]",
            "rounded-xl px-4 py-3.5 pr-10 font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent)]",
            "transition-shadow",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[var(--text-secondary)]">
          <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
