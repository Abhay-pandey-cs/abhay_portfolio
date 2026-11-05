'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    leftIcon, 
    rightIcon, 
    fullWidth = false,
    className = '',
    disabled,
    children,
    ...props 
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-mono font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#121316] disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-gradient-to-r from-[#007acc] via-[#5865f2] to-[#25d366] bg-[length:200%] text-white shadow-[0_4px_16px_-4px_rgba(0,122,204,0.4)] hover:shadow-[0_8px_24px_-4px_rgba(0,122,204,0.5)] active:scale-[0.98]',
      secondary: 'bg-[#1e222d] border border-[#313746] text-gray-200 hover:bg-[#25272e] hover:border-[#007acc]/50 hover:text-white active:bg-[#1e222d]',
      ghost: 'bg-transparent text-gray-300 hover:bg-[#ffffff]/5 hover:text-white active:bg-[#ffffff]/10',
      danger: 'bg-[#2d1b1b] border border-[#4a2c2c] text-[#f87171] hover:bg-[#3d1f1f] hover:border-[#f87171]/50 hover:text-[#fca5a5] active:bg-[#2d1b1b]',
      success: 'bg-[#1a2d1a] border border-[#2c4a2c] text-[#23a55a] hover:bg-[#1f3d1f] hover:border-[#23a55a]/50 hover:text-[#4ade80] active:bg-[#1a2d1a]',
      outline: 'bg-transparent border border-[#313746] text-gray-300 hover:border-[#007acc] hover:text-[#38bdf8] hover:bg-[#007acc]/10 active:border-[#007acc]',
    };
    
    const sizes = {
      xs: 'px-2.5 py-1 text-[10px] gap-1',
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2.5',
    };
    
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], fullWidth && 'w-full', className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : leftIcon ? (
          <span className="flex-shrink-0">{leftIcon}</span>
        ) : null}
        <span>{children}</span>
        {!loading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';