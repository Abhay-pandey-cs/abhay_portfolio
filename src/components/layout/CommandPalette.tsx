'use client';

import React, { useState, useEffect } from 'react';
import { Search, Code2, BookOpen, Cpu, Terminal, Shield, ExternalLink, ArrowRight, X } from 'lucide-react';
import { Project, LearningTopic, Note } from '@/types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  learning: LearningTopic[];
  notes: Note[];
  onSelectProject: (p: Project) => void;
  onSelectSection: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  projects,
  learning,
  notes,
  onSelectProject,
  onSelectSection,
  onOpenAdmin,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(query.toLowerCase()) || 
    p.technologies.some(t => t.toLowerCase().includes(query.toLowerCase()))
  );

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(query.toLowerCase()) ||
    n.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
  );

  const filteredLearning = learning.filter(l =>
    l.title.toLowerCase().includes(query.toLowerCase()) ||
    l.category.toLowerCase().includes(query.toLowerCase())
  );

  const sections = [
    { id: 'overview', label: 'Overview · Hero & About' },
    { id: 'projects', label: 'Projects Showcase' },
    { id: 'experience', label: 'Experience' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'learning', label: 'Learning Roadmap' },
    { id: 'systems', label: 'Core CS & Systems' },
    { id: 'notes', label: 'Technical Notes' },
    { id: 'coding', label: 'Coding Profiles & Tech Stack' },
    { id: 'community', label: 'Community Impact' },
    { id: 'contact', label: 'Contact & Socials' },
  ];
  const filteredSections = query
    ? sections.filter(s => s.label.toLowerCase().includes(query.toLowerCase()))
    : sections;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-[#1e1f24] rounded-xl border border-[#3e414c] shadow-2xl overflow-hidden font-sans">
        {/* Search Input Bar */}
        <div className="p-3 bg-[#18191d] border-b border-[#2e3038] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#007acc]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, topics, systems, notes or type command..."
            className="flex-1 bg-transparent text-white outline-none border-none text-sm placeholder:text-gray-400 font-mono"
            autoFocus
          />
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded hover:bg-[#2b2d35]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-4 text-xs font-mono">
          {/* Quick Actions */}
          <div>
            <span className="px-2 text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Quick Actions</span>
            <div className="mt-1 space-y-1">
              <button
                onClick={() => { onSelectSection('projects'); onClose(); }}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#2a2c35] text-left text-gray-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-[#007acc]" />
                  <span>Go to Projects Showcase</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </button>

              <button
                onClick={() => { onSelectSection('learning'); onClose(); }}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#2a2c35] text-left text-gray-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#23a55a]" />
                  <span>Explore What I'm Learning</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </button>

              <button
                onClick={() => { onSelectSection('systems'); onClose(); }}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#2a2c35] text-left text-gray-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#f0b232]" />
                  <span>Systems: Beyond Application Layer</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </button>

              <button
                onClick={() => { onOpenAdmin(); onClose(); }}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#2a2c35] text-left text-gray-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#5865f2]" />
                  <span>Open Admin CMS Dashboard</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Sections Results */}
          {filteredSections.length > 0 && (
            <div>
              <span className="px-2 text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Jump to Section</span>
              <div className="mt-1 space-y-1">
                {filteredSections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { onSelectSection(s.id); onClose(); }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#2a2c35] text-left text-gray-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-[#23a55a]" />
                      <span>{s.label}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Projects Results */}
          {filteredProjects.length > 0 && (
            <div>
              <span className="px-2 text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Projects ({filteredProjects.length})</span>
              <div className="mt-1 space-y-1">
                {filteredProjects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { onSelectProject(p); onClose(); }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#2a2c35] text-left transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-[#007acc]" />
                      <span className="text-white font-medium">{p.title}</span>
                      <span className="text-gray-400">· {p.subtitle}</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2e3038] text-gray-300">{p.status}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes Results */}
          {filteredNotes.length > 0 && (
            <div>
              <span className="px-2 text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Technical Notes ({filteredNotes.length})</span>
              <div className="mt-1 space-y-1">
                {filteredNotes.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => { onSelectSection('notes'); onClose(); }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#2a2c35] text-left transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-[#23a55a]" />
                      <span className="text-white font-medium">{n.title}</span>
                    </div>
                    <span className="text-gray-400 text-[10px]">{n.category}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-2.5 bg-[#141518] border-t border-[#2e3038] flex items-center justify-between text-[11px] text-gray-400 font-mono">
          <span>Navigate with <kbd className="px-1 py-0.5 rounded bg-[#25272e] text-gray-300">↑</kbd> <kbd className="px-1 py-0.5 rounded bg-[#25272e] text-gray-300">↓</kbd></span>
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-[#25272e] text-gray-300">Esc</kbd> to close</span>
        </div>
      </div>
    </div>
  );
};
