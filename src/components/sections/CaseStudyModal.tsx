'use client';

import React from 'react';
import { 
  X, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowUpRight, 
  Cpu, 
  Layers,
  Calendar,
  Tag,
  BookOpen,
  HelpCircle
} from 'lucide-react';
import { GithubIcon } from '@/components/icons/BrandIcons';
import { Project } from '@/types';
import { InteractiveArchitecture } from './InteractiveArchitecture';

interface CaseStudyModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#16171b] rounded-2xl border border-[#2e3038] shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 bg-[#1a1b20] border-b border-[#282a32] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-[#007acc]/20 text-[#38bdf8] border border-[#007acc]/30 font-semibold">
              {project.category}
            </span>
            <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-[#23a55a]/15 text-[#23a55a] border border-[#23a55a]/30">
              {project.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#23a55a] hover:bg-[#1f934f] text-white text-xs font-semibold flex items-center gap-1.5 shadow transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Live Demo</span>
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#25272e] hover:bg-[#2e313b] text-gray-200 text-xs font-mono flex items-center gap-1.5 border border-[#383a42] transition-all"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#2e313b] text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-8 text-gray-300 font-sans">
          {/* Header info */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
              {project.title}
            </h1>
            <p className="text-base font-mono text-[#38bdf8] font-medium">{project.subtitle}</p>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed pt-1">
              {project.fullDescription || project.shortDescription}
            </p>
          </div>

          {/* Tech Stack Chips */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">Technologies Used</span>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-md bg-[#202228] border border-[#31343f] text-xs font-mono text-gray-200"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Problem & Solution Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#1a1b20] border border-[#2b2e37] space-y-2">
              <div className="flex items-center gap-2 text-red-400 font-mono text-xs font-bold uppercase">
                <AlertCircle className="w-4 h-4" />
                <span>The Problem</span>
              </div>
              <p className="text-xs leading-relaxed text-gray-300 font-sans">
                {project.problem || 'Understanding the bottlenecks and architectural challenges.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#1a1b20] border border-[#2b2e37] space-y-2">
              <div className="flex items-center gap-2 text-[#23a55a] font-mono text-xs font-bold uppercase">
                <CheckCircle2 className="w-4 h-4" />
                <span>The Solution & Engineering Approach</span>
              </div>
              <p className="text-xs leading-relaxed text-gray-300 font-sans">
                {project.solution || project.approach || 'Engineered automated workflows and robust pipelines.'}
              </p>
            </div>
          </div>

          {/* Interactive Architecture Flow Diagram */}
          <InteractiveArchitecture
            nodes={project.architectureNodes}
            description={project.architectureDescription}
          />

          {/* Key Features */}
          {project.features && project.features.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#007acc]" />
                <span>Key Features & Capabilities</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {project.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[#18191e] border border-[#272932] flex items-start gap-2.5 text-xs text-gray-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#23a55a] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Challenges & What I Learned */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {project.challenges && project.challenges.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
                  Technical Challenges Overcome
                </h4>
                <div className="space-y-2">
                  {project.challenges.map((c, i) => (
                    <div key={i} className="p-3 rounded-lg bg-[#191a20] border border-[#2e313b] text-xs text-gray-300">
                      • {c}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {project.whatILearned && project.whatILearned.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-mono font-bold text-[#38bdf8] uppercase tracking-wider">
                  What I Learned (Engineering Growth)
                </h4>
                <div className="space-y-2">
                  {project.whatILearned.map((l, i) => (
                    <div key={i} className="p-3 rounded-lg bg-[#191a20] border border-[#2e313b] text-xs text-gray-300">
                      ✓ {l}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Future Improvements */}
          {project.futureImprovements && project.futureImprovements.length > 0 && (
            <div className="p-4 rounded-xl bg-[#17181d] border border-[#282a32] space-y-2">
              <h4 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
                Planned Future Improvements
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.futureImprovements.map((imp, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-[#22242b] text-xs font-mono text-gray-300 border border-[#2e313b]"
                  >
                    → {imp}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#1a1b20] border-t border-[#282a32] flex items-center justify-between text-xs font-mono text-gray-400">
          <span>Project ID: {project.slug || project.id}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#25272e] hover:bg-[#2e313b] text-white font-medium transition-colors"
          >
            Close Case Study
          </button>
        </div>
      </div>
    </div>
  );
};
