'use client';

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { 
  Files, 
  Search, 
  GitBranch, 
  Bug, 
  Shield, 
  Settings as SettingsIcon, 
  ChevronLeft,
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
import { WorkspaceProgress } from '@/components/layout/WorkspaceProgress';
import { workspaceSectionVariants } from '@/lib/motion';
import { workspaceTabs as tabs } from '@/components/layout/workspaceTabs';

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
  const [editorHeight, setEditorHeight] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const wheelBoundaryDelta = useRef(0);
  const wheelBoundaryLastAt = useRef(0);
  const sectionChangeLockUntil = useRef(0);
  const previousSectionIndex = useRef(Math.max(0, tabs.findIndex((tab) => tab.id === activeSection)));
  const touchGesture = useRef<{
    x: number;
    y: number;
    startedAt: number;
    horizontal: boolean;
    verticalBoundary: 'start' | 'end' | null;
  } | null>(null);
  const lastHorizontalWheelAt = useRef(0);

  useEffect(() => {
    const mobileViewport = window.matchMedia('(max-width: 767px)');
    const updateSidebarForViewport = () => setIsSidebarOpen(!mobileViewport.matches);
    updateSidebarForViewport();
    mobileViewport.addEventListener('change', updateSidebarForViewport);
    return () => mobileViewport.removeEventListener('change', updateSidebarForViewport);
  }, []);

  const handleSelectSection = (sectionId: string) => {
    onSelectSection(sectionId);
    if (window.matchMedia('(max-width: 767px)').matches) setIsSidebarOpen(false);
  };

  const moveSection = (direction: -1 | 1) => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeSection);
    const nextIndex = Math.min(tabs.length - 1, Math.max(0, currentIndex + direction));
    if (nextIndex !== currentIndex) {
      sectionChangeLockUntil.current = performance.now() + 620;
      wheelBoundaryDelta.current = 0;
      wheelBoundaryLastAt.current = 0;
      handleSelectSection(tabs[nextIndex].id);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      setEditorHeight(Math.round(entry.contentRect.height));
    });
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1 || (event.target as HTMLElement).closest('button, a, input, textarea, select, [role="slider"], [data-no-section-swipe]')) {
        touchGesture.current = null;
        return;
      }

      const touch = event.touches[0];
      const atStart = container.scrollTop <= 2;
      const atEnd = container.scrollTop + container.clientHeight >= container.scrollHeight - 2;
      touchGesture.current = {
        x: touch.clientX,
        y: touch.clientY,
        startedAt: performance.now(),
        horizontal: false,
        verticalBoundary: atStart ? 'start' : atEnd ? 'end' : null,
      };
    };

    const handleTouchMove = (event: TouchEvent) => {
      const gesture = touchGesture.current;
      if (!gesture || event.touches.length !== 1) {
        touchGesture.current = null;
        return;
      }

      const touch = event.touches[0];
      const deltaX = touch.clientX - gesture.x;
      const deltaY = touch.clientY - gesture.y;
      if (!gesture.horizontal && Math.abs(deltaX) > 14 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
        gesture.horizontal = true;
      }
      if (gesture.horizontal && event.cancelable) event.preventDefault();
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const gesture = touchGesture.current;
      touchGesture.current = null;
      const touch = event.changedTouches[0];
      if (!gesture || !touch) return;

      const deltaX = touch.clientX - gesture.x;
      const deltaY = touch.clientY - gesture.y;
      if (!gesture.horizontal) {
        if (gesture.verticalBoundary === 'end' && deltaY < -110) moveSection(1);
        else if (gesture.verticalBoundary === 'start' && deltaY > 110) moveSection(-1);
        return;
      }

      const elapsed = Math.max(1, performance.now() - gesture.startedAt);
      const distance = Math.abs(deltaX);
      const horizontalDominates = distance > Math.abs(deltaY) * 1.5;
      const isIntentionalSwipe = distance >= 72 || (distance >= 48 && distance / elapsed > 0.55);
      if (!horizontalDominates || !isIntentionalSwipe) return;

      moveSection(deltaX < 0 ? 1 : -1);
    };

    const handleTouchCancel = () => {
      touchGesture.current = null;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    container.addEventListener('touchcancel', handleTouchCancel, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [activeSection]);

  const handleWorkspaceWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaX) >= 24 && Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      event.preventDefault();
      const now = performance.now();
      if (now - lastHorizontalWheelAt.current < 420) return;
      lastHorizontalWheelAt.current = now;
      moveSection(event.deltaX > 0 ? 1 : -1);
      return;
    }

    if (!event.deltaY) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    const deltaMultiplier = event.deltaMode === WheelEvent.DOM_DELTA_LINE
      ? 16
      : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
        ? container.clientHeight
        : 1;
    const scaledDelta = Math.sign(event.deltaY) * Math.min(Math.abs(event.deltaY * deltaMultiplier) * 0.55, 64);
    const scrollingDown = scaledDelta > 0;

    let nestedScroller = (event.target as HTMLElement).parentElement;
    while (nestedScroller && nestedScroller !== container) {
      const { overflowY } = window.getComputedStyle(nestedScroller);
      const canScroll = /(auto|scroll|overlay)/.test(overflowY) &&
        nestedScroller.scrollHeight > nestedScroller.clientHeight + 1;
      if (canScroll) {
        const nestedAtBoundary = scrollingDown
          ? nestedScroller.scrollTop + nestedScroller.clientHeight >= nestedScroller.scrollHeight - 2
          : nestedScroller.scrollTop <= 2;
        if (!nestedAtBoundary) {
          event.preventDefault();
          nestedScroller.scrollTop += scaledDelta;
          wheelBoundaryDelta.current = 0;
          wheelBoundaryLastAt.current = 0;
          return;
        }
      }
      nestedScroller = nestedScroller.parentElement;
    }

    const atBoundary = scrollingDown
      ? container.scrollTop + container.clientHeight >= container.scrollHeight - 2
      : container.scrollTop <= 2;
    if (!atBoundary) {
      event.preventDefault();
      container.scrollTop += scaledDelta;
      wheelBoundaryDelta.current = 0;
      wheelBoundaryLastAt.current = 0;
      return;
    }

    event.preventDefault();
    if (performance.now() < sectionChangeLockUntil.current) return;
    const direction = scrollingDown ? 1 : -1;
    const now = performance.now();
    if (now - wheelBoundaryLastAt.current > 650) wheelBoundaryDelta.current = 0;
    wheelBoundaryDelta.current =
      Math.sign(wheelBoundaryDelta.current) === direction
        ? wheelBoundaryDelta.current + scaledDelta
        : scaledDelta;
    wheelBoundaryLastAt.current = now;
    if (Math.abs(wheelBoundaryDelta.current) >= 320) moveSection(direction);
  };

  const handleWorkspaceKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    const target = event.target as HTMLElement;
    if (target.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (event.target !== event.currentTarget && !event.altKey) return;
    event.preventDefault();
    moveSection(event.key === 'ArrowRight' ? 1 : -1);
  };

  const activeSectionIndex = Math.max(0, tabs.findIndex((tab) => tab.id === activeSection));
  const sectionDirection = activeSectionIndex >= previousSectionIndex.current ? 1 : -1;

  useLayoutEffect(() => {
    previousSectionIndex.current = activeSectionIndex;
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeSectionIndex]);

  return (
    <div className="w-full h-full min-h-0 flex flex-col bg-[#121316] text-[#cccccc] font-sans selection:bg-[#007acc]/30">
      {/* Main Split Body */}
      <div className="relative flex-1 flex overflow-hidden min-h-0">
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
              onClick={() => handleSelectSection('overview')}
              className="p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
              title="Source Control (Git main)"
            >
              <GitBranch className="w-5 h-5" />
            </button>

            <button
              onClick={() => handleSelectSection('systems')}
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
              onClick={() => handleSelectSection('contact')}
              className="p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
              title="Settings & Contact"
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* EXPLORER SIDEBAR */}
        {isSidebarOpen && (
          <div className="absolute left-12 top-0 bottom-0 z-30 w-60 bg-[#16171b] border-r border-[#272930] flex flex-col text-xs font-mono select-none shrink-0 overflow-y-auto shadow-xl md:relative md:inset-auto md:z-auto md:shadow-none">
            <div className="h-9 px-3 flex items-center justify-between uppercase tracking-wider text-[11px] font-bold text-gray-400 border-b border-[#22242a]">
              <span>EXPLORER: ABHAY_PORTFOLIO</span>
            </div>

            <div className="p-2 space-y-1">
              <button
                onClick={() => handleSelectSection('overview')}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded transition-colors text-left ${
                  activeSection === 'overview' ? 'bg-[#007acc]/20 text-[#38bdf8] font-semibold' : 'text-gray-300 hover:bg-[#202228]'
                }`}
              >
                <FileCode className="w-4 h-4 text-[#38bdf8]" />
                <span>hero-about.tsx</span>
              </button>

              {/* Projects and contact */}
              <div>
                <div
                  onClick={() => setIsFrontendFolderOpen(!isFrontendFolderOpen)}
                  className="flex items-center gap-1.5 px-1 py-1 text-gray-400 hover:text-white cursor-pointer"
                >
                  {isFrontendFolderOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  <span className="font-semibold text-[11px]">📁 Projects & Contact</span>
                </div>

                {isFrontendFolderOpen && (
                  <div className="pl-4 space-y-0.5">
                    <button
                      onClick={() => handleSelectSection('projects')}
                      className={`w-full flex items-center gap-2 px-2 py-1 rounded transition-colors text-left ${
                        activeSection === 'projects' ? 'bg-[#007acc]/20 text-[#38bdf8]' : 'text-gray-300 hover:bg-[#202228]'
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
                      onClick={() => handleSelectSection('contact')}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded transition-colors text-left ${
                        activeSection === 'contact' ? 'bg-[#007acc]/20 text-[#38bdf8] font-semibold' : 'text-gray-300 hover:bg-[#202228]'
                      }`}
                    >
                      <Mail className="w-4 h-4 text-[#25d366]" />
                      <span>contact-socials.env</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Experience and engineering */}
              <div>
                <div
                  onClick={() => setIsBackendFolderOpen(!isBackendFolderOpen)}
                  className="flex items-center gap-1.5 px-1 py-1 text-gray-400 hover:text-white cursor-pointer"
                >
                  {isBackendFolderOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  <span className="font-semibold text-[11px]">📁 Experience & Engineering</span>
                </div>

                {isBackendFolderOpen && (
                  <div className="pl-4 space-y-0.5">
                    <button
                      onClick={() => handleSelectSection('experience')}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded transition-colors text-left ${
                        activeSection === 'experience' ? 'bg-[#007acc]/20 text-[#38bdf8] font-semibold' : 'text-gray-300 hover:bg-[#202228]'
                      }`}
                    >
                      <Briefcase className="w-4 h-4 text-[#38bdf8]" />
                      <span>experience.tsx</span>
                    </button>

                    <button
                      onClick={() => handleSelectSection('learning')}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded transition-colors text-left ${
                        activeSection === 'learning' ? 'bg-[#007acc]/20 text-[#38bdf8] font-semibold' : 'text-gray-300 hover:bg-[#202228]'
                      }`}
                    >
                      <BookOpen className="w-4 h-4 text-[#23a55a]" />
                      <span>learning-roadmap.json</span>
                    </button>

                    <button
                      onClick={() => handleSelectSection('systems')}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded transition-colors text-left ${
                        activeSection === 'systems' ? 'bg-[#007acc]/20 text-[#38bdf8] font-semibold' : 'text-gray-300 hover:bg-[#202228]'
                      }`}
                    >
                      <Cpu className="w-4 h-4 text-[#f0b232]" />
                      <span>systems-deepdive.c</span>
                    </button>

                    <button
                      onClick={() => handleSelectSection('coding')}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded transition-colors text-left ${
                        activeSection === 'coding' ? 'bg-[#007acc]/20 text-[#38bdf8] font-semibold' : 'text-gray-300 hover:bg-[#202228]'
                      }`}
                    >
                      <Activity className="w-4 h-4 text-[#007acc]" />
                      <span>coding-profiles.ts</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Credentials and recognition */}
              <div>
                <div
                  onClick={() => setIsDatabaseFolderOpen(!isDatabaseFolderOpen)}
                  className="flex items-center gap-1.5 px-1 py-1 text-gray-400 hover:text-white cursor-pointer"
                >
                  {isDatabaseFolderOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  <span className="font-semibold text-[11px]">📁 Awards & Credentials</span>
                </div>

                {isDatabaseFolderOpen && (
                  <div className="pl-4 space-y-0.5">
                    <button
                      onClick={() => handleSelectSection('certifications')}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded transition-colors text-left ${
                        activeSection === 'certifications' ? 'bg-[#007acc]/20 text-[#38bdf8] font-semibold' : 'text-gray-300 hover:bg-[#202228]'
                      }`}
                    >
                      <Award className="w-4 h-4 text-[#f0b232]" />
                      <span>certifications.json</span>
                    </button>

                    <button
                      onClick={() => handleSelectSection('achievements')}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded transition-colors text-left ${
                        activeSection === 'achievements' ? 'bg-[#007acc]/20 text-[#38bdf8] font-semibold' : 'text-gray-300 hover:bg-[#202228]'
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
                      onClick={() => handleSelectSection('notes')}
                      className={`w-full flex items-center gap-2 px-2 py-1 rounded transition-colors text-left ${
                        activeSection === 'notes' ? 'bg-[#007acc]/20 text-[#38bdf8]' : 'text-gray-300 hover:bg-[#202228]'
                      }`}
                    >
                      <Terminal className="w-3.5 h-3.5 text-[#c084fc]" />
                      <span>technical-notes.md</span>
                    </button>

                    {notes.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => handleSelectSection('notes')}
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
                onClick={() => handleSelectSection('community')}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded transition-colors text-left ${
                  activeSection === 'community' ? 'bg-[#007acc]/20 text-[#38bdf8] font-semibold' : 'text-gray-300 hover:bg-[#202228]'
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
          <div className="absolute right-0 top-0 bottom-0 z-30 w-72 bg-[#16171b] border-l border-[#272930] flex flex-col overflow-y-auto shadow-xl md:relative md:inset-auto md:z-auto md:shadow-none">
            <div className="h-9 px-3 flex items-center gap-2 uppercase tracking-wider text-[11px] font-bold text-gray-400 border-b border-[#22242a]">
              <Activity className="w-4 h-4 text-[#5865f2]" />
              <span>STATS</span>
            </div>
            <StatsPanel settings={settings} />
          </div>
        )}

        {/* WORKSPACE & EDITOR CANVAS */}
        <div className="flex-1 flex flex-col bg-[#121316] overflow-hidden min-h-0">
          {/* Breadcrumbs */}
          <div className="h-9 shrink-0 bg-[#141518] px-2 sm:px-4 flex items-center gap-1.5 text-[11px] font-mono text-gray-400 border-b border-[#22242a]">
            <span>abhay-portfolio</span>
            <span>›</span>
            <span>src</span>
            <span>›</span>
            <span>sections</span>
            <span>›</span>
            <span className="min-w-0 flex-1 truncate text-gray-200">{tabs.find(t => t.id === activeSection)?.title || 'overview'}</span>
            <WorkspaceProgress scrollRef={scrollContainerRef} activeSection={activeSection} />
          </div>

          {/* Each section has its own vertical reading area; boundary scrolling advances the page. */}
          <div className="relative flex-1 min-h-0 overflow-hidden bg-[#121316]">
            <div
              ref={scrollContainerRef}
              data-workspace-editor
              tabIndex={0}
              onWheelCapture={handleWorkspaceWheel}
              onKeyDown={handleWorkspaceKeyDown}
              className="relative h-full min-h-0 overflow-y-auto overscroll-y-contain overscroll-x-none touch-pan-y px-12 py-6 sm:px-16 lg:px-20"
              style={{ touchAction: 'pan-y pinch-zoom', overscrollBehaviorX: 'none' }}
            >
              <AnimatePresence mode="wait" initial={false} custom={sectionDirection}>
                <m.div
                  key={activeSection}
                  custom={sectionDirection}
                  variants={workspaceSectionVariants}
                  initial="initial"
                  animate="enter"
                  exit="exit"
                  className="min-h-full"
                  style={editorHeight ? { minHeight: editorHeight } : undefined}
                >
                  {children}
                  <div className="flex min-h-[72vh] items-center justify-center px-6 pb-8 pt-12 text-center">
                    <div className="max-w-sm">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">
                        {activeSectionIndex < tabs.length - 1 ? 'End of section' : 'End of portfolio'}
                      </p>
                      {activeSectionIndex < tabs.length - 1 ? (
                        <>
                          <p className="mt-2 text-sm text-gray-300">
                            When you&apos;re ready, scroll a few times or choose Continue.
                          </p>
                          <button
                            type="button"
                            onClick={() => moveSection(1)}
                            className="mt-3 rounded-md border border-white/10 px-3 py-1.5 text-xs text-gray-400 transition-colors hover:border-[#38bdf8]/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38bdf8]"
                          >
                            Continue to {tabs[activeSectionIndex + 1].title}
                          </button>
                        </>
                      ) : (
                        <p className="mt-2 text-sm text-gray-400">You have reached the last section.</p>
                      )}
                    </div>
                  </div>
                </m.div>
              </AnimatePresence>
            </div>
            <button
              type="button"
              onClick={() => moveSection(-1)}
              disabled={activeSection === tabs[0].id}
              aria-label="Previous workspace section"
              title="Previous section (Alt + Left)"
              className="absolute left-2 top-1/2 z-10 inline-flex h-12 w-10 -translate-y-1/2 items-center justify-center rounded-lg border border-white/15 bg-[#1a1b1f]/95 text-gray-200 shadow-lg transition-colors hover:border-[#38bdf8]/60 hover:bg-[#252a31] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38bdf8] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={() => moveSection(1)}
              disabled={activeSection === tabs[tabs.length - 1].id}
              aria-label="Next workspace section"
              title="Next section (Alt + Right)"
              className="absolute right-2 top-1/2 z-10 inline-flex h-12 w-10 -translate-y-1/2 items-center justify-center rounded-lg border border-white/15 bg-[#1a1b1f]/95 text-gray-200 shadow-lg transition-colors hover:border-[#38bdf8]/60 hover:bg-[#252a31] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38bdf8] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
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
