'use client';

import React, { useState } from 'react';
import { Bot } from 'lucide-react';
import { SiteSettings, Project, Note, Experience, LearningTopic, Achievement, Certification, EducationItem, Skill } from '@/types';
import { WhatsAppConnectAI } from '@/components/WhatsAppConnectAI';

interface WhatsAppDrawerProps {
  settings: SiteSettings;
  projects: Project[];
  notes: Note[];
  experience: Experience[];
  learning: LearningTopic[];
  achievements: Achievement[];
  certifications: Certification[];
  education: EducationItem[];
  skills: Skill[];
  onNavigateSection?: (sectionId: string) => void;
}

/**
 * Floating "Ask AI" button — bottom-right entry point.
 * Opens the exact same WhatsApp Connect AI modal as the left sidebar button.
 */
export const WhatsAppDrawer: React.FC<WhatsAppDrawerProps> = ({
  settings,
  projects,
  notes,
  experience,
  learning,
  achievements,
  certifications,
  education,
  skills,
  onNavigateSection
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating "Ask AI" Button */}
      <div className="fixed bottom-10 right-4 z-50 flex items-center">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-[#00a884] hover:bg-[#029070] text-white font-medium shadow-2xl transition-all transform hover:scale-105 group border border-white/20"
        >
          <Bot className="w-5 h-5" />
          <span className="text-sm font-semibold tracking-wide">Ask AI</span>
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
        </button>
      </div>

      {/* WhatsApp Connect AI Modal — same as left sidebar */}
      {isOpen && (
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
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
