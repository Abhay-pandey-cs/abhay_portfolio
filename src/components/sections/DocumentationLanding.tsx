'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, AudioLines, BookOpen, Braces, Command, Layers3, Volume2, VolumeX } from 'lucide-react';
import { defaultDocumentationContent, type SiteSettings, type Project, type Skill, type Note } from '@/types';
import { DocumentationMesh } from '@/components/sections/DocumentationMesh';

interface DocumentationLandingProps {
  settings: SiteSettings;
  projects: Project[];
  skills: Skill[];
  notes: Note[];
  reducedMotion: boolean;
  active: boolean;
  onEnterWorkspace: (section?: string) => void;
  onOpenCommandPalette: () => void;
}

interface ActiveAudio {
  context: AudioContext;
  filter: BiquadFilterNode;
  gain: GainNode;
  noiseBuffer: AudioBuffer;
  source: AudioBufferSourceNode;
}

export const DocumentationLanding: React.FC<DocumentationLandingProps> = ({
  settings,
  projects,
  skills,
  notes,
  reducedMotion,
  active,
  onEnterWorkspace,
  onOpenCommandPalette,
}) => {
  const audioRef = useRef<ActiveAudio | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [soundUnavailable, setSoundUnavailable] = useState(false);
  const publicProjects = projects.filter((project) => project.published !== false);
  const publicNotes = notes.filter((note) => note.published !== false);
  const documentation = { ...defaultDocumentationContent, ...settings.documentation };
  const technologyCount = new Set(
    publicProjects.flatMap((project) => project.technologies.filter(Boolean).map((technology) => technology.trim().toLowerCase())),
  ).size;
  const statusLabel = settings.currentStatus || 'Building software & exploring systems';
  const headlineName = settings.name || 'Abhay Pandey';
  const featuredProject = publicProjects.find((project) => project.featured) ?? publicProjects[0];

  useEffect(() => {
    if (!active && audioRef.current) {
      audioRef.current.gain.gain.setTargetAtTime(0, audioRef.current.context.currentTime, 0.05);
    }
  }, [active]);

  useEffect(() => {
    if (!soundEnabled || !audioRef.current) return;
    const audio = audioRef.current;
    let previousTime = performance.now();
    let previousVelocity = 0;
    let previousScrollY = window.scrollY;
    let lastRustle = 0;

    const handleScroll = () => {
      const now = performance.now();
      const elapsed = Math.max(1, now - previousTime);
      const velocity = Math.abs(window.scrollY - previousScrollY) / elapsed * 1000;
      const acceleration = Math.abs(velocity - previousVelocity) / elapsed * 1000;
      previousScrollY = window.scrollY;
      previousTime = now;
      previousVelocity = velocity;

      audio.filter.frequency.setTargetAtTime(300 + Math.min(500, velocity * 0.45), audio.context.currentTime, 0.05);
      audio.gain.gain.setTargetAtTime(active ? Math.min(0.035, velocity / 28000) : 0, audio.context.currentTime, 0.06);

      if (active && acceleration > 2200 && now - lastRustle > 240) {
        lastRustle = now;
        const rustle = audio.context.createBufferSource();
        const highPass = audio.context.createBiquadFilter();
        const transientGain = audio.context.createGain();
        rustle.buffer = audio.noiseBuffer;
        highPass.type = 'highpass';
        highPass.frequency.value = 1800;
        transientGain.gain.setValueAtTime(0.025, audio.context.currentTime);
        transientGain.gain.exponentialRampToValueAtTime(0.001, audio.context.currentTime + 0.08);
        rustle.connect(highPass);
        highPass.connect(transientGain);
        transientGain.connect(audio.context.destination);
        rustle.start();
        rustle.stop(audio.context.currentTime + 0.09);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [active, soundEnabled]);

  useEffect(
    () => () => {
      const audio = audioRef.current;
      audioRef.current = null;
      if (audio) {
        audio.source.stop();
        void audio.context.close();
      }
    },
    [],
  );

  const toggleSound = async () => {
    if (audioRef.current) {
      const audio = audioRef.current;
      audioRef.current = null;
      audio.source.stop();
      await audio.context.close();
      setSoundEnabled(false);
      return;
    }

    if (typeof window === 'undefined' || !('AudioContext' in window)) {
      setSoundUnavailable(true);
      return;
    }

    try {
      const context = new AudioContext();
      const buffer = context.createBuffer(1, context.sampleRate, context.sampleRate);
      const channel = buffer.getChannelData(0);
      for (let index = 0; index < channel.length; index += 1) channel[index] = Math.random() * 2 - 1;
      const source = context.createBufferSource();
      const filter = context.createBiquadFilter();
      const gain = context.createGain();
      source.buffer = buffer;
      source.loop = true;
      filter.type = 'bandpass';
      filter.frequency.value = 300;
      filter.Q.value = 0.7;
      gain.gain.value = 0;
      source.connect(filter);
      filter.connect(gain);
      gain.connect(context.destination);
      source.start();
      audioRef.current = { context, filter, gain, noiseBuffer: buffer, source };
      setSoundEnabled(true);
      setSoundUnavailable(false);
    } catch (error) {
      console.error('Could not start optional paper ambience:', error);
      setSoundUnavailable(true);
    }
  };

  return (
    <div
      className="relative flex h-full min-h-0 flex-col overflow-hidden bg-[#09090b] text-[#fafafa]"
      style={{ '--pointer-x': '68%', '--pointer-y': '30%' } as React.CSSProperties}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at var(--pointer-x) var(--pointer-y), rgba(139,92,246,0.12), transparent 34%), radial-gradient(rgba(161,161,170,0.17) 0.65px, transparent 0.65px)',
          backgroundSize: 'auto, 28px 28px',
          maskImage: 'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.65) 70%, transparent 100%)',
        }}
      />
      <div className="pointer-events-none absolute inset-0">
        <DocumentationMesh active={active} />
      </div>

      <header className="relative z-10 flex min-h-14 shrink-0 items-center justify-between gap-4 border-b border-white/[0.08] bg-[#09090b]/95 px-4 sm:px-8 lg:px-12">
        <button
          type="button"
          onClick={() => onEnterWorkspace('overview')}
          className="flex items-center gap-2 text-sm font-semibold tracking-tight text-white"
          aria-label="Open the VS Code workspace"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-[#00f0ff]">
            <Braces className="h-4 w-4" />
          </span>
          <span>{headlineName}<span className="hidden text-zinc-500 sm:inline">{documentation.brandSuffix}</span></span>
        </button>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Documentation navigation">
          <button type="button" className="rounded-full bg-white/[0.08] px-3 py-1.5 text-xs text-white" aria-current="page">
            {documentation.docsNavigation}
          </button>
          <button type="button" onClick={() => onEnterWorkspace('systems')} className="rounded-full px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:text-white">
            {documentation.architectureNavigation}
          </button>
          <button type="button" onClick={() => onEnterWorkspace('projects')} className="rounded-full px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:text-white">
            {documentation.projectsNavigation}
          </button>
          <button type="button" onClick={() => onEnterWorkspace('overview')} className="rounded-full px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:text-white">
            {documentation.workspaceNavigation}
          </button>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-2.5 py-1.5 text-[10px] text-emerald-300 lg:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {statusLabel}
          </span>
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[10px] text-zinc-400 transition-colors hover:border-white/20 hover:text-white"
            aria-label="Open command palette"
          >
            <Command className="h-3 w-3" />
            <span>Ctrl K</span>
          </button>
        </div>
      </header>

      <main className="relative z-[1] mx-auto flex min-h-0 w-full max-w-[1440px] flex-1 flex-col justify-center px-5 py-4 sm:px-8 sm:py-6 lg:px-14">
        <div className="grid items-center gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <section aria-labelledby="docs-title" className="relative z-[1]">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[0.07] px-3 py-1.5 text-[10px] font-medium text-violet-200">
              <BookOpen className="h-3.5 w-3.5" />
              {documentation.eyebrow} · {new Date().getFullYear()}
            </div>
            <h1 id="docs-title" className="max-w-3xl text-[clamp(2rem,5.5vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.055em] text-white">
              {documentation.title}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base sm:leading-7">
              {documentation.description.split('{name}').join(headlineName)}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onEnterWorkspace('projects')}
                className="inline-flex items-center gap-2 rounded-lg border border-[#00f0ff]/40 bg-[#00f0ff]/[0.08] px-4 py-2.5 text-xs font-medium text-[#c8fbff] shadow-[0_0_26px_rgba(0,240,255,0.08)] transition-colors hover:bg-[#00f0ff]/[0.15]"
              >
                {documentation.projectsAction} <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onEnterWorkspace('overview')}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-xs text-zinc-300 transition-colors hover:bg-white/[0.06]"
              >
                {documentation.workspaceAction} <ArrowDown className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={toggleSound}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[10px] text-zinc-500 transition-colors hover:bg-white/[0.05] hover:text-zinc-200"
                aria-pressed={soundEnabled}
                title={soundEnabled ? 'Turn off optional paper ambience' : 'Enable optional paper ambience'}
              >
                {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
                Sound {soundEnabled ? 'on' : 'off'}
              </button>
            </div>
            {soundUnavailable && <p role="status" className="mt-2 text-[10px] text-amber-300">Procedural audio is not available in this browser.</p>}
          </section>

          <section aria-label="Featured project" className="relative z-[1] min-w-0">
            <div className="relative overflow-hidden rounded-xl border border-white/[0.11] bg-[#101014] p-5 shadow-xl sm:p-6">
              <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full border border-cyan-300/[0.08]" />
              <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-12 h-40 w-40 rounded-full border border-violet-300/[0.09]" />
              <div className="relative flex items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">{documentation.featuredLabel}</span>
                <span className="font-mono text-[9px] text-cyan-200/80">01 / {String(publicProjects.length).padStart(2, '0')}</span>
              </div>
              {featuredProject ? (
                <div className="relative pt-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-violet-300/20 bg-violet-300/[0.07] px-2 py-1 text-[9px] text-violet-200">
                      {featuredProject.category}
                    </span>
                    <span className="font-mono text-[9px] text-zinc-500">{featuredProject.status}</span>
                  </div>
                  <h2 className="mt-4 max-w-md text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
                    {featuredProject.title}
                  </h2>
                  <p className="mt-2 max-w-lg text-xs leading-5 text-zinc-400 sm:text-sm sm:leading-6">
                    {featuredProject.subtitle || featuredProject.shortDescription}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {featuredProject.technologies.slice(0, 5).map((technology, index) => (
                      <span key={`${technology}-${index}`} className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 font-mono text-[9px] text-zinc-300">
                        {technology}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => onEnterWorkspace('projects')}
                    className="mt-6 inline-flex items-center gap-2 border-t border-white/[0.08] pt-4 text-[10px] text-zinc-300 transition-colors hover:text-cyan-200"
                  >
                    {documentation.caseStudyAction} <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="relative py-10">
                  <p className="text-lg font-medium text-white">{documentation.emptyFeaturedTitle}</p>
                  <p className="mt-2 text-xs leading-5 text-zinc-400">{documentation.emptyFeaturedDescription}</p>
                </div>
              )}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <Metric label={documentation.projectsMetricLabel} value={String(publicProjects.length)} />
              <Metric label={documentation.technologiesMetricLabel} value={String(technologyCount)} />
              <Metric label={documentation.notesMetricLabel} value={String(publicNotes.length)} />
            </div>
          </section>
        </div>

        <section className="relative z-[1] mt-5 grid grid-cols-2 gap-2 lg:mt-6 lg:grid-cols-4" aria-label="Portfolio documentation index">
          <SpecCard
            icon={<Layers3 className="h-3.5 w-3.5 text-[#00f0ff]" />}
            endpoint={documentation.projectsEndpoint}
            value={publicProjects.slice(0, 2).map((project) => project.title).join(' · ') || documentation.projectsFallback}
          />
          <SpecCard
            icon={<Braces className="h-3.5 w-3.5 text-violet-300" />}
            endpoint={documentation.skillsEndpoint}
            value={skills.slice(0, 3).map((skill) => skill.name).join(' · ') || documentation.skillsFallback}
          />
          <SpecCard
            icon={<BookOpen className="h-3.5 w-3.5 text-emerald-300" />}
            endpoint={documentation.architectureEndpoint}
            value={settings.role || documentation.architectureFallback}
          />
          <button
            type="button"
            onClick={() => onEnterWorkspace('notes')}
            className="group rounded-xl border border-white/[0.09] bg-white/[0.025] p-3 text-left transition-colors hover:border-white/20 hover:bg-white/[0.05]"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[9px] text-zinc-500">{documentation.notesAction}</span>
              <ArrowRight className="h-3 w-3 text-zinc-500 transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
            </div>
            <p className="truncate text-[10px] font-medium text-zinc-200">{documentation.notesTitle}</p>
          </button>
        </section>
      </main>

      <footer className="relative z-[1] flex min-h-12 shrink-0 items-center justify-between gap-3 border-t border-white/[0.08] bg-[#09090b]/60 px-5 sm:px-8 lg:px-12">
        <span className="hidden items-center gap-2 text-[10px] text-zinc-500 sm:flex">
          <AudioLines className="h-3.5 w-3.5 text-violet-300" />
          {reducedMotion ? documentation.reducedMotionFooterHint : documentation.footerHint}
        </span>
        <button
          type="button"
          onClick={() => onEnterWorkspace('overview')}
          className="ml-auto inline-flex items-center gap-2 text-[10px] text-zinc-400 transition-colors hover:text-white"
        >
          {documentation.footerAction} <ArrowDown className="h-3 w-3" />
        </button>
      </footer>
    </div>
  );
};

const Metric: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 py-2">
    <p className="truncate text-sm font-semibold tracking-tight text-white">{value}</p>
    <p className="mt-0.5 text-[9px] uppercase tracking-wider text-zinc-500">{label}</p>
  </div>
);

const SpecCard: React.FC<{ icon: React.ReactNode; endpoint: string; value: string }> = ({ icon, endpoint, value }) => (
  <div className="min-w-0 rounded-xl border border-white/[0.09] bg-white/[0.025] p-3">
    <div className="mb-2 flex items-center gap-1.5 font-mono text-[9px] text-zinc-500">
      {icon}
      <span className="truncate">{endpoint}</span>
    </div>
    <p className="truncate text-[10px] font-medium text-zinc-200">{value}</p>
  </div>
);
