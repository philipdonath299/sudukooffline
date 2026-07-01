import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'secondary', 
  fullWidth = true,
  className,
  ...props 
}) => {
  const baseStyles = "px-6 py-3.5 rounded-xl font-medium transition-all active:scale-[0.98] flex items-center justify-center select-none touch-manipulation";
  
  const variants = {
    primary: "bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-90",
    secondary: "bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm border border-[var(--border-color)] hover:bg-[var(--cell-bg-highlight)]",
    danger: "bg-[var(--cell-bg-error)] text-[var(--text-error)]",
    outline: "border-2 border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
  };

  return (
    <button 
      className={cn(
        baseStyles,
        variants[variant],
        fullWidth ? "w-full" : "",
        props.disabled ? "opacity-50 cursor-not-allowed active:scale-100" : "",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
