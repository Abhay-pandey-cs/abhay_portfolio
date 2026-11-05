'use client';

import React, { useEffect, useRef } from 'react';
import { ShieldCheck } from 'lucide-react';
import { SiteSettings } from '@/types';
import { ProfilePhoto } from '@/components/ProfilePhoto';
import { workspaceTabs } from '@/components/layout/workspaceTabs';

interface DiscordBarProps {
  settings: SiteSettings;
  activeSection: string;
  onSelectSection: (sectionId: string) => void;
}

export const DiscordBar: React.FC<DiscordBarProps> = ({
  settings,
  activeSection,
  onSelectSection,
}) => {
  const tabsRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const nav = tabsRef.current;
    const activeTab = nav?.querySelector<HTMLButtonElement>(`[data-workspace-tab="${activeSection}"]`);
    if (!nav || !activeTab) return;

    const navBounds = nav.getBoundingClientRect();
    const tabBounds = activeTab.getBoundingClientRect();
    const hiddenLeft = tabBounds.left < navBounds.left;
    const hiddenRight = tabBounds.right > navBounds.right;
    if (hiddenLeft || hiddenRight) {
      const offset = activeTab.offsetLeft - nav.clientWidth / 2 + activeTab.clientWidth / 2;
      nav.scrollTo({
        left: Math.max(0, offset),
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      });
    }
  }, [activeSection]);

  return (
    <div className="w-full bg-[#1e1f22] border-b border-[#2b2d31] px-3 py-1.5 flex flex-col md:flex-row items-center gap-2 text-xs font-sans">
      {/* Discord Profile & Presence Status */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start md:shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <ProfilePhoto
              src={settings.profilePhoto || undefined}
              alt={settings.name || 'User'}
              size={32}
              initials={(settings.name || '').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#23a55a] border-2 border-[#1e1f22]" title="Online" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-gray-200">
                {settings.name || 'User'}
              </span>
              <span className="px-1.5 py-0.2 rounded bg-[#5865f2]/20 text-[#5865f2] font-mono text-[10px] font-semibold flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3" />
                CSE STUDENT
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-mono">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#23a55a] animate-pulse" />
              <span>Building Software & Exploring Systems</span>
            </div>
          </div>
        </div>

      </div>

      <nav ref={tabsRef} aria-label="Workspace sections" className="flex min-w-0 w-full md:flex-1 items-center overflow-x-auto scrollbar-none">
        {workspaceTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              data-workspace-tab={tab.id}
              onClick={() => onSelectSection(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              title={tab.title}
              className={`flex h-8 shrink-0 items-center gap-1.5 border-b-2 px-2 text-[10px] font-mono transition-colors ${
                isActive
                  ? 'border-[#38bdf8] bg-white/[0.04] text-white'
                  : 'border-transparent text-gray-400 hover:bg-white/[0.03] hover:text-gray-200'
              }`}
            >
              <Icon className="h-3.5 w-3.5" style={{ color: tab.color }} />
              <span className="hidden xl:inline">{tab.title}</span>
              <span className="xl:hidden">{tab.id === 'overview' ? 'Hero' : tab.id[0].toUpperCase() + tab.id.slice(1)}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
};
