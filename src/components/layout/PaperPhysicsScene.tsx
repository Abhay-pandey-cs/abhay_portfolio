'use client';

import React, { useEffect, useRef, useState } from 'react';
import { m, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import type { Project, Skill, Note, SiteSettings } from '@/types';
import { DocumentationLanding } from '@/components/sections/DocumentationLanding';

interface PaperPhysicsSceneProps {
  settings: SiteSettings;
  projects: Project[];
  skills: Skill[];
  notes: Note[];
  children: React.ReactNode;
  onNavigate: (section: string) => void;
  onOpenCommandPalette: () => void;
  matrixActive: boolean;
}

const clampProgress = (progress: number) => Math.min(1, Math.max(0, progress));
const smoothStep = (start: number, end: number, progress: number) => {
  const t = Math.min(1, Math.max(0, (progress - start) / (end - start)));
  return t * t * (3 - 2 * t);
};
const glideProgress = (progress: number) => {
  const t = clampProgress(progress);
  return t * t * (3 - 2 * t);
};

export const PaperPhysicsScene: React.FC<PaperPhysicsSceneProps> = ({
  settings,
  projects,
  skills,
  notes,
  children,
  onNavigate,
  onOpenCommandPalette,
  matrixActive,
}) => {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ['start start', 'end end'],
  });
  const [workspacePrepared, setWorkspacePrepared] = useState(false);
  const [workspaceRevealed, setWorkspaceRevealed] = useState(false);
  const workspacePreparedRef = useRef(false);
  const workspaceRevealedRef = useRef(false);

  const paperX = useTransform(scrollYProgress, (value) => `${glideProgress(value) * 4}vw`);
  const paperY = useTransform(scrollYProgress, (value) => `${glideProgress(value) * 112}vh`);
  const paperZ = useTransform(scrollYProgress, (value) => {
    const progress = clampProgress(value);
    return 10 * smoothStep(0.02, 0.2, progress) - 64 * progress * progress;
  });
  const paperRotateX = useTransform(scrollYProgress, (value) => {
    const progress = clampProgress(value);
    return 5 * progress + Math.sin(progress * Math.PI * 2) * (1 - progress) * 1.2;
  });
  const paperRotateY = useTransform(scrollYProgress, (value) => {
    return Math.sin(clampProgress(value) * Math.PI * 2) * 2;
  });
  const paperRotate = useTransform(scrollYProgress, (value) => {
    const progress = clampProgress(value);
    return Math.sin(progress * Math.PI * 2.2) * 1.2;
  });
  const paperOpacity = useTransform(
    scrollYProgress,
    (value) => 1 - smoothStep(0.9, 1, clampProgress(value)),
  );
  const workspaceDim = useTransform(scrollYProgress, [0, 0.9, 1], [0.72, 0.72, 0]);
  const simplePaperOpacity = useTransform(scrollYProgress, [0, 0.9, 1], [1, 1, 0]);

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (progress > 0.2 && !workspacePreparedRef.current) {
      workspacePreparedRef.current = true;
      setWorkspacePrepared(true);
    }
    const next = progress >= 0.999;
    if (workspaceRevealedRef.current !== next) {
      workspaceRevealedRef.current = next;
      setWorkspaceRevealed(next);
    }
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const enterWorkspace = (section = 'overview') => {
    onNavigate(section);
    window.scrollTo({
      top: Math.max(0, (sceneRef.current?.offsetHeight ?? window.innerHeight * 2) - window.innerHeight),
      behavior: prefersReducedMotion ? 'instant' : 'smooth',
    });
  };

  const returnToDocs = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'instant' : 'smooth',
    });
  };

  return (
    <div ref={sceneRef} className="relative h-[280svh] w-full overscroll-x-none bg-[#17191b]">
      <div className="sticky top-0 h-[100svh] overflow-hidden overscroll-x-none bg-[#17191b] [perspective:1400px]">
        <m.div
          aria-hidden={!workspaceRevealed}
          inert={!workspaceRevealed}
          className="absolute inset-0 z-0 flex flex-col overflow-hidden"
          style={{ pointerEvents: workspaceRevealed ? 'auto' : 'none' }}
        >
          {workspacePrepared ? children : null}
          {matrixActive && <MatrixRain active={workspaceRevealed} />}
          <m.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-40 bg-[#09090b]"
            style={{ opacity: workspaceDim }}
          />
        </m.div>

        <m.div
          aria-hidden={workspaceRevealed}
          inert={workspaceRevealed}
          className="absolute inset-2 z-30 overflow-hidden rounded-[2px] border border-white/10 sm:inset-4 lg:inset-6"
          style={{
            x: prefersReducedMotion ? 0 : paperX,
            y: prefersReducedMotion ? 0 : paperY,
            z: prefersReducedMotion ? 0 : paperZ,
            rotateX: prefersReducedMotion ? 0 : paperRotateX,
            rotateY: prefersReducedMotion ? 0 : paperRotateY,
            rotate: prefersReducedMotion ? 0 : paperRotate,
            opacity: prefersReducedMotion ? simplePaperOpacity : paperOpacity,
            transformOrigin: '0% 0%',
            transformPerspective: 1400,
            pointerEvents: workspaceRevealed ? 'none' : 'auto',
            willChange: prefersReducedMotion ? 'opacity' : 'transform, opacity',
          }}
        >
          <DocumentationLanding
            settings={settings}
            projects={projects}
            skills={skills}
            notes={notes}
            reducedMotion={prefersReducedMotion}
            active={!workspaceRevealed}
            onEnterWorkspace={enterWorkspace}
            onOpenCommandPalette={() => {
              enterWorkspace();
              window.setTimeout(onOpenCommandPalette, prefersReducedMotion ? 0 : 360);
            }}
          />
        </m.div>

      </div>
    </div>
  );
};

const MatrixRain: React.FC<{ active: boolean }> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion() ?? false;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    let frame = 0;
    let width = 0;
    let height = 0;
    let drops: number[] = [];
    let lastFrameTime = 0;
    const shouldAnimate =
      !reducedMotion &&
      !window.matchMedia('(pointer: coarse), (max-width: 640px)').matches;
    const frameInterval = 1000 / 20;
    const glyphs = '01{}<>アイウエオ';
    const canDraw = () => active && document.visibilityState === 'visible';
    const scheduleFrame = () => {
      if (shouldAnimate && canDraw() && !frame) frame = requestAnimationFrame(draw);
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      drops = Array.from({ length: Math.ceil(width / 18) }, () => Math.random() * -30);
      if (canDraw()) draw(0);
    };

    const draw = (time: number) => {
      frame = 0;
      if (!canDraw()) return;
      if (shouldAnimate && time - lastFrameTime < frameInterval) {
        scheduleFrame();
        return;
      }
      lastFrameTime = time;
      context.fillStyle = 'rgba(5, 12, 8, 0.13)';
      context.fillRect(0, 0, width, height);
      context.font = '12px monospace';
      drops.forEach((drop, index) => {
        const character = glyphs[Math.floor(Math.random() * glyphs.length)];
        context.fillStyle = index % 7 === 0 ? 'rgba(142,255,177,0.82)' : 'rgba(16,185,129,0.42)';
        context.fillText(character, index * 18, drop * 18);
        drops[index] = drop * 18 > height && Math.random() > 0.975 ? 0 : drop + (shouldAnimate ? 0.42 : 0);
      });
      scheduleFrame();
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const handleVisibilityChange = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (canDraw()) {
        draw(0);
        scheduleFrame();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    if (canDraw()) scheduleFrame();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [active, reducedMotion]);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 h-full w-full opacity-55" />;
};
