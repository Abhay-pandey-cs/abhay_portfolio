'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  minRows?: number;
  maxRows?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, minRows = 4, maxRows = 20, className = '', id, ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`;
    const errorId = `${textareaId}-error`;
    const hintId = `${textareaId}-hint`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-mono text-gray-400 mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full bg-[#141518] border rounded-lg text-white text-sm font-sans transition-all duration-150',
            'placeholder:text-gray-500 resize-y',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#121316]',
            'px-4 py-3',
            error
              ? 'border-[#f87171]/50 focus:border-[#f87171] focus:ring-[#f87171]/20'
              : 'border-[#2e3038] hover:border-[#383a42] focus:border-[#007acc] focus:ring-[#007acc]/20',
            className
          )}
          style={{ minHeight: `${minRows * 1.5}rem`, maxHeight: `${maxRows * 1.5}rem` }}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          {...props}
        />
        {error && (
          <p id={errorId} className="mt-1.5 text-xs text-[#f87171] font-sans flex items-center gap-1">
            <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="mt-1.5 text-xs text-gray-500 font-sans">{hint}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';