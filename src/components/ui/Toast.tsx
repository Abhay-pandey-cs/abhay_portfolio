'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
}

interface ToastContextValue {
  toast: (toast: Omit<Toast, 'id'>) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const toastIcons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const toastStyles = {
  success: 'border-[#23a55a]/30 bg-[#1a2d1a]',
  error: 'border-[#f87171]/30 bg-[#2d1b1b]',
  info: 'border-[#38bdf8]/30 bg-[#1a252d]',
  warning: 'border-[#f0b232]/30 bg-[#2d2a1b]',
};

const toastIconColors = {
  success: 'text-[#23a55a]',
  error: 'text-[#f87171]',
  info: 'text-[#38bdf8]',
  warning: 'text-[#f0b232]',
};

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const Icon = toastIcons[toast.type];
  const [progress, setProgress] = useState(1);

  React.useEffect(() => {
    const duration = toast.duration ?? 5000;
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(1 - elapsed / duration);
      if (elapsed >= duration) {
        clearInterval(interval);
        onDismiss(toast.id);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [toast, onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border shadow-lg min-w-[320px] max-w-md',
        toastStyles[toast.type]
      )}
    >
      <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', toastIconColors[toast.type])} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white font-sans">{toast.title}</p>
        {toast.message && (
          <p className="text-sm text-gray-300 font-sans mt-1">{toast.message}</p>
        )}
        {toast.action && (
          <button
            onClick={() => { toast.action?.onClick(); onDismiss(toast.id); }}
            className="mt-2 text-xs font-mono text-[#007acc] hover:underline flex items-center gap-1"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 rounded-bl-xl rounded-br-xl"
        style={{
          background: toastIconColors[toast.type].replace('text-', ''),
          width: `${progress * 100}%`,
        }}
        animate={{ width: `${progress * 100}%` }}
        transition={{ duration: (toast.duration ?? 5000) / 1000, ease: 'linear' }}
      />
    </motion.div>
  );
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newToast = { ...t, id };
    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <AnimatePresence>
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
          {toasts.map(t => (
            <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
          ))}
        </div>
      </AnimatePresence>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};