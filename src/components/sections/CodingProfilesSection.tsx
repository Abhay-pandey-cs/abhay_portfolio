'use client';

import React from 'react';
import { Terminal, ExternalLink, Code2, Sparkles, Activity, CheckCircle2 } from 'lucide-react';
import { LeetCodeIcon, CodeChefIcon, GithubIcon } from '@/components/icons/BrandIcons';
import { SiteSettings } from '@/types';

interface CodingProfilesSectionProps {
  settings: SiteSettings;
}

export const CodingProfilesSection: React.FC<CodingProfilesSectionProps> = ({ settings }) => {
  return (
    <section className="py-8 space-y-6">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-mono text-[#007acc]">
          <Terminal className="w-3.5 h-3.5" />
          <span>BUILDING & PROBLEM SOLVING IN PUBLIC</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Coding Profiles & Activity</h2>
        <p className="text-sm text-gray-400 font-sans max-w-xl">
          Active profiles across competitive programming platforms and open source repositories.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* LeetCode Card */}
        {settings.leetcode && (
          <a
            href={settings.leetcode}
            target="_blank"
            rel="noreferrer"
            className="p-5 rounded-xl bg-[#18191d] border border-[#2e3038] hover:border-[#f0b232]/60 shadow-lg space-y-4 transition-all group hover:-translate-y-1 block"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#f0b232]/15 text-[#f0b232]">
                  <LeetCodeIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-mono">LeetCode</h3>
                  <span className="text-[10px] text-gray-400 font-mono">Algorithm Practice</span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
            </div>

            <p className="text-xs text-gray-300 font-sans leading-relaxed">
              Practicing DSA in Java: Sliding Window, Trees, Heaps, Graph traversals, and Dynamic Programming.
            </p>

            <div className="pt-2 border-t border-[#262830] flex items-center justify-between text-xs font-mono text-[#f0b232]">
              <span>View Profile →</span>
              <span className="text-[10px] text-gray-400">Daily Solver</span>
            </div>
          </a>
        )}

        {/* CodeChef Card */}
        {settings.codechef && (
          <a
            href={settings.codechef}
            target="_blank"
            rel="noreferrer"
            className="p-5 rounded-xl bg-[#18191d] border border-[#2e3038] hover:border-[#5865f2]/60 shadow-lg space-y-4 transition-all group hover:-translate-y-1 block"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#5865f2]/15 text-[#5865f2]">
                  <CodeChefIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-mono">CodeChef</h3>
                  <span className="text-[10px] text-gray-400 font-mono">Contests & Starters</span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
            </div>

            <p className="text-xs text-gray-300 font-sans leading-relaxed">
              Participating in rated starter contests and solving mathematical/combinatorial challenges.
            </p>

            <div className="pt-2 border-t border-[#262830] flex items-center justify-between text-xs font-mono text-[#5865f2]">
              <span>View Profile →</span>
              <span className="text-[10px] text-gray-400">Competitive</span>
            </div>
          </a>
        )}

        {/* GitHub Card */}
        {settings.github && (
          <a
            href={settings.github}
            target="_blank"
            rel="noreferrer"
            className="p-5 rounded-xl bg-[#18191d] border border-[#2e3038] hover:border-[#23a55a]/60 shadow-lg space-y-4 transition-all group hover:-translate-y-1 block"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#23a55a]/15 text-[#23a55a]">
                  <GithubIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-mono">GitHub</h3>
                  <span className="text-[10px] text-gray-400 font-mono">Open Source Repos</span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
            </div>

            <p className="text-xs text-gray-300 font-sans leading-relaxed">
              Source code repositories for AidSphere, AgroSmart IoT, C system utilities, and backend experiments.
            </p>

            <div className="pt-2 border-t border-[#262830] flex items-center justify-between text-xs font-mono text-[#23a55a]">
              <span>View Repositories →</span>
              <span className="text-[10px] text-gray-400">Public Code</span>
            </div>
          </a>
        )}
      </div>
    </section>
  );
};
