'use client';

import React, { useState } from 'react';
import { 
  Layers, 
  Code2, 
  Database, 
  Cpu, 
  Wrench, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Search
} from 'lucide-react';
import { Skill, SkillGroup } from '@/types';

interface TechStackSectionProps {
  skills: Skill[];
}

export const TechStackSection: React.FC<TechStackSectionProps> = ({ skills }) => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Used in Projects' | 'Currently Learning'>('All');

  const groups: { name: SkillGroup; label: string; icon: any }[] = [
    { name: 'Languages', label: 'Languages', icon: Code2 },
    { name: 'Backend', label: 'Backend Architecture', icon: Layers },
    { name: 'Database', label: 'Database & Storage', icon: Database },
    { name: 'Systems', label: 'Systems & Embedded', icon: Cpu },
    { name: 'Frontend', label: 'Web & Frontend', icon: Code2 },
    { name: 'Tools', label: 'Engineering Tools', icon: Wrench },
  ];

  const filteredSkills = skills.filter(s => {
    if (activeFilter === 'All') return true;
    return s.status === activeFilter;
  });

  return (
    <section className="py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono text-[#007acc]">
            <Wrench className="w-3.5 h-3.5" />
            <span>TECHNICAL CAPABILITIES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Technical Stack</h2>
          <p className="text-sm text-gray-400 font-sans max-w-xl">
            Verified technologies cleanly separated by practical project application and ongoing learning.
          </p>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#18191d] border border-[#2e3038] self-start md:self-auto">
          {(['All', 'Used in Projects', 'Currently Learning'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeFilter === filter
                  ? 'bg-[#007acc] text-white font-semibold shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Skill Groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {groups.map((group) => {
          const groupSkills = filteredSkills.filter(s => s.group === group.name);
          const Icon = group.icon;

          if (groupSkills.length === 0) return null;

          return (
            <div
              key={group.name}
              className="p-5 rounded-xl bg-[#18191d] border border-[#2e3038] shadow-lg space-y-4 hover:border-[#383a45] transition-colors"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#282a32]">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md bg-[#23252d] text-[#38bdf8]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    {group.label}
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-gray-400">
                  {groupSkills.length} items
                </span>
              </div>

              {/* Skills list in group */}
              <div className="flex flex-wrap gap-2">
                {groupSkills.map((skill) => {
                  const isProject = skill.status === 'Used in Projects';

                  return (
                    <div
                      key={skill.id}
                      className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-all ${
                        isProject
                          ? 'bg-[#1e2026] border-[#323541] text-gray-200 hover:border-[#007acc]'
                          : 'bg-[#1b1c20] border-[#2c2e36] text-[#38bdf8]/90 hover:border-[#23a55a]'
                      }`}
                    >
                      {isProject ? (
                        <CheckCircle2 className="w-3 h-3 text-[#23a55a]" />
                      ) : (
                        <Clock className="w-3 h-3 text-[#f0b232]" />
                      )}
                      <span>{skill.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Transparency Legend */}
      <div className="p-4 rounded-xl bg-[#141518] border border-[#262830] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-gray-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-gray-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#23a55a]" />
            Used in Projects (Proven in code)
          </span>
          <span className="flex items-center gap-1.5 text-gray-300">
            <Clock className="w-3.5 h-3.5 text-[#f0b232]" />
            Currently Learning / Exploring
          </span>
        </div>
        <span className="text-[11px] text-gray-400">No fabricated percentage bars</span>
      </div>
    </section>
  );
};
