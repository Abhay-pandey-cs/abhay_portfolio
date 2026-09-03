'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X, Bot, Send, RefreshCw,
  ExternalLink, Copy, Check, MessageCircle, Trash2
} from 'lucide-react';
import { SiteSettings, Project, Note, Experience, LearningTopic, Achievement, Certification, EducationItem, Skill } from '@/types';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import type { AIChatMessage } from '@/hooks/useAIAssistant';

interface WhatsAppConnectAIProps {
  settings: SiteSettings;
  projects: Project[];
  notes: Note[];
  experience: Experience[];
  learning: LearningTopic[];
  achievements: Achievement[];
  certifications: Certification[];
  education: EducationItem[];
  skills: Skill[];
  onClose: () => void;
}

/**
 * WhatsApp Connect AI — Single shared component for both entry points.
 * Opens from:
 *   1. Left sidebar "WhatsApp Connect AI" button (MessageCircle icon)
 *   2. Floating "Ask AI" button (bottom-right corner)
 * Both open this exact same modal with identical layout and functionality.
 */
export const WhatsAppConnectAI: React.FC<WhatsAppConnectAIProps> = ({
  settings,
  projects,
  notes,
  experience,
  learning,
  achievements,
  certifications,
  education,
  skills,
  onClose
}) => {
  const [copiedMsg, setCopiedMsg] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const ai = useAIAssistant({
    settings,
    projects,
    notes,
    experience,
    learning,
    achievements,
    certifications,
    education,
    skills
  });

  const {
    loadingStats,
    messages,
    inputValue,
    isSending,
    suggestedQuestions,
    setInputValue,
    sendMessage,
    refreshStats,
    resetChat,
    triggerWhatsAppRedirect,
    lastUpdated
  } = ai;

  useEffect(() => {
    messagesEndRef.current?.scrollTo({
      top: messagesEndRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [messages]);

  const handleSuggestedClick = (question: string) => {
    sendMessage(question);
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-[#111b21] border border-[#222e35] rounded-2xl shadow-2xl overflow-hidden font-sans w-full max-w-lg h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — WhatsApp style */}
        <div className="bg-[#202c33] px-4 py-3 flex items-center justify-between border-b border-[#2e3b43]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center text-white shadow">
                <Bot className="w-5 h-5" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#25d366] border-2 border-[#202c33]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm text-[#e9edef]">WhatsApp Connect AI</span>
                <span className="w-2 h-2 rounded-full bg-[#00a884]" title="Online" />
              </div>
              <span className="text-[11px] text-[#8696a0]">Knows portfolio, projects, stats & more</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[#aebac1]">
            <button
              onClick={refreshStats}
              disabled={loadingStats}
              title="Refresh stats"
              className="p-1.5 hover:bg-[#374248] rounded-full transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loadingStats ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={triggerWhatsAppRedirect}
              title="Open WhatsApp with stats"
              className="p-1.5 hover:bg-[#374248] rounded-full transition-colors text-[#25d366]"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-[#374248] rounded-full transition-colors text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Voice Memo Snippet */}
        <div className="bg-[#182229] px-3 py-2 border-b border-[#222e35] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#00a884] flex items-center justify-center text-white shadow-sm">
              <MessageCircle className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-gray-200 font-medium">{settings.name.split(' ')[0]}'s AI Assistant</span>
              <span className="text-[10px] text-[#8696a0]">Portfolio-aware • Stats-enabled</span>
            </div>
          </div>
          {lastUpdated && (
            <span className="text-[9px] text-[#8696a0]">
              Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

        {/* Source notice */}
        <div className="flex items-center justify-center py-1.5 bg-[#0b141a]">
          <div className="bg-[#182229] px-3 py-1 rounded-lg border border-[#222e35] flex items-center gap-1.5 text-[10px] text-[#ffd279]">
            <span>Answers use portfolio, GitHub, LeetCode & CodeChef data.</span>
          </div>
        </div>

        {/* Chat Messages */}
        <div
          ref={messagesEndRef}
          className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#0b141a] min-h-0"
        >
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              copiedMsg={copiedMsg}
              setCopiedMsg={setCopiedMsg}
            />
          ))}
          {isSending && (
            <div className="flex gap-2.5 justify-start">
              <div className="w-7 h-7 rounded-full bg-[#00a884]/20 text-[#00a884] flex items-center justify-center">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="bg-[#202c33] text-gray-300 px-3 py-2 rounded-xl rounded-tl-none text-xs">
                Typing...
              </div>
            </div>
          )}
        </div>

        {/* Suggested Questions (show when few messages) */}
        {messages.length <= 2 && (
          <div className="px-3 py-2 bg-[#182229] border-t border-[#222e35]">
            <div className="text-[9px] text-[#8696a0] font-mono mb-1.5">Suggested questions:</div>
            <div className="flex flex-wrap gap-1.5">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestedClick(q)}
                  className="px-2.5 py-1 rounded-full bg-[#202c33] hover:bg-[#2a3942] border border-[#2f3b43] text-[11px] text-[#d1d7db] whitespace-nowrap transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="bg-[#202c33] p-2.5 flex items-center gap-2 border-t border-[#2e3b43]">
          <button
            onClick={resetChat}
            title="Clear conversation"
            className="p-1.5 text-[#8696a0] hover:text-gray-300 hover:bg-[#374248] rounded-full transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isSending) {
                e.preventDefault();
                sendMessage();
              }
            }}
            disabled={isSending}
            placeholder="Ask about projects, stats, CGPA..."
            className="flex-1 bg-[#2a3942] text-[#e9edef] placeholder-[#8696a0] text-xs px-3 py-2 rounded-lg outline-none border border-transparent focus:border-[#00a884] transition-colors"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!inputValue.trim() || isSending}
            className={`p-2 rounded-full transition-all ${
              inputValue.trim() && !isSending
                ? 'bg-[#00a884] text-white hover:bg-[#029070] shadow-md'
                : 'bg-[#2a3942] text-[#8696a0] cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const MessageBubble: React.FC<{
  message: AIChatMessage;
  copiedMsg: string | null;
  setCopiedMsg: (id: string | null) => void;
}> = ({ message, copiedMsg, setCopiedMsg }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[82%] px-3 py-2 rounded-xl text-[12px] leading-relaxed shadow-md ${
        isUser
          ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-none'
          : 'bg-[#202c33] text-[#e9edef] rounded-tl-none'
      }`}>
        <div className="whitespace-pre-wrap break-words">{message.content}</div>
        <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-[#8696a0]">
          {!isUser && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(message.content);
                setCopiedMsg(message.id);
                setTimeout(() => setCopiedMsg(null), 1500);
              }}
              className="p-0.5 hover:text-white transition-colors"
              title="Copy"
            >
              {copiedMsg === message.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </button>
          )}
          <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  );
};
