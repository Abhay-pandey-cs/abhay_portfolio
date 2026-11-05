'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DropdownOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  options: DropdownOption[];
  onSelect: (value: string) => void;
  align?: 'left' | 'right';
  width?: number;
}

export const Dropdown: React.FC<DropdownProps> = ({ 
  trigger, 
  options, 
  onSelect, 
  align = 'right',
  width = 200 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setIsOpen(false);
    if (e.key === 'Tab') setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="flex items-center gap-1.5"
      >
        {trigger}
        <span className="transition-transform duration-150" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="absolute top-full mt-1.5 z-50 rounded-xl bg-[#18191d] border border-[#2e3038] shadow-xl min-w-[180px] overflow-hidden"
            style={{ 
              width: width,
              [align === 'right' ? 'right' : 'left']: 0 
            }}
          >
            {options.map((option, index) => (
              <React.Fragment key={`${option.value}-${index}`}>
                {option.divider && index > 0 && (
                  <div className="h-px bg-[#2e3038] my-1" />
                )}
                {!option.divider && (
                  <button
                    onClick={() => { onSelect(option.value); setIsOpen(false); }}
                    disabled={option.disabled}
                    className={cn(
                      'w-full px-3 py-2 text-left text-sm font-sans transition-colors flex items-center gap-2',
                      'hover:bg-[#25272e] focus:bg-[#25272e] focus:outline-none',
                      option.danger ? 'text-[#f87171]' : 'text-gray-200',
                      option.disabled ? 'opacity-50 cursor-not-allowed' : ''
                    )}
                  >
                    {option.icon && <span className="flex-shrink-0 w-4 h-4">{option.icon}</span>}
                    <span>{option.label}</span>
                  </button>
                )}
              </React.Fragment>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};