'use client';

import React, { useState, useEffect } from 'react';
import { VSCodeShell } from '@/components/layout/VSCodeShell';
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
import { DataStore } from '@/lib/storage';
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
import { initialCommunityProjects } from '@/lib/initialData';

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [isAdminMode, setIsAdminMode] = useState(false);
   const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  
  // Live State
  const [projects, setProjects] = useState<Project[]>([]);
  const [learning, setLearning] = useState<LearningTopic[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [community, setCommunity] = useState<CommunityProject[]>(initialCommunityProjects);
  const [education, setEducation] = useState<EducationItem[]>(DataStore.getEducation());

  // Modals
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<Project | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [pendingScroll, setPendingScroll] = useState<string | null>(null);

  const refreshData = () => {
    setProjects(DataStore.getProjects());
    setLearning(DataStore.getLearningTopics());
    setNotes(DataStore.getNotes());
    setSkills(DataStore.getSkills());
    setSettings(DataStore.getSettings());
    setCertifications(DataStore.getCertifications());
    setAchievements(DataStore.getAchievements());
    setExperience(DataStore.getExperience());
    setCommunity(DataStore.getCommunity());
    setEducation(DataStore.getEducation());
  };

  useEffect(() => {
    setIsClient(true);
    refreshData();
  }, []);

  // Smooth-scroll to a section inside the common, always-scrollable overview
  // instead of switching to a separate single-section view.
  const handleSelectSection = (id: string) => {
    setActiveSection('overview');
    setPendingScroll(id);
  };

  useEffect(() => {
    if (!pendingScroll) return;
    const el = document.querySelector(`[data-section-id="${pendingScroll}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setPendingScroll(null);
  }, [pendingScroll, activeSection]);

   // Global Ctrl/Cmd+K toggles the command palette
   useEffect(() => {
     const onKey = (e: KeyboardEvent) => {
       if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
         e.preventDefault();
         setIsCommandPaletteOpen((open) => !open);
       }
       // Ctrl/Cmd + Shift + A toggles admin mode
       if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
         e.preventDefault();
         setIsAdminMode((open) => !open);
       }
     };
     window.addEventListener('keydown', onKey);
     return () => window.removeEventListener('keydown', onKey);
   }, []);

  if (!isClient || !settings) {
    return (
      <div className="min-h-screen bg-[#121316] flex items-center justify-center font-mono text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#007acc] animate-ping" />
          <span>Initializing Abhay Pandey Engineering Workspace...</span>
        </div>
      </div>
    );
  }

  const featuredProjects = projects.filter(p => p.featured && p.published);

  return (
    <div className="relative h-screen overflow-hidden bg-[#121316] text-[#e2e4e9] flex flex-col font-sans">
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
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
        >
          {/* RENDER ACTIVE TAB / SECTION */}
          {activeSection === 'overview' && (
            <div className="space-y-12">
              <div data-section-id="overview" className="relative border-2 border-red-500/60 rounded p-2 my-2 bg-red-500/10">
                <span className="absolute -top-2.5 left-3 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-red-500 text-black z-10">overview (Hero + About)</span>
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
              </div>
              <div data-section-id="projects" className="relative border-2 border-orange-500/60 rounded p-2 my-2 bg-orange-500/10">
                <span className="absolute -top-2.5 left-3 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-orange-500 text-black z-10">projects</span>
                <ProjectsSection
                  projects={projects}
                  onSelectProject={(p) => setSelectedCaseStudy(p)}
                  {...(isAdminMode ? { onOpenNewProjectModal: () => setIsAdminOpen(true) } : {})}
                />
              </div>
              <div data-section-id="experience" className="relative border-2 border-amber-400/60 rounded p-2 my-2 bg-amber-400/10">
                <span className="absolute -top-2.5 left-3 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-400 text-black z-10">experience</span>
                <ExperienceSection
                  experience={experience}
                  {...(isAdminMode ? { onOpenAddModal: () => setIsAdminOpen(true) } : {})}
                />
              </div>
              <div data-section-id="learning" className="relative border-2 border-emerald-400/60 rounded p-2 my-2 bg-emerald-400/10">
                <span className="absolute -top-2.5 left-3 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-400 text-black z-10">learning</span>
                <LearningRoadmap
                  topics={learning}
                  {...(isAdminMode ? { onOpenAddTopicModal: () => setIsAdminOpen(true) } : {})}
                />
              </div>
              <div data-section-id="systems" className="relative border-2 border-green-500/60 rounded p-2 my-2 bg-green-500/10">
                <span className="absolute -top-2.5 left-3 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-green-500 text-black z-10">systems</span>
                <SystemsDeepDive />
              </div>
              <div data-section-id="coding" className="relative border-2 border-cyan-400/60 rounded p-2 my-2 bg-cyan-400/10">
                <span className="absolute -top-2.5 left-3 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-400 text-black z-10">coding (tech + profiles)</span>
                <TechStackSection skills={skills} />
                <CodingProfilesSection settings={settings} />
              </div>
              <div data-section-id="notes" className="relative border-2 border-sky-500/60 rounded p-2 my-2 bg-sky-500/10">
                <span className="absolute -top-2.5 left-3 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-sky-500 text-black z-10">notes</span>
                <NotesSection
                  notes={notes}
                  {...(isAdminMode ? { onOpenNewNoteModal: () => setIsAdminOpen(true) } : {})}
                />
              </div>
              <div data-section-id="certifications" className="relative border-2 border-yellow-400/60 rounded p-2 my-2 bg-yellow-400/10">
                <span className="absolute -top-2.5 left-3 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-yellow-400 text-black z-10">certifications</span>
                <CertificationsSection
                  certifications={certifications}
                  {...(isAdminMode ? { onOpenAddModal: () => setIsAdminOpen(true) } : {})}
                />
              </div>
              <div data-section-id="achievements" className="relative border-2 border-lime-500/60 rounded p-2 my-2 bg-lime-500/10">
                <span className="absolute -top-2.5 left-3 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-lime-500 text-black z-10">achievements</span>
                <AchievementsSection
                  achievements={achievements}
                  {...(isAdminMode ? { onOpenAddModal: () => setIsAdminOpen(true) } : {})}
                />
              </div>
              <div data-section-id="community" className="relative border-2 border-violet-500/60 rounded p-2 my-2 bg-violet-500/10">
                <span className="absolute -top-2.5 left-3 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-violet-500 text-black z-10">community</span>
                <CommunitySection communityProjects={community} />
              </div>
              <div data-section-id="contact" className="relative border-2 border-pink-500/60 rounded p-2 my-2 bg-pink-500/10">
                <span className="absolute -top-2.5 left-3 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-pink-500 text-black z-10">contact</span>
                <ContactSection settings={settings} />
              </div>
            </div>
          )}

          {activeSection === 'projects' && (
            <div className="space-y-10">
              <ProjectsSection
                projects={projects}
                onSelectProject={(p) => setSelectedCaseStudy(p)}
                {...(isAdminMode ? { onOpenNewProjectModal: () => setIsAdminOpen(true) } : {})}
              />
            </div>
          )}

          {activeSection === 'experience' && (
            <div className="space-y-10">
              <ExperienceSection
                experience={experience}
                {...(isAdminMode ? { onOpenAddModal: () => setIsAdminOpen(true) } : {})}
              />
            </div>
          )}

          {activeSection === 'certifications' && (
            <div className="space-y-10">
              <CertificationsSection
                certifications={certifications}
                {...(isAdminMode ? { onOpenAddModal: () => setIsAdminOpen(true) } : {})}
              />
            </div>
          )}

          {activeSection === 'achievements' && (
            <div className="space-y-10">
              <AchievementsSection
                achievements={achievements}
                {...(isAdminMode ? { onOpenAddModal: () => setIsAdminOpen(true) } : {})}
              />
            </div>
          )}

          {activeSection === 'learning' && (
            <div className="space-y-10">
              <LearningRoadmap
                topics={learning}
                {...(isAdminMode ? { onOpenAddTopicModal: () => setIsAdminOpen(true) } : {})}
              />
            </div>
          )}

          {activeSection === 'systems' && (
            <div className="space-y-10">
              <SystemsDeepDive />
            </div>
          )}

          {activeSection === 'notes' && (
            <div className="space-y-10">
              <NotesSection
                notes={notes}
                {...(isAdminMode ? { onOpenNewNoteModal: () => setIsAdminOpen(true) } : {})}
              />
            </div>
          )}

          {activeSection === 'coding' && (
            <div className="space-y-10">
              <CodingProfilesSection settings={settings} />
              <TechStackSection skills={skills} />
            </div>
          )}

          {activeSection === 'community' && (
            <div className="space-y-10">
              <CommunitySection communityProjects={community} />
            </div>
          )}

          {activeSection === 'contact' && (
            <div className="space-y-10">
              <ContactSection settings={settings} />
              <TechStackSection skills={skills} />
            </div>
          )}
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
  );
}
