'use client';

import React, { useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showClose?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showClose = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}) => {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && closeOnEscape) {
      onClose();
    }
  }, [onClose, closeOnEscape]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[90vw]',
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={closeOnOverlayClick ? onClose : undefined}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={cn(
            'relative w-full bg-[#18191d] border border-[#2e3038] rounded-2xl shadow-2xl overflow-hidden',
            sizes[size]
          )}
        >
          {(title || showClose) && (
            <div className="flex items-start justify-between p-5 border-b border-[#2e3038] bg-[#141518]">
              <div>
                {title && (
                  <h2 className="text-lg font-semibold text-white font-sans">{title}</h2>
                )}
                {description && (
                  <p className="text-sm text-gray-400 font-sans mt-1">{description}</p>
                )}
              </div>
              {showClose && (
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#25272e] transition-colors flex-shrink-0 ml-4"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
          <div className="p-5 max-h-[70vh] overflow-y-auto">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) => {
  const variants = {
    danger: 'bg-[#2d1b1b] border-[#4a2c2c] text-[#f87171] hover:bg-[#3d1f1f] hover:border-[#f87171]/50',
    warning: 'bg-[#2d2a1b] border-[#4a442c] text-[#f0b232] hover:bg-[#3d381f] hover:border-[#f0b232]/50',
    info: 'bg-[#1a252d] border-[#2c4a5e] text-[#38bdf8] hover:bg-[#1f3545] hover:border-[#38bdf8]/50',
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md bg-[#18191d] border border-[#2e3038] rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-5 border-b border-[#2e3038] bg-[#141518]">
          <h2 className="text-lg font-semibold text-white font-sans">{title}</h2>
        </div>
        <div className="p-5">
          <p className="text-gray-300 font-sans">{message}</p>
        </div>
        <div className="p-5 border-t border-[#2e3038] bg-[#141518] flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-[#1e222d] border border-[#313746] text-gray-200 hover:bg-[#25272e] hover:border-[#007acc]/50 hover:text-white text-sm font-mono transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={cn('px-4 py-2 rounded-lg text-sm font-mono font-medium transition-colors disabled:opacity-50', variants[variant])}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
};