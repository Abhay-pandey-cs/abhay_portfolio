'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Files, 
  Search, 
  GitBranch, 
  Bug, 
  Shield, 
  Settings as SettingsIcon, 
  ChevronRight, 
  ChevronDown, 
  FileCode, 
  FileText, 
  Cpu, 
  Terminal, 
  BookOpen, 
  Heart, 
  Mail, 
  Briefcase,
  Award,
  Trophy,
  Activity,
  CheckCircle2,
  Bot,
  MessageCircle,
  BarChart3,
} from 'lucide-react';
import { Project, Note, SiteSettings } from '@/types';
import { StatsPanel } from '@/components/StatsPanel';

interface VSCodeShellProps {
  settings: SiteSettings;
  projects: Project[];
  notes: Note[];
  activeSection: string;
  onSelectSection: (sectionId: string) => void;
  onSelectProject: (p: Project) => void;
  onOpenCommandPalette: () => void;
  onOpenAdmin: () => void;
  onOpenAIAssistant: () => void;
  children: React.ReactNode;
}

export const VSCodeShell: React.FC<VSCodeShellProps> = ({
  settings,
  projects,
  notes,
  activeSection,
  onSelectSection,
  onSelectProject,
  onOpenCommandPalette,
  onOpenAdmin,
  onOpenAIAssistant,
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isFrontendFolderOpen, setIsFrontendFolderOpen] = useState(true);
  const [isBackendFolderOpen, setIsBackendFolderOpen] = useState(true);
  const [isDatabaseFolderOpen, setIsDatabaseFolderOpen] = useState(true);
  const [isNotesFolderOpen, setIsNotesFolderOpen] = useState(true);
  const [highlightedTab, setHighlightedTab] = useState(activeSection);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Tab mapping for files (logical order)
  const tabs = [
    { id: 'overview', title: 'hero-about.tsx', icon: FileCode, color: '#38bdf8' },
    { id: 'projects', title: 'projects-showcase.tsx', icon: FileCode, color: '#007acc' },
    { id: 'experience', title: 'experience.tsx', icon: Briefcase, color: '#38bdf8' },
    { id: 'learning', title: 'learning-roadmap.json', icon: BookOpen, color: '#23a55a' },
    { id: 'systems', title: 'systems-deepdive.c', icon: Cpu, color: '#f0b232' },
    { id: 'coding', title: 'coding-profiles.ts', icon: Activity, color: '#007acc' },
    { id: 'notes', title: 'technical-notes.md', icon: FileText, color: '#c084fc' },
    { id: 'certifications', title: 'certifications.json', icon: Award, color: '#f0b232' },
    { id: 'achievements', title: 'achievements.md', icon: Trophy, color: '#23a55a' },
    { id: 'community', title: 'community-impact.md', icon: Heart, color: '#f43f5e' },
    { id: 'contact', title: 'contact-socials.env', icon: Mail, color: '#25d366' },
  ];

  // Scroll-spy: keep the active editor tab in sync with the section in view
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setHighlightedTab(activeSection);

    const sections = Array.from(container.querySelectorAll<HTMLElement>('[data-section-id]'));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const id = visible[0].target.getAttribute('data-section-id');
          if (id) setHighlightedTab(id);
        }
      },
      { root: container, rootMargin: '0px 0px -55% 0px', threshold: [0.1, 0.5, 1] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [activeSection]);

  return (
    <div className="w-full h-full min-h-0 flex flex-col bg-[#121316] text-[#cccccc] font-sans selection:bg-[#007acc]/30">
      {/* Main Split Body */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* LEFT ACTIVITY BAR */}
        <div className="w-12 bg-[#18191d] border-r border-[#2b2d35] flex flex-col items-center justify-between py-3 z-20 shrink-0">
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-2 rounded-lg transition-colors ${
                isSidebarOpen ? 'text-white border-l-2 border-[#007acc] bg-[#22242c]' : 'text-gray-400 hover:text-white'
              }`}
              title="Explorer (Toggle Sidebar)"
            >
              <Files className="w-5 h-5" />
            </button>

            <button
              onClick={onOpenCommandPalette}
              className="p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
              title="Search (Ctrl + K)"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => onSelectSection('overview')}
              className="p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
              title="Source Control (Git main)"
            >
              <GitBranch className="w-5 h-5" />
            </button>

            <button
              onClick={() => onSelectSection('systems')}
              className="p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
              title="Systems & Debugger"
            >
              <Bug className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsStatsOpen(!isStatsOpen)}
              className={`p-2 rounded-lg transition-colors ${
                isStatsOpen ? 'text-[#5865f2] border-l-2 border-[#5865f2] bg-[#22242c]' : 'text-[#5865f2] hover:text-[#5865f2] hover:bg-[#22242c]'
              }`}
              title="Stats (Live Coding Analytics)"
            >
              <BarChart3 className="w-5 h-5" />
            </button>

            <button
              onClick={onOpenAIAssistant}
              className="p-2 rounded-lg text-[#25d366] hover:bg-[#25d366]/20 transition-colors"
              title="WhatsApp Connect AI"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={onOpenAdmin}
              className="p-2 rounded-lg text-[#5865f2] hover:bg-[#5865f2]/20 transition-colors"
              title="Admin CMS Management"
            >
              <Shield className="w-5 h-5" />
            </button>

            <button
              onClick={() => onSelectSection('contact')}
              className="p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
              title="Settings & Contact"
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* EXPLORER SIDEBAR */}
        {isSidebarOpen && (
          <div className="w-60 bg-[#16171b] border-r border-[#272930] flex flex-col text-xs font-mono select-none shrink-0 overflow-y-auto">
            <div className="h-9 px-3 flex items-center justify-between uppercase tracking-wider text-[11px] font-bold text-gray-400 border-b border-[#22242a]">
              <span>EXPLORER: ABHAY_PORTFOLIO</span>
            </div>

            <div className="p-2 space-y-1">
              <button
                onClick={() => onSelectSection('overview')}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded transition-colors text-left ${
                  highlightedTab === 'overview' ? 'bg-[#007acc]/20 text-[#38bdf8] font-semibold' : 'text-gray-300 hover:bg-[#202228]'
                }`}
              >
                <FileCode className="w-4 h-4 text-[#38bdf8]" />
                <span>hero-about.tsx</span>
              </button>

              {/* Frontend Folder */}
              <div>
                <div
                  onClick={() => setIsFrontendFolderOpen(!isFrontendFolderOpen)}
                  className="flex items-center gap-1.5 px-1 py-1 text-gray-400 hover:text-white cursor-pointer"
                >
                  {isFrontendFolderOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  <span className="font-semibold text-[11px]">📁 frontend/</span>
                </div>

                {isFrontendFolderOpen && (
                  <div className="pl-4 space-y-0.5">
                    <button
                      onClick={() => onSelectSection('projects')}
                      className={`w-full flex items-center gap-2 px-2 py-1 rounded transition-colors text-left ${
                        highlightedTab === 'projects' ? 'bg-[#007acc]/20 text-[#38bdf8]' : 'text-gray-300 hover:bg-[#202228]'
                      }`}
                    >
                      <FileCode className="w-3.5 h-3.5 text-[#007acc]" />
                      <span>projects-showcase.tsx</span>
                    </button>

                    {projects.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => onSelectProject(p)}
                        className="w-full flex items-center gap-2 px-2 py-1 rounded text-gray-400 hover:text-gray-200 hover:bg-[#202228] text-left truncate"
                        title={p.title}
                      >
                        <FileText className="w-3.5 h-3.5 text-gray-400" />
                        <span className="truncate">{p.slug || p.id}.md</span>
                      </button>
                    ))}

                    <button
                      onClick={() => onSelectSection('contact')}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded transition-colors text-left ${
                        highlightedTab === 'contact' ? 'bg-[#007acc]/20 text-[#38bdf8] font-semibold' : 'text-gray-300 hover:bg-[#202228]'
                      }`}
                    >
                      <Mail className="w-4 h-4 text-[#25d366]" />
                      <span>contact-socials.env</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Backend Folder */}
              <div>
                <div
                  onClick={() => setIsBackendFolderOpen(!isBackendFolderOpen)}
                  className="flex items-center gap-1.5 px-1 py-1 text-gray-400 hover:text-white cursor-pointer"
                >
                  {isBackendFolderOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  <span className="font-semibold text-[11px]">📁 backend/</span>
                </div>

                {isBackendFolderOpen && (
                  <div className="pl-4 space-y-0.5">
                    <button
                      onClick={() => onSelectSection('experience')}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded transition-colors text-left ${
                        highlightedTab === 'experience' ? 'bg-[#007acc]/20 text-[#38bdf8] font-semibold' : 'text-gray-300 hover:bg-[#202228]'
                      }`}
                    >
                      <Briefcase className="w-4 h-4 text-[#38bdf8]" />
                      <span>experience.tsx</span>
                    </button>

                    <button
                      onClick={() => onSelectSection('learning')}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded transition-colors text-left ${
                        highlightedTab === 'learning' ? 'bg-[#007acc]/20 text-[#38bdf8] font-semibold' : 'text-gray-300 hover:bg-[#202228]'
                      }`}
                    >
                      <BookOpen className="w-4 h-4 text-[#23a55a]" />
                      <span>learning-roadmap.json</span>
                    </button>

                    <button
                      onClick={() => onSelectSection('systems')}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded transition-colors text-left ${
                        highlightedTab === 'systems' ? 'bg-[#007acc]/20 text-[#38bdf8] font-semibold' : 'text-gray-300 hover:bg-[#202228]'
                      }`}
                    >
                      <Cpu className="w-4 h-4 text-[#f0b232]" />
                      <span>systems-deepdive.c</span>
                    </button>

                    <button
                      onClick={() => onSelectSection('coding')}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded transition-colors text-left ${
                        highlightedTab === 'coding' ? 'bg-[#007acc]/20 text-[#38bdf8] font-semibold' : 'text-gray-300 hover:bg-[#202228]'
                      }`}
                    >
                      <Activity className="w-4 h-4 text-[#007acc]" />
                      <span>coding-profiles.ts</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Database Folder */}
              <div>
                <div
                  onClick={() => setIsDatabaseFolderOpen(!isDatabaseFolderOpen)}
                  className="flex items-center gap-1.5 px-1 py-1 text-gray-400 hover:text-white cursor-pointer"
                >
                  {isDatabaseFolderOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  <span className="font-semibold text-[11px]">📁 database/</span>
                </div>

                {isDatabaseFolderOpen && (
                  <div className="pl-4 space-y-0.5">
                    <button
                      onClick={() => onSelectSection('certifications')}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded transition-colors text-left ${
                        highlightedTab === 'certifications' ? 'bg-[#007acc]/20 text-[#38bdf8] font-semibold' : 'text-gray-300 hover:bg-[#202228]'
                      }`}
                    >
                      <Award className="w-4 h-4 text-[#f0b232]" />
                      <span>certifications.json</span>
                    </button>

                    <button
                      onClick={() => onSelectSection('achievements')}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded transition-colors text-left ${
                        highlightedTab === 'achievements' ? 'bg-[#007acc]/20 text-[#38bdf8] font-semibold' : 'text-gray-300 hover:bg-[#202228]'
                      }`}
                    >
                      <Trophy className="w-4 h-4 text-[#23a55a]" />
                      <span>achievements.md</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Notes Folder */}
              <div>
                <div
                  onClick={() => setIsNotesFolderOpen(!isNotesFolderOpen)}
                  className="flex items-center gap-1.5 px-1 py-1 text-gray-400 hover:text-white cursor-pointer"
                >
                  {isNotesFolderOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  <span className="font-semibold text-[11px]">📁 notes/</span>
                </div>

                {isNotesFolderOpen && (
                  <div className="pl-4 space-y-0.5">
                    <button
                      onClick={() => onSelectSection('notes')}
                      className={`w-full flex items-center gap-2 px-2 py-1 rounded transition-colors text-left ${
                        highlightedTab === 'notes' ? 'bg-[#007acc]/20 text-[#38bdf8]' : 'text-gray-300 hover:bg-[#202228]'
                      }`}
                    >
                      <Terminal className="w-3.5 h-3.5 text-[#c084fc]" />
                      <span>technical-notes.md</span>
                    </button>

                    {notes.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => onSelectSection('notes')}
                        className="w-full flex items-center gap-2 px-2 py-1 rounded text-gray-400 hover:text-gray-200 hover:bg-[#202228] text-left truncate"
                        title={n.title}
                      >
                        <FileText className="w-3.5 h-3.5 text-gray-400" />
                        <span className="truncate">{n.slug || n.id}.md</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => onSelectSection('community')}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded transition-colors text-left ${
                  highlightedTab === 'community' ? 'bg-[#007acc]/20 text-[#38bdf8] font-semibold' : 'text-gray-300 hover:bg-[#202228]'
                }`}
              >
                <Heart className="w-4 h-4 text-[#f43f5e]" />
                <span>community-impact.md</span>
              </button>
            </div>
          </div>
        )}

        {/* STATS PANEL (inline when stats sidebar is open) */}
        {isStatsOpen && (
          <div className="w-72 bg-[#16171b] border-l border-[#272930] flex flex-col overflow-y-auto shrink-0">
            <div className="h-9 px-3 flex items-center gap-2 uppercase tracking-wider text-[11px] font-bold text-gray-400 border-b border-[#22242a]">
              <Activity className="w-4 h-4 text-[#5865f2]" />
              <span>STATS</span>
            </div>
            <StatsPanel settings={settings} />
          </div>
        )}

        {/* WORKSPACE & EDITOR CANVAS */}
        <div className="flex-1 flex flex-col bg-[#121316] overflow-hidden min-h-0">
          {/* Top Open Tabs Bar */}
          <div className="h-9 bg-[#18191d] border-b border-[#25272e] flex items-center overflow-x-auto scrollbar-none select-none">
            {tabs.map((tab) => {
              const isActive = highlightedTab === tab.id;
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectSection(tab.id)}
                  className={`h-full px-3.5 flex items-center gap-2 text-xs font-mono border-r border-[#25272e] transition-colors ${
                    isActive
                      ? 'bg-[#121316] text-white font-medium border-t-2 border-t-[#007acc]'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-[#1f2026]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: tab.color }} />
                  <span>{tab.title}</span>
                </button>
              );
            })}
          </div>

          {/* Breadcrumbs */}
          <div className="h-6 bg-[#141518] px-4 flex items-center gap-1.5 text-[11px] font-mono text-gray-400 border-b border-[#22242a]">
            <span>abhay-portfolio</span>
            <span>›</span>
            <span>src</span>
            <span>›</span>
            <span>sections</span>
            <span>›</span>
            <span className="text-gray-200">{tabs.find(t => t.id === highlightedTab)?.title || 'overview'}</span>
          </div>

           {/* Render Active Children Section */}
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-12 py-6 bg-[#121316]">
            <div style={{ zoom: 0.95 }} className="min-h-full">
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* VS CODE BOTTOM STATUS BAR */}
      <footer className="h-6 bg-[#007acc] text-white px-3 flex items-center justify-between text-[11px] font-mono select-none z-30">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 hover:bg-[#006bb3] px-1.5 py-0.5 rounded cursor-pointer">
            <GitBranch className="w-3 h-3" />
            <span>main</span>
          </span>

          <span className="flex items-center gap-1 hover:bg-[#006bb3] px-1.5 py-0.5 rounded cursor-pointer">
            <CheckCircle2 className="w-3 h-3 text-[#bbf7d0]" />
            <span>Prettier: Active</span>
          </span>

          <span className="hidden sm:inline text-white/80">
            {settings.currentStatus}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hover:bg-[#006bb3] px-1.5 py-0.5 rounded cursor-pointer">
            TypeScript React
          </span>
          <span className="hidden sm:inline hover:bg-[#006bb3] px-1.5 py-0.5 rounded cursor-pointer">
            UTF-8
          </span>
          <button
            onClick={onOpenAdmin}
            className="bg-black/20 hover:bg-black/30 px-2 py-0.5 rounded font-semibold text-white transition-colors"
          >
            Admin Panel
          </button>
        </div>
      </footer>
    </div>
  );
};
