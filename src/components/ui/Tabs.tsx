'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'line' | 'pills' | 'underline';
  fullWidth?: boolean;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'line',
  fullWidth = false,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });

  const updateIndicator = () => {
    const container = containerRef.current;
    if (!container) return;

    const activeBtn = container.querySelector(`[data-tab="${activeTab}"]`) as HTMLElement | null;
    if (activeBtn && indicatorRef.current) {
      const containerRect = container.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();
      setIndicatorStyle({
        width: btnRect.width,
        left: btnRect.left - containerRect.left,
      });
    }
  };

  useEffect(() => {
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeTab, tabs]);

  const variants = {
    line: 'bg-[#141518] border-b border-[#2e3038]',
    pills: 'bg-[#141518] p-1',
    underline: 'bg-transparent',
  };

  return (
    <div className={cn('relative', variants[variant], className)}>
      <div
        ref={containerRef}
        className={cn('flex items-center gap-1', fullWidth && 'w-full')}
        role="tablist"
      >
        {variant === 'line' && (
          <AnimatePresence mode="wait">
            <motion.div
              ref={indicatorRef}
              key={activeTab}
              className="absolute bottom-0 h-0.5 bg-gradient-to-r from-[#007acc] to-[#5865f2] rounded-t-full"
              style={indicatorStyle}
              animate={indicatorStyle}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </AnimatePresence>
        )}
        
        {tabs.map((tab) => (
          <button
            key={tab.id}
            data-tab={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-disabled={tab.disabled}
            onClick={() => !tab.disabled && onChange(tab.id)}
            disabled={tab.disabled}
            className={cn(
              'relative flex items-center gap-2 px-4 py-2 text-sm font-mono font-medium transition-all duration-150',
              'focus:outline-none focus:ring-2 focus:ring-[#007acc]/20 focus:ring-offset-2 focus:ring-offset-[#121316]',
              fullWidth && 'flex-1 justify-center',
              activeTab === tab.id
                ? 'text-white'
                : 'text-gray-400 hover:text-gray-200',
              tab.disabled && 'opacity-50 cursor-not-allowed',
              variant === 'pills' && activeTab === tab.id && 'bg-[#1e222d] rounded-lg',
              variant === 'underline' && activeTab === tab.id && 'text-white'
            )}
          >
            {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-mono bg-[#007acc]/20 text-[#38bdf8] rounded-full">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
      
      {variant === 'underline' && (
        <div className="relative h-1 bg-[#2e3038] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#007acc] to-[#5865f2] rounded-b-full"
              style={indicatorStyle}
              animate={indicatorStyle}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

interface TabPanelProps {
  children: React.ReactNode;
  className?: string;
}

export const TabPanel: React.FC<TabPanelProps> = ({ children, className = '' }) => (
  <div className={cn('mt-4', className)}>
    <AnimatePresence mode="wait">
      {children}
    </AnimatePresence>
  </div>
);