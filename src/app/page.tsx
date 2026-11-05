'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { LazyMotion, MotionConfig, domAnimation, m, useReducedMotion } from 'framer-motion';
import { ArrowLeft, GitBranch, LayoutGrid, Terminal } from 'lucide-react';
import { VSCodeShell } from '@/components/layout/VSCodeShell';
import { PaperPhysicsScene } from '@/components/layout/PaperPhysicsScene';
import { DiscordBar } from '@/components/layout/DiscordBar';
import { WhatsAppDrawer } from '@/components/layout/WhatsAppDrawer';
import { InteractiveTerminal } from '@/components/layout/InteractiveTerminal';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { LearningRoadmap } from '@/components/sections/LearningRoadmap';
import { SystemsDeepDive } from '@/components/sections/SystemsDeepDive';
import { TechStackSection } from '@/components/sections/TechStackSection';
import { NotesSection } from '@/components/sections/NotesSection';
import { CertificationsSection } from '@/components/sections/CertificationsSection';
import { AchievementsSection } from '@/components/sections/AchievementsSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { CodingProfilesSection } from '@/components/sections/CodingProfilesSection';
import { CommunitySection } from '@/components/sections/CommunitySection';
import { ContactSection } from '@/components/sections/ContactSection';
import { CaseStudyModal } from '@/components/sections/CaseStudyModal';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { WhatsAppConnectAI } from '@/components/WhatsAppConnectAI';
import { defaultMotionTransition, motionDuration, motionEase, workspaceCurvePath } from '@/lib/motion';
import { 
  Project, 
  LearningTopic, 
  Note, 
  Skill, 
  SiteSettings, 
  CommunityProject,
   Certification,
   Achievement,
   Experience,
   EducationItem
} from '@/types';

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initializationAnimationComplete, setInitializationAnimationComplete] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [isAdminMode, setIsAdminMode] = useState(false);
   const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isMatrixActive, setIsMatrixActive] = useState(false);
  
  // Live State
  const [projects, setProjects] = useState<Project[]>([]);
  const [learning, setLearning] = useState<LearningTopic[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
    name: '',
    role: '',
    subtitle: '',
    bio: '',
    currentStatus: '',
    university: '',
    degree: '',
    year: '',
    cgpa: '',
    cgpaFirstSem: '',
    cgpaSecondSem: '',
    cgpaOverall: '',
    email: '',
    github: '',
    linkedin: '',
    leetcode: '',
    codechef: '',
    whatsappNumber: '',
    resumeUrl: '',
    githubStatsUsername: '',
    splineSceneUrl: '',
    footerQuote: '',
    profilePhoto: '',
    enablePhotoBooth: false
  });
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [community, setCommunity] = useState<CommunityProject[]>([]);
  const [education, setEducation] = useState<EducationItem[]>([]);

  // Modals
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<Project | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const refreshData = async () => {
    try {
      const [projects, learning, notes, skills, settings, certifications, achievements, experience, community, education] = await Promise.all([
        fetch('/api/projects').then(r => r.json()),
        fetch('/api/learning').then(r => r.json()),
        fetch('/api/notes').then(r => r.json()),
        fetch('/api/skills').then(r => r.json()),
        fetch('/api/settings').then(r => r.json()),
        fetch('/api/certifications').then(r => r.json()),
        fetch('/api/achievements').then(r => r.json()),
        fetch('/api/experience').then(r => r.json()),
        fetch('/api/community').then(r => r.json()),
        fetch('/api/education').then(r => r.json()),
      ]);
      setProjects(Array.isArray(projects) ? projects : []);
      setLearning(Array.isArray(learning) ? learning : []);
      setNotes(Array.isArray(notes) ? notes : []);
      setSkills(Array.isArray(skills) ? skills : []);
      setSettings(settings || {
        name: '',
        role: '',
        subtitle: '',
        bio: '',
        currentStatus: '',
        university: '',
        degree: '',
        year: '',
        cgpa: '',
        cgpaFirstSem: '',
        cgpaSecondSem: '',
        cgpaOverall: '',
        email: '',
        github: '',
        linkedin: '',
        leetcode: '',
        codechef: '',
        whatsappNumber: '',
        resumeUrl: '',
        githubStatsUsername: '',
        splineSceneUrl: '',
        footerQuote: '',
        profilePhoto: '',
        enablePhotoBooth: false
      });
      setCertifications(Array.isArray(certifications) ? certifications : []);
      setAchievements(Array.isArray(achievements) ? achievements : []);
      setExperience(Array.isArray(experience) ? experience : []);
      setCommunity(Array.isArray(community) ? community : []);
      setEducation(Array.isArray(education) ? education : []);
    } catch (e) {
      console.error('Failed to load data from API', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsClient(true);
    setLoading(true);
    refreshData();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setInitializationAnimationComplete(true),
      shouldReduceMotion ? 0 : motionDuration.initialization * 1000,
    );
    return () => window.clearTimeout(timer);
  }, [shouldReduceMotion]);

  const handleSelectSection = useCallback((id: string) => {
    if (id === activeSection) {
      document.querySelector<HTMLElement>('[data-workspace-editor]')?.scrollTo({
        top: 0,
        behavior: shouldReduceMotion ? 'instant' : 'smooth',
      });
      return;
    }
    setActiveSection(id);
  }, [activeSection, shouldReduceMotion]);

  const openCommandPalette = useCallback(() => {
    const workspaceScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    if (window.scrollY < workspaceScroll - 8) {
      window.scrollTo({
        top: workspaceScroll,
        behavior: shouldReduceMotion ? 'instant' : 'smooth',
      });
      window.setTimeout(() => setIsCommandPaletteOpen(true), shouldReduceMotion ? 0 : 450);
      return;
    }
    setIsCommandPaletteOpen(true);
  }, [shouldReduceMotion]);

  const returnToDocumentation = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: shouldReduceMotion ? 'instant' : 'smooth',
    });
  }, [shouldReduceMotion]);

  // Global Ctrl/Cmd+K toggles the command palette.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isCommandPaletteOpen) setIsCommandPaletteOpen(false);
        else openCommandPalette();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsAdminMode((open) => !open);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isCommandPaletteOpen, openCommandPalette]);

  if (!isClient || loading || !initializationAnimationComplete) {
    return (
      <LazyMotion features={domAnimation}>
        <MotionConfig reducedMotion="user" transition={defaultMotionTransition}>
          <div className="min-h-screen bg-[#121316] flex items-center justify-center font-mono text-xs text-gray-400">
            <div className="flex items-center gap-3">
              <svg
                viewBox="0 0 72 22"
                className="h-8 w-24 overflow-visible"
                role="img"
                aria-label="Drawing workspace reference curve"
              >
                <m.path
                  d={workspaceCurvePath}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.2"
                  initial={{ pathLength: shouldReduceMotion ? 1 : 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: motionDuration.initialization, ease: motionEase }}
                />
                <m.path
                  d="M5 19H13V14"
                  fill="none"
                  stroke="#59616e"
                  strokeWidth="0.8"
                  initial={{ pathLength: shouldReduceMotion ? 1 : 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: motionDuration.geometry, delay: shouldReduceMotion ? 0 : 0.48, ease: motionEase }}
                />
                <m.circle
                  cx="13"
                  cy="14"
                  r="1.2"
                  fill="#38bdf8"
                  initial={{ scale: shouldReduceMotion ? 1 : 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: motionDuration.quick, delay: shouldReduceMotion ? 0 : 0.68, ease: motionEase }}
                />
              </svg>
              <span>Initializing Abhay Pandey Engineering Workspace...</span>
            </div>
          </div>
        </MotionConfig>
        </LazyMotion>
    );
  }

  const featuredProjects = projects.filter(p => p.featured && p.published);

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user" transition={defaultMotionTransition}>
        <PaperPhysicsScene
          settings={settings}
          projects={projects}
          skills={skills}
          notes={notes}
          onNavigate={handleSelectSection}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          matrixActive={isMatrixActive}
        >
        <div className="relative flex h-screen flex-col overflow-hidden bg-[#121316] font-sans text-[#e2e4e9]">
      <header className="flex h-9 shrink-0 items-center justify-between border-b border-[#25272e] bg-[#1a1b1f] px-3 text-[10px] font-mono text-gray-400">
        <div className="flex items-center gap-1.5" aria-label="Workspace window controls">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="hidden items-center gap-1.5 sm:flex">
          <span>abhay-workspace</span><span className="text-gray-600">›</span>
          <span>src</span><span className="text-gray-600">›</span>
          <span>portfolio</span><span className="text-gray-600">›</span>
          <span className="text-gray-200">{activeSection === 'overview' ? 'Overview.tsx' : `${activeSection}.tsx`}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1 text-[#23a55a] sm:inline-flex"><GitBranch className="h-3 w-3" /> main*</span>
          <span className="hidden items-center gap-1 md:inline-flex"><Terminal className="h-3 w-3" /> terminal ready</span>
          <button type="button" className="hidden items-center gap-1 rounded px-2 py-1 hover:bg-white/5 sm:inline-flex" aria-label="Workspace layout">
            <LayoutGrid className="h-3 w-3" /> Layout
          </button>
          <button
            type="button"
            onClick={returnToDocumentation}
            className="inline-flex items-center gap-1 rounded border border-[#3b4350] bg-white/[0.03] px-2 py-1 text-gray-200 transition-colors hover:border-[#38bdf8] hover:text-white"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Back to docs</span>
          </button>
        </div>
      </header>
      {/* Top Discord Bar: Presence Status & Channel Links */}
      <DiscordBar
        settings={settings}
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
      />

      {/* Main VS Code Workspace Shell */}
      <div className="flex-1 flex flex-col min-h-0">
         <VSCodeShell
          settings={settings}
          projects={projects}
          notes={notes}
          activeSection={activeSection}
          onSelectSection={handleSelectSection}
          onSelectProject={(p) => setSelectedCaseStudy(p)}
          onOpenCommandPalette={openCommandPalette}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
        >
          {activeSection === 'overview' && <WorkspaceSectionFrame id="overview" label="overview (Hero + About)" tone="red">
            <HeroSection
              settings={settings}
              featuredProjects={featuredProjects}
              onNavigateSection={handleSelectSection}
              onSelectProject={(p) => setSelectedCaseStudy(p)}
            />
            <AboutSection
              settings={settings}
              onNavigateSection={handleSelectSection}
            />
          </WorkspaceSectionFrame>}

          {activeSection === 'projects' && <WorkspaceSectionFrame id="projects" label="projects" tone="orange">
            <ProjectsSection
              projects={projects}
              onSelectProject={(p) => setSelectedCaseStudy(p)}
              {...(isAdminMode ? { onOpenNewProjectModal: () => setIsAdminOpen(true) } : {})}
            />
          </WorkspaceSectionFrame>}

          {activeSection === 'experience' && <WorkspaceSectionFrame id="experience" label="experience" tone="amber">
            <ExperienceSection
              experience={experience}
              {...(isAdminMode ? { onOpenAddModal: () => setIsAdminOpen(true) } : {})}
            />
          </WorkspaceSectionFrame>}

          {activeSection === 'certifications' && <WorkspaceSectionFrame id="certifications" label="certifications" tone="yellow">
            <CertificationsSection
              certifications={certifications}
              {...(isAdminMode ? { onOpenAddModal: () => setIsAdminOpen(true) } : {})}
            />
          </WorkspaceSectionFrame>}

          {activeSection === 'achievements' && <WorkspaceSectionFrame id="achievements" label="achievements" tone="lime">
            <AchievementsSection
              achievements={achievements}
              {...(isAdminMode ? { onOpenAddModal: () => setIsAdminOpen(true) } : {})}
            />
          </WorkspaceSectionFrame>}

          {activeSection === 'learning' && <WorkspaceSectionFrame id="learning" label="learning" tone="emerald">
            <LearningRoadmap
              topics={learning}
              {...(isAdminMode ? { onOpenAddTopicModal: () => setIsAdminOpen(true) } : {})}
            />
          </WorkspaceSectionFrame>}

          {activeSection === 'systems' && <WorkspaceSectionFrame id="systems" label="systems" tone="green">
            <SystemsDeepDive />
          </WorkspaceSectionFrame>}

          {activeSection === 'notes' && <WorkspaceSectionFrame id="notes" label="notes" tone="sky">
            <NotesSection
              notes={notes}
              {...(isAdminMode ? { onOpenNewNoteModal: () => setIsAdminOpen(true) } : {})}
            />
          </WorkspaceSectionFrame>}

          {activeSection === 'coding' && <WorkspaceSectionFrame id="coding" label="coding (tech + profiles)" tone="cyan">
            <CodingProfilesSection settings={settings} />
            <TechStackSection skills={skills} />
          </WorkspaceSectionFrame>}

          {activeSection === 'community' && <WorkspaceSectionFrame id="community" label="community" tone="violet">
            <CommunitySection communityProjects={community} />
          </WorkspaceSectionFrame>}

          {activeSection === 'contact' && <WorkspaceSectionFrame id="contact" label="contact" tone="pink">
            <ContactSection settings={settings} />
            <TechStackSection skills={skills} />
          </WorkspaceSectionFrame>}
        </VSCodeShell>
      </div>

      {/* Bottom Interactive VS Code Terminal Shell */}
      <InteractiveTerminal
        settings={settings}
        projects={projects}
        learning={learning}
        notes={notes}
        skills={skills}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onNavigateSection={handleSelectSection}
        onOpenDocs={returnToDocumentation}
        onToggleMatrix={() => setIsMatrixActive((active) => !active)}
      />

      {/* WhatsApp Quick Connect Interactive Floating Widget */}
      <WhatsAppDrawer
        settings={settings}
        projects={projects}
        notes={notes}
        experience={experience}
        learning={learning}
        achievements={achievements}
        certifications={certifications}
        education={education}
        skills={skills}
        onNavigateSection={handleSelectSection}
      />

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        projects={projects}
        learning={learning}
        notes={notes}
        onSelectProject={(p) => setSelectedCaseStudy(p)}
        onSelectSection={handleSelectSection}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Interactive Project Case Study Modal */}
      <CaseStudyModal
        project={selectedCaseStudy}
        isOpen={Boolean(selectedCaseStudy)}
        onClose={() => setSelectedCaseStudy(null)}
      />

      {/* Admin Panel Modal Overlay */}
      {isAdminOpen && (
        <AdminPanel
          initialProjects={projects}
          initialLearning={learning}
          initialNotes={notes}
          initialSkills={skills}
          initialSettings={settings}
          initialCertifications={certifications}
          initialAchievements={achievements}
          initialExperience={experience}
           initialCommunity={community}
           initialEducation={education}
          onClose={() => setIsAdminOpen(false)}
          onDataChange={refreshData}
        />
      )}

      {/* WhatsApp Connect AI Modal Overlay */}
      {isAIAssistantOpen && (
        <WhatsAppConnectAI
          settings={settings}
          projects={projects}
          notes={notes}
          experience={experience}
          learning={learning}
          achievements={achievements}
          certifications={certifications}
          education={education}
          skills={skills}
          onClose={() => setIsAIAssistantOpen(false)}
        />
      )}
        </div>
        </PaperPhysicsScene>
      </MotionConfig>
    </LazyMotion>
  );
}

