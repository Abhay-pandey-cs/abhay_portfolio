'use client';

import React from 'react';
import { Trophy, Calendar, Sparkles, PlusCircle, CheckCircle2, Award } from 'lucide-react';
import { Achievement } from '@/types';

interface AchievementsSectionProps {
  achievements: Achievement[];
  onOpenAddModal?: () => void;
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({
  achievements,
  onOpenAddModal,
}) => {
  return (
    <section className="py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono text-[#23a55a]">
            <Trophy className="w-3.5 h-3.5" />
            <span>HONORS & RECOGNITION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Academic Standing</h2>
          <p className="text-sm text-gray-400 font-sans max-w-xl">
            Verified academic record from Lovely Professional University — no claimed awards beyond what is documented here.
          </p>
        </div>

        {onOpenAddModal && (
          <button
            onClick={onOpenAddModal}
            className="self-start sm:self-auto px-3.5 py-2 rounded-lg bg-[#25272e] hover:bg-[#2e313b] text-gray-200 hover:text-white border border-[#383a42] text-xs font-mono flex items-center gap-2 transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-[#23a55a]" />
            <span>+ Add Achievement</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className="p-5 rounded-xl bg-[#18191d] border border-[#2e3038] hover:border-[#23a55a]/50 shadow-lg transition-all duration-200 flex flex-col justify-between space-y-3 group hover:-translate-y-1"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="p-2 rounded-lg bg-[#23a55a]/10 text-[#23a55a] border border-[#23a55a]/20">
                  <Trophy className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#25272e] text-gray-400">
                  {ach.date}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-mono text-[#f0b232] font-semibold">{ach.rankOrHonor}</span>
                <h3 className="text-base font-bold text-white group-hover:text-[#23a55a] transition-colors font-sans mt-0.5">
                  {ach.title}
                </h3>
                <p className="text-xs font-mono text-[#38bdf8] mt-0.5">{ach.organization}</p>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                {ach.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
