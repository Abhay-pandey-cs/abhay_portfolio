'use client';

import React from 'react';
import { 
  ArrowRight, 
  BookOpen, 
  Code2, 
  GraduationCap,
  Layers,
  Cpu,
  ShieldCheck,
  Terminal
} from 'lucide-react';
import { SiteSettings, Project } from '@/types';
import { ProfilePhoto } from '@/components/ProfilePhoto';

interface HeroSectionProps {
  settings: SiteSettings;
  featuredProjects: Project[];
  onNavigateSection: (sectionId: string) => void;
  onSelectProject: (p: Project) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  settings,
  featuredProjects,
  onNavigateSection,
  onSelectProject,
}) => {
  return (
    <section className="relative w-full py-6 md:py-10 space-y-8 overflow-hidden">
      {/* Soft animated accent */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-[#007acc]/25 via-[#5865f2]/15 to-transparent blur-3xl animate-[pulse_7s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute top-1/3 -left-20 w-56 h-56 rounded-full bg-gradient-to-tr from-[#23a55a]/15 to-transparent blur-3xl animate-[pulse_9s_ease-in-out_infinite]" />
      {/* Top Status Pill */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1e222d] border border-[#313746] shadow-sm text-xs font-mono text-gray-200">
          <span className="w-2 h-2 rounded-full bg-[#23a55a] animate-pulse" />
          <span className="font-semibold text-white">{settings.currentStatus}</span>
          <span className="text-gray-400">·</span>
          <span className="text-[#38bdf8] font-bold">CGPA {settings.cgpaOverall} · S1 {settings.cgpaFirstSem} · S2 {settings.cgpaSecondSem}</span>
        </div>
      </div>

{/* Main Hero Header & Bio */}
      <div className="flex flex-nowrap items-center justify-between gap-8 w-full">
        <div className="space-y-5 min-w-0 flex-1">
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-sans">
              {settings.name}
            </h1>
            <h2 className="text-lg sm:text-xl font-mono text-[#38bdf8] font-medium flex items-center gap-2">
              <span>{settings.subtitle}</span>
            </h2>
          </div>

          <p className="text-gray-300 text-base sm:text-lg leading-relaxed font-sans">
            {settings.bio}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigateSection('projects')}
              className="px-5 py-2.5 rounded-lg bg-[#007acc] hover:bg-[#006bb3] text-white font-medium text-xs sm:text-sm font-mono flex items-center gap-2 shadow-lg shadow-[#007acc]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Code2 className="w-4 h-4" />
              <span>Explore Projects</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateSection('learning')}
              className="px-5 py-2.5 rounded-lg bg-[#25272e] hover:bg-[#2e313b] text-gray-200 hover:text-white border border-[#383a42] font-medium text-xs sm:text-sm font-mono flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <BookOpen className="w-4 h-4 text-[#23a55a]" />
              <span>What I'm Learning</span>
            </button>

            <button
              onClick={() => onNavigateSection('systems')}
            className="px-4 py-2.5 rounded-lg bg-[#1e1f24] hover:bg-[#262830] text-gray-300 hover:text-white border border-[#2e3038] font-medium text-xs sm:text-sm font-mono flex items-center gap-2 transition-all"
          >
            <Cpu className="w-4 h-4 text-[#f0b232]" />
            <span>Core CS & Systems</span>
          </button>
        </div>
      </div>
        <ProfilePhoto
          src={settings.profilePhoto || undefined}
          alt={settings.name || 'User'}
          size={256}
          initials={(settings.name || '').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
          className="shrink-0"
        />
      </div>

    </section>
  );
};