type WorkspaceSectionTone = 'red' | 'orange' | 'amber' | 'emerald' | 'green' | 'cyan' | 'sky' | 'yellow' | 'lime' | 'violet' | 'pink';

const sectionToneClasses: Record<WorkspaceSectionTone, { border: string; badge: string; background: string }> = {
  red: { border: 'border-red-500/60', badge: 'bg-red-500', background: 'bg-red-500/10' },
  orange: { border: 'border-orange-500/60', badge: 'bg-orange-500', background: 'bg-orange-500/10' },
  amber: { border: 'border-amber-400/60', badge: 'bg-amber-400', background: 'bg-amber-400/10' },
  emerald: { border: 'border-emerald-400/60', badge: 'bg-emerald-400', background: 'bg-emerald-400/10' },
  green: { border: 'border-green-500/60', badge: 'bg-green-500', background: 'bg-green-500/10' },
  cyan: { border: 'border-cyan-400/60', badge: 'bg-cyan-400', background: 'bg-cyan-400/10' },
  sky: { border: 'border-sky-500/60', badge: 'bg-sky-500', background: 'bg-sky-500/10' },
  yellow: { border: 'border-yellow-400/60', badge: 'bg-yellow-400', background: 'bg-yellow-400/10' },
  lime: { border: 'border-lime-500/60', badge: 'bg-lime-500', background: 'bg-lime-500/10' },
  violet: { border: 'border-violet-500/60', badge: 'bg-violet-500', background: 'bg-violet-500/10' },
  pink: { border: 'border-pink-500/60', badge: 'bg-pink-500', background: 'bg-pink-500/10' },
};

const WorkspaceSectionFrame: React.FC<{
  id: string;
  label: string;
  tone: WorkspaceSectionTone;
  children: React.ReactNode;
}> = ({ id, label, tone, children }) => {
  const colors = sectionToneClasses[tone];

  return (
    <div data-section-id={id} className={`relative my-2 rounded border-2 p-2 ${colors.border} ${colors.background}`}>
      <span className={`absolute -top-2.5 left-3 z-10 rounded px-1.5 py-0.5 text-[10px] font-mono font-bold text-black ${colors.badge}`}>
        {label}
      </span>
      {children}
    </div>
  );
};
