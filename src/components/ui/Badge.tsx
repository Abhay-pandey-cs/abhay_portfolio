'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'outline';
  size?: 'xs' | 'sm' | 'md';
  dot?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', size = 'sm', dot = false, className = '', children, ...props }, ref) => {
    const variants = {
      default: 'bg-[#25272e] text-gray-300 border border-[#383a42]',
      primary: 'bg-[#007acc]/20 text-[#38bdf8] border border-[#007acc]/30',
      success: 'bg-[#23a55a]/20 text-[#4ade80] border border-[#23a55a]/30',
      warning: 'bg-[#f0b232]/20 text-[#f0b232] border border-[#f0b232]/30',
      danger: 'bg-[#f87171]/20 text-[#fca5a5] border border-[#f87171]/30',
      info: 'bg-[#5865f2]/20 text-[#8b9dff] border border-[#5865f2]/30',
      outline: 'bg-transparent text-gray-300 border border-[#313746]',
    };

    const sizes = {
      xs: 'px-1.5 py-0.5 text-[10px] gap-0.5',
      sm: 'px-2 py-0.5 text-xs gap-1',
      md: 'px-2.5 py-1 text-sm gap-1.5',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-mono font-medium rounded-full',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
  status?: 'online' | 'offline' | 'busy' | 'away';
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt, fallback = '?', size = 'md', shape = 'circle', status, className = '', ...props }, ref) => {
    const sizes = {
      xs: 'w-6 h-6 text-[10px]',
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-12 h-12 text-base',
      xl: 'w-16 h-16 text-lg',
    };

    const statusSizes = {
      xs: 'w-1.5 h-1.5',
      sm: 'w-2 h-2',
      md: 'w-2.5 h-2.5',
      lg: 'w-3 h-3',
      xl: 'w-4 h-4',
    };

    const statusColors = {
      online: 'bg-[#23a55a]',
      offline: 'bg-gray-500',
      busy: 'bg-[#f87171]',
      away: 'bg-[#f0b232]',
    };

    return (
      <div ref={ref} className={cn('relative inline-flex shrink-0', className)} {...props}>
        <div className={cn(
          'overflow-hidden bg-[#25272e] flex items-center justify-center font-medium text-white',
          sizes[size],
          shape === 'circle' ? 'rounded-full' : 'rounded-lg'
        )}>
          {src ? (
            <img src={src} alt={alt || ''} className="w-full h-full object-cover" />
          ) : (
            <span>{fallback}</span>
          )}
        </div>
        {status && (
          <span className={cn(
            'absolute bottom-0 right-0 border-2 border-[#121316] rounded-full',
            statusSizes[size],
            statusColors[status]
          )} />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';