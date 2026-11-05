'use client';

import React, { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import { pointAtProgress, workspaceCurvePath, workspaceCurvePoints } from '@/lib/motion';
import { workspaceTabs } from '@/components/layout/workspaceTabs';

interface WorkspaceProgressProps {
  scrollRef: RefObject<HTMLDivElement | null>;
  activeSection: string;
}

export const WorkspaceProgress: React.FC<WorkspaceProgressProps> = ({ scrollRef, activeSection }) => {
  const [sectionScrollProgress, setSectionScrollProgress] = useState(0);
  const sectionIndex = Math.max(0, workspaceTabs.findIndex((tab) => tab.id === activeSection));
  const progress = (sectionIndex + sectionScrollProgress) / (workspaceTabs.length - 1);
  const point = pointAtProgress(workspaceCurvePoints, progress);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let frame = 0;
    const updateProgress = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const range = container.scrollHeight - container.clientHeight;
        setSectionScrollProgress(range > 0 ? container.scrollTop / range : 0);
      });
    };

    updateProgress();
    container.addEventListener('scroll', updateProgress, { passive: true });

    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateProgress);
    resizeObserver?.observe(container);
    if (container.firstElementChild) resizeObserver?.observe(container.firstElementChild);

    return () => {
      cancelAnimationFrame(frame);
      container.removeEventListener('scroll', updateProgress);
      resizeObserver?.disconnect();
    };
  }, [scrollRef, activeSection]);

  return (
    <div
      className="flex w-[78px] shrink-0 items-center justify-end gap-1.5 text-[9px] font-mono text-gray-500"
      role="progressbar"
      aria-label="Portfolio section progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      title={`${workspaceTabs[sectionIndex].title}: ${Math.round(progress * 100)}%`}
    >
      <span className="hidden sm:inline">REF</span>
      <svg aria-hidden="true" viewBox="0 0 72 22" className="h-[18px] w-[58px]">
        <path d={workspaceCurvePath} fill="none" stroke="#39404a" strokeWidth="1" />
        <path
          d={workspaceCurvePath}
          fill="none"
          stroke="#38bdf8"
          strokeWidth="1.25"
          pathLength={1}
          strokeDasharray={`${progress} 1`}
        />
        <circle cx={point.x} cy={point.y} r="2" fill="#38bdf8" />
      </svg>
    </div>
  );
};
