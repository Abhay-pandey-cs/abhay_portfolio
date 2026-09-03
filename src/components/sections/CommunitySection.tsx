'use client';

import React from 'react';
import { Heart, Users, Clock, CheckCircle2, Sparkles, BookOpen, ShieldCheck } from 'lucide-react';
import { CommunityProject } from '@/types';

interface CommunitySectionProps {
  communityProjects: CommunityProject[];
}

export const CommunitySection: React.FC<CommunitySectionProps> = ({ communityProjects }) => {
  return (
    <section className="py-8 space-y-6">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-mono text-[#5865f2]">
          <Heart className="w-3.5 h-3.5 fill-[#5865f2]" />
          <span>BEYOND CODE</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Community & Mentorship</h2>
      </div>

      <div className="space-y-6">
        {communityProjects.map((community) => (
          <div key={community.id} className="p-6 sm:p-8 rounded-xl bg-[#18191d] border border-[#2e3038] shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                {community.photo && (
                  <img
                    src={community.photo}
                    alt={community.title}
                    className="w-20 h-20 rounded-xl object-cover border border-[#2e3038] shrink-0"
                  />
                )}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-bold text-white font-sans">
                      {community.title}
                    </h3>
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-[#5865f2]/20 text-[#5865f2] border border-[#5865f2]/30 font-semibold">
                      {community.organization}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-[#38bdf8]">{community.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#25272e] border border-[#383a42] text-xs font-mono text-gray-200">
                <Clock className="w-4 h-4 text-[#f0b232]" />
                <span className="font-bold text-white">{community.hours} Hours</span>
                <span className="text-gray-400">Volunteered</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans">
              {community.description}
            </p>

            {/* Key Highlights */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-mono text-gray-400 uppercase tracking-wider font-semibold">
                Key Contributions & Modules
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {community.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-[#141518] border border-[#282a32] flex items-start gap-2.5 text-xs text-gray-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#23a55a] shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
