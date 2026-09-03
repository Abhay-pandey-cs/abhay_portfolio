'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Layers, 
  Binary, 
  Terminal, 
  Cpu, 
  CheckCircle2, 
  Clock, 
  Compass, 
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronRight,
  PlusCircle
} from 'lucide-react';
import { LearningTopic, LearningCategory, LearningStatus } from '@/types';

interface LearningRoadmapProps {
  topics: LearningTopic[];
  onOpenAddTopicModal?: () => void;
}

export const LearningRoadmap: React.FC<LearningRoadmapProps> = ({
  topics,
  onOpenAddTopicModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<LearningCategory | 'All'>('All');
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(topics[0]?.id || null);

  const categories: { id: LearningCategory | 'All'; label: string; icon: any }[] = [
    { id: 'All', label: 'All Domains', icon: Sparkles },
    { id: 'Backend', label: 'Backend & Java', icon: Layers },
    { id: 'DSA', label: 'DSA & Algorithms', icon: Binary },
    { id: 'Computer Science', label: 'CS Fundamentals', icon: BookOpen },
    { id: 'Systems', label: 'Systems & Low-Level', icon: Cpu },
  ];

  const getStatusBadge = (status: LearningStatus) => {
    switch (status) {
      case 'Learning':
        return {
          bg: 'bg-[#007acc]/15 text-[#38bdf8] border-[#007acc]/30',
          icon: Clock,
          label: 'Learning'
        };
      case 'Yet to Start':
        return {
          bg: 'bg-gray-700/25 text-gray-300 border-gray-600',
          icon: Compass,
          label: 'Yet to Start'
        };
      case 'Finished':
        return {
          bg: 'bg-[#23a55a]/15 text-[#23a55a] border-[#23a55a]/30',
          icon: CheckCircle2,
          label: 'Finished'
        };
      default:
        return {
          bg: 'bg-gray-700/20 text-gray-300 border-gray-600',
          icon: Clock,
          label: status
        };
    }
  };

  const filteredTopics = selectedCategory === 'All' 
    ? topics 
    : topics.filter(t => t.category === selectedCategory);

  return (
    <section className="py-8 space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono text-[#007acc]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>GROWTH & MASTERY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">What I'm Learning</h2>
          <p className="text-sm text-gray-400 font-sans max-w-xl">
            A transparent log of core concepts, system architectures, and engineering topics actively being studied.
          </p>
        </div>

        {onOpenAddTopicModal && (
          <button
            onClick={onOpenAddTopicModal}
            className="self-start md:self-auto px-3.5 py-2 rounded-lg bg-[#25272e] hover:bg-[#2e313b] text-gray-200 hover:text-white border border-[#383a42] text-xs font-mono flex items-center gap-2 transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-[#23a55a]" />
            <span>+ Add Topic</span>
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto p-1.5 rounded-xl bg-[#18191d] border border-[#2e3038] scrollbar-none">
        {categories.map((c) => {
          const Icon = c.icon;
          const isSelected = selectedCategory === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-mono flex items-center gap-2 transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-[#007acc] text-white font-semibold shadow-md'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#22242c]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{c.label}</span>
            </button>
          );
        })}
      </div>

      {/* Learning Topics List / Accordion */}
      <div className="space-y-3">
        {filteredTopics.map((topic) => {
          const badge = getStatusBadge(topic.status);
          const BadgeIcon = badge.icon;
          const isExpanded = expandedTopicId === topic.id;

          return (
            <div
              key={topic.id}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isExpanded
                  ? 'bg-[#1a1c22] border-[#007acc]/50 shadow-lg'
                  : 'bg-[#18191d] border-[#2e3038] hover:border-[#383a45]'
              }`}
            >
              {/* Header Bar */}
              <div
                onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                className="p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1 rounded transition-transform ${isExpanded ? 'rotate-90 text-[#007acc]' : 'text-gray-400'}`}>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white font-mono">{topic.title}</h3>
                    <span className="text-[11px] font-mono text-gray-400">Category: {topic.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold border flex items-center gap-1.5 ${badge.bg}`}
                  >
                    <BadgeIcon className="w-3 h-3" />
                    <span>{badge.label}</span>
                  </span>
                </div>
              </div>

              {/* Expanded Detail Body */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-1 space-y-4 border-t border-[#282a33] text-xs font-sans animate-in fade-in duration-150">
                  {topic.notes && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Concept Notes & Scope</span>
                      <p className="text-gray-300 leading-relaxed bg-[#141518] p-3 rounded-lg border border-[#2b2e37]">
                        {topic.notes}
                      </p>
                    </div>
                  )}

                  {topic.subtopics && topic.subtopics.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Subtopics & Focus Areas</span>
                      <div className="flex flex-wrap gap-1.5">
                        {topic.subtopics.map((sub, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-md bg-[#23252d] border border-[#323541] text-gray-300 font-mono text-[11px]"
                          >
                            ✓ {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
