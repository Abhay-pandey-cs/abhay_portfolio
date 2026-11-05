'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
  shortcut?: string;
  divider?: boolean;
}

interface ContextMenuProps {
  items: MenuItem[];
  children: React.ReactElement;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ items, children }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setIsOpen(true);
  }, []);

  useEffect(() => {
    const handleClick = () => setIsOpen(false);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  if (!isOpen) return <>{children}</>;

  return (
    <>
      {React.cloneElement(
        children as React.ReactElement<{ onContextMenu?: React.MouseEventHandler }>,
        { onContextMenu: handleContextMenu }
      )}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        ref={menuRef}
        className="fixed z-[100] rounded-xl bg-[#18191d] border border-[#2e3038] shadow-xl min-w-[180px] overflow-hidden"
        style={{ left: position.x, top: position.y }}
      >
        {items.map((item, index) => (
          <React.Fragment key={`${item.label}-${index}`}>
            {item.divider && index > 0 && <div className="h-px bg-[#2e3038] my-1" />}
            {!item.divider && (
              <button
                onClick={() => { item.onClick(); setIsOpen(false); }}
                disabled={item.disabled}
                className={cn(
                  'w-full px-3 py-2 text-left text-sm font-sans transition-colors flex items-center justify-between gap-2',
                  'hover:bg-[#25272e] focus:bg-[#25272e] focus:outline-none',
                  item.danger ? 'text-[#f87171]' : 'text-gray-200',
                  item.disabled ? 'opacity-50 cursor-not-allowed' : ''
                )}
              >
                <span className="flex items-center gap-2">
                  {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                  {item.label}
                </span>
                {item.shortcut && (
                  <span className="text-xs font-mono text-gray-500">{item.shortcut}</span>
                )}
              </button>
            )}
          </React.Fragment>
        ))}
      </motion.div>
    </>
  );
};