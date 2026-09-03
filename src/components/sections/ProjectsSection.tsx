'use client';

import React, { useState } from 'react';
import { 
  Code2, 
  ExternalLink, 
  Sparkles, 
  Layers, 
  Cpu, 
  Search, 
  Filter, 
  ArrowRight,
  PlusCircle,
  Radio
} from 'lucide-react';
import { GithubIcon } from '@/components/icons/BrandIcons';
import { Project, ProjectCategory } from '@/types';

interface ProjectsSectionProps {
  projects: Project[];
  onSelectProject: (p: Project) => void;
  onOpenNewProjectModal?: () => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  onSelectProject,
  onOpenNewProjectModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Full Stack', 'IoT / Systems', 'Backend', 'Low Level'];

  const publishedProjects = projects.filter(p => p.published !== false);

  const filteredProjects = publishedProjects.filter((proj) => {
    const matchesCat = selectedCategory === 'All' || proj.category === selectedCategory;
    const matchesSearch = 
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <section className="py-8 space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono text-[#007acc]">
            <Code2 className="w-3.5 h-3.5" />
            <span>ENGINEERING SHOWCASE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Systems & Projects</h2>
          <p className="text-sm text-gray-400 font-sans max-w-xl">
            Real systems engineered with strong fundamentals, automated feedback loops, and clean architecture.
          </p>
        </div>

        {/* Quick Add Project action */}
        {onOpenNewProjectModal && (
          <button
            onClick={onOpenNewProjectModal}
            className="self-start md:self-auto px-3.5 py-2 rounded-lg bg-[#25272e] hover:bg-[#2e313b] text-gray-200 hover:text-white border border-[#383a42] text-xs font-mono flex items-center gap-2 transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-[#23a55a]" />
            <span>+ Add Project</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-[#18191d] border border-[#2e3038]">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#007acc] text-white font-semibold shadow-sm'
                  : 'bg-[#202228] text-gray-400 hover:text-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tech or project..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#141518] text-gray-200 text-xs font-mono border border-[#2d3039] focus:border-[#007acc] outline-none"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => onSelectProject(project)}
            className="group relative bg-[#18191d] hover:bg-[#1d1f25] rounded-xl border border-[#2e3038] hover:border-[#007acc]/60 shadow-xl overflow-hidden transition-all duration-200 flex flex-col cursor-pointer hover:-translate-y-1"
          >
            {/* Card Top Banner / Category strip */}
            <div className="p-5 pb-3 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-[#38bdf8] transition-colors font-sans">
                    {project.title}
                  </h3>
                  {project.featured && (
                    <span className="px-2 py-0.5 rounded bg-[#f0b232]/15 text-[#f0b232] border border-[#f0b232]/30 text-[10px] font-mono font-semibold flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      FEATURED
                    </span>
                  )}
                </div>
                <p className="text-xs font-mono text-[#38bdf8]">{project.subtitle}</p>
              </div>

              <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#23a55a]/10 text-[#23a55a] border border-[#23a55a]/25 font-semibold">
                {project.status}
              </span>
            </div>

            {/* Description */}
            <div className="px-5 py-2 flex-1 text-xs text-gray-300 leading-relaxed font-sans">
              <p className="line-clamp-3">{project.shortDescription}</p>
            </div>

            {/* Tech Tags */}
            <div className="px-5 py-3 flex flex-wrap gap-1.5">
              {project.technologies.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded bg-[#23252d] group-hover:bg-[#282b35] text-gray-300 text-[10px] font-mono border border-[#323541] transition-colors"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Card Footer Actions */}
            <div className="p-4 bg-[#141518] border-t border-[#262830] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-3">
                {project.liveDemoUrl && (
                  <a
                    href={project.liveDemoUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[#23a55a] hover:underline flex items-center gap-1 font-semibold"
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
                    onClick={(e) => e.stopPropagation()}
                    className="text-gray-400 hover:text-white flex items-center gap-1"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>Code</span>
                  </a>
                )}
              </div>

              <button
                onClick={() => onSelectProject(project)}
                className="px-3 py-1.5 rounded-lg bg-[#007acc]/10 group-hover:bg-[#007acc] text-[#38bdf8] group-hover:text-white border border-[#007acc]/30 font-semibold text-xs flex items-center gap-1.5 transition-all"
              >
                <span>View Case Study</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="p-8 text-center rounded-xl bg-[#18191d] border border-[#2e3038] text-gray-400 font-mono text-xs">
          No projects found matching your search.
        </div>
      )}
    </section>
  );
};
