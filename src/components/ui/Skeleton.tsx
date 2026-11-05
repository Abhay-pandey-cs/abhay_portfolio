'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement> & { variant?: 'text' | 'circular' | 'rectangular' }> = ({
  variant = 'rectangular',
  className = '',
  ...props
}) => {
  const baseStyles = 'animate-pulse bg-gradient-to-r from-[#25272e] via-[#2e313b] to-[#25272e] bg-[length:200%_100%]';
  
  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={cn(baseStyles, variants[variant], className)}
      style={{ backgroundSize: '200% 100%', animation: 'shimmer 1.5s ease-in-out infinite' }}
      {...props}
    />
  );
};

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ lines = 3, className = '' }) => (
  <div className={cn('space-y-2', className)}>
    {[...Array(lines)].map((_, i) => (
      <Skeleton key={i} variant="text" className={i === lines - 1 ? 'w-3/4' : 'w-full'} />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={cn('rounded-xl bg-[#18191d] border border-[#2e3038] p-5 space-y-4', className)}>
    <div className="flex items-center gap-4">
      <Skeleton variant="circular" className="w-12 h-12" />
      <div className="space-y-2 flex-1">
        <Skeleton variant="text" className="w-1/3 h-5" />
        <Skeleton variant="text" className="w-1/4 h-4" />
      </div>
    </div>
    <SkeletonText lines={3} />
    <div className="flex gap-2 pt-2">
      <Skeleton variant="text" className="w-24 h-8" />
      <Skeleton variant="text" className="w-24 h-8" />
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; columns?: number; className?: string }> = ({ rows = 5, columns = 4, className = '' }) => (
  <div className={cn('rounded-xl bg-[#18191d] border border-[#2e3038] overflow-hidden', className)}>
    <div className="p-4 border-b border-[#2e3038] bg-[#141518]">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {[...Array(columns)].map((_, i) => <Skeleton key={i} variant="text" className="w-3/4 h-4" />)}
      </div>
    </div>
    <div className="divide-y divide-[#2e3038]">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="p-4">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {[...Array(columns)].map((_, j) => <Skeleton key={j} variant="text" className="w-full h-5" />)}
          </div>
        </div>
      ))}
    </div>
  </div>
);