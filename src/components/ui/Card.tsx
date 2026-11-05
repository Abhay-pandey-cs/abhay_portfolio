'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', padding = 'md', hoverable = false, className = '', children, ...props }, ref) => {
    const variants = {
      default: 'bg-[#18191d] border border-[#2e3038]',
      elevated: 'bg-[#18191d] border border-[#2e3038] shadow-xl shadow-black/20',
      outlined: 'bg-transparent border border-[#313746]',
      interactive: 'bg-[#18191d] border border-[#2e3038] transition-all duration-200 hover:border-[#007acc]/50 hover:shadow-[0_8px_32px_-8px_rgba(0,122,204,0.3)]',
    };

    const paddings = {
      none: '',
      sm: 'p-3',
      md: 'p-5',
      lg: 'p-6',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl',
          variants[variant],
          paddings[padding],
          hoverable && 'cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={cn('mb-4', className)} {...props}>{children}</div>
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className = '', children, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-lg font-semibold text-white font-sans', className)} {...props}>{children}</h3>
  )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className = '', children, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-gray-400 font-sans mt-1', className)} {...props}>{children}</p>
  )
);
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props}>{children}</div>
  )
);
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={cn('mt-4 pt-4 border-t border-[#2e3038] flex items-center gap-2', className)} {...props}>{children}</div>
  )
);
CardFooter.displayName = 'CardFooter';