'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  CodingStats, SiteSettings, Project, Note, Experience, 
  LearningTopic, Achievement, Certification, EducationItem, Skill 
} from '@/types';
import { buildKnowledgeBase, serializeKnowledgeBase, retrieveRelevantData, PortfolioKnowledgeBase } from '@/lib/knowledgeBase';

export interface AIContext {
  settings: SiteSettings;
  projects: Project[];
  notes: Note[];
  experience: Experience[];
  learning: LearningTopic[];
  achievements: Achievement[];
  certifications: Certification[];
  education: EducationItem[];
  skills: Skill[];
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface UseAIAssistantResult {
  stats: CodingStats | null;
  loadingStats: boolean;
  messages: AIChatMessage[];
  inputValue: string;
  isSending: boolean;
  suggestedQuestions: string[];
  setInputValue: (val: string) => void;
  sendMessage: (text?: string) => Promise<void>;
  refreshStats: () => Promise<void>;
  resetChat: () => void;
  hasWhatsAppRedirect: boolean;
  triggerWhatsAppRedirect: () => void;
  githubStats: GitHubStats | undefined;
  leetcodeStats: LeetCodeStats | undefined;
  codechefStats: CodeChefStats | undefined;
  statsError: string | null;
  lastUpdated: Date | null;
  knowledgeBase: PortfolioKnowledgeBase | null;
}

import { GitHubStats, LeetCodeStats, CodeChefStats } from '@/types';

// Helper: normalize technology names for fuzzy matching
const normalizeTech = (tech: string): string => {
  return tech.toLowerCase().replace(/\s+/g, '').replace(/[-_]/g, '');
};

// Helper: build a normalized tech map for fuzzy matching
const buildTechMap = (projects: Project[]): Map<string, Project[]> => {
  const map = new Map<string, Project[]>();
  projects.forEach(project => {
    const techs = [...(project.technologies || []), ...(project.category ? [project.category] : [])];
    techs.forEach(tech => {
      const normalized = normalizeTech(tech);
      if (!map.has(normalized)) map.set(normalized, []);
      map.get(normalized)!.push(project);
    });
  });
  return map;
};

export function useAIAssistant(context: AIContext): UseAIAssistantResult {
  const [stats, setStats] = useState<CodingStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hi! I'm your AI Assistant connected to your portfolio. I know about your projects, experience, skills, education, coding stats, and more. What would you like to know?`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Helper functions
  const githubStats = stats?.github && !('error' in stats.github) ? stats.github as GitHubStats : undefined;
  const leetcodeStats = stats?.leetcode && !('error' in stats.leetcode) ? stats.leetcode as LeetCodeStats : undefined;
  const codechefStats = stats?.codechef && !('error' in stats.codechef) ? stats.codechef as CodeChefStats : undefined;

  // Fetch live coding stats
  const refreshStats = useCallback(async () => {
    setLoadingStats(true);
    setStatsError(null);
    try {
      const githubUser = context.settings.github.replace('https://github.com/', '');
      const leetcodeUser = context.settings.leetcode?.replace('https://leetcode.com/u/', '') || context.settings.leetcode;
      const codechefUser = context.settings.codechef?.replace('https://www.codechef.com/users/', '') || context.settings.codechef;

      const params = new URLSearchParams();
      if (githubUser) params.set('github', githubUser);
      if (leetcodeUser) params.set('leetcode', leetcodeUser);
      if (codechefUser) params.set('codechef', codechefUser);

      const res = await fetch(`/api/stats/coding?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch stats');
      const data = await res.json();
      setStats(data);
      setLastUpdated(new Date());
    } catch (err: any) {
      setStatsError(err.message || 'Failed to fetch stats');
      console.error('Stats fetch error:', err);
    } finally {
      setLoadingStats(false);
    }
  }, [context.settings]);

  // Load stats on mount
  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  // Build knowledge base from portfolio data
  const knowledgeBase = useMemo(() => {
    return buildKnowledgeBase({
      settings: context.settings,
      projects: context.projects,
      notes: context.notes,
      experience: context.experience,
      learning: context.learning,
      achievements: context.achievements,
      certifications: context.certifications,
      education: context.education,
      skills: context.skills,
      stats
    });
  }, [context, stats]);

  // Shared retrieval logic - uses knowledge base for real responses
  const buildAIResponse = useCallback((userText: string): string => {
    if (!knowledgeBase) {
      return 'Loading portfolio data...';
    }
    
    // Use the knowledge base retrieval to get relevant data
    const relevantData = retrieveRelevantData(knowledgeBase, userText);
    
    // If we got specific relevant data, format it nicely
    if (relevantData && relevantData !== serializeKnowledgeBase(knowledgeBase)) {
      return relevantData;
    }
    
    // Fallback: return a helpful message with suggestions
    return `I can answer questions about:

• **Projects** — Ask "What projects has Abhay built?" or "Tell me about [project name]"
• **Skills & Tech** — Ask "What technologies does Abhay know?"
• **Education** — Ask "What is Abhay's CGPA?" or "Where does Abhay study?"
• **Coding Stats** — Ask "Show me coding stats" for live GitHub/LeetCode/CodeChef data
• **Experience** — Ask "What is Abhay's work experience?"
• **Contact** — Ask "How to reach Abhay?" for email, LinkedIn, GitHub links
• **Certifications** — Ask "What certifications does Abhay have?"
• **Achievements** — Ask "What are Abhay's achievements?"

All answers come directly from your portfolio data, GitHub, LeetCode, and CodeChef.`;
  }, [knowledgeBase]);

  const sendMessage = useCallback(async (text?: string) => {
    const textToSend = text || inputValue;
    if (!textToSend.trim() || isSending) return;

    const userMessage: AIChatMessage = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsSending(true);

    try {
      // Try to use the chat API, fall back to local response
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          stats: stats,
          projectContext: {
            settings: context.settings,
            projects: context.projects,
            notes: context.notes,
            experience: context.experience,
            learning: context.learning,
            achievements: context.achievements,
            certifications: context.certifications,
            education: context.education,
            skills: context.skills,
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.response) {
          const aiResponse: AIChatMessage = {
            id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            role: 'assistant',
            content: data.response,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiResponse]);
          return;
        }
      }
      
      // Fall back to local response
      throw new Error('API fallback');
    } catch {
      const response = buildAIResponse(textToSend.trim());
      const aiResponse: AIChatMessage = {
        id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setIsSending(false);
    }
  }, [inputValue, isSending, stats, buildAIResponse, context]);

  const resetChat = useCallback(() => {
    setMessages([{
      id: 'welcome-reset',
      role: 'assistant',
      content: `Conversation cleared. How can I help you today?`,
      timestamp: new Date()
    }]);
    setInputValue('');
  }, []);

  const suggestedQuestions = useMemo(() => {
    const baseQuestions = [
      "Who is Abhay?",
      "What are his best projects?",
      "Show me coding stats",
      "What is AgroSmart?",
      "How active is he on LeetCode?"
    ];
    return baseQuestions;
  }, []);

  const triggerWhatsAppRedirect = useCallback(() => {
    let statsSummary = '📊 Latest Coding Stats:\n';
    
    if (githubStats) {
      statsSummary += `GitHub: ${githubStats.totalStars}★, ${githubStats.followers}👥\n`;
    }
    if (leetcodeStats) {
      statsSummary += `LeetCode: ${leetcodeStats.totalSolved} solved, Rating ${leetcodeStats.contestRating || 'N/A'}\n`;
    }
    if (codechefStats) {
      statsSummary += `CodeChef: Rating ${codechefStats.rating || 'N/A'}, Rank #${codechefStats.globalRank || 'N/A'}\n`;
    }

    const message = encodeURIComponent(
      `Hey Abhay, I came across your portfolio and I'm interested in connecting with you.`
    );

    const cleanedNumber = context.settings.whatsappNumber?.replace(/[^0-9]/g, '');
    if (!cleanedNumber) return;
    window.open(`https://wa.me/${cleanedNumber}?text=${message}`, '_blank', 'noopener,noreferrer');
  }, [githubStats, leetcodeStats, codechefStats, context.settings]);

  return {
    stats,
    loadingStats,
    messages,
    inputValue,
    isSending,
    suggestedQuestions,
    setInputValue,
    sendMessage,
    refreshStats,
    resetChat,
    hasWhatsAppRedirect: !!context.settings.whatsappNumber,
    triggerWhatsAppRedirect,
    githubStats,
    leetcodeStats,
    codechefStats,
    statsError,
    lastUpdated,
    knowledgeBase
  };
}

/**
 * Check if a stats object contains an error response
 */
export const hasError = (s: any): s is { error: string; username: string } =>
  s && typeof s === 'object' && 'error' in s;
