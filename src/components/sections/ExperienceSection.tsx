'use client';

import React from 'react';
import { Briefcase, Calendar, MapPin, CheckCircle2, PlusCircle, ArrowUpRight } from 'lucide-react';
import { Experience } from '@/types';

interface ExperienceSectionProps {
  experience: Experience[];
  onOpenAddModal?: () => void;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experience,
  onOpenAddModal,
}) => {
  return (
    <section className="py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono text-[#007acc]">
            <Briefcase className="w-3.5 h-3.5" />
            <span>ROLES & CONTRIBUTIONS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Experience & Leadership</h2>
          <p className="text-sm text-gray-400 font-sans max-w-xl">
            Practical systems development, lead engineering roles, and social impact initiatives.
          </p>
        </div>

        {onOpenAddModal && (
          <button
            onClick={onOpenAddModal}
            className="self-start sm:self-auto px-3.5 py-2 rounded-lg bg-[#25272e] hover:bg-[#2e313b] text-gray-200 hover:text-white border border-[#383a42] text-xs font-mono flex items-center gap-2 transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-[#23a55a]" />
            <span>+ Add Experience</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {experience.map((exp) => (
          <div
            key={exp.id}
            className="p-6 rounded-xl bg-[#18191d] border border-[#2e3038] hover:border-[#007acc]/50 shadow-xl space-y-4 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-lg font-bold text-white font-sans">{exp.role}</h3>
                  <span className="px-2 py-0.5 rounded bg-[#007acc]/20 text-[#38bdf8] text-xs font-mono font-semibold">
                    {exp.organization}
                  </span>
                </div>
                {exp.location && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{exp.location}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono text-[#f0b232] bg-[#22242c] px-3 py-1.5 rounded-lg border border-[#323541]">
                <Calendar className="w-3.5 h-3.5" />
                <span>{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans">
              {exp.description}
            </p>

            {/* Highlights */}
            {exp.highlights && exp.highlights.length > 0 && (
              <div className="space-y-2 pt-1">
                {exp.highlights.map((hl, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-300 font-sans">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#23a55a] shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Technologies */}
            {exp.technologies && exp.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#262830]">
                {exp.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-0.5 rounded bg-[#202228] border border-[#2f323c] text-[11px] font-mono text-gray-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
