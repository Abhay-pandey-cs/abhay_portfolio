'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { SiteSettings } from '@/types';
import { ProfilePhoto } from '@/components/ProfilePhoto';

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
  return (
    <div className="w-full bg-[#1e1f22] border-b border-[#2b2d31] px-4 py-2 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-sans">
      {/* Discord Profile & Presence Status */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
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

        {/* Roles Pill */}
        <div className="hidden lg:flex items-center gap-1.5 font-mono text-[10px]">
          <span className="px-2 py-0.5 rounded bg-[#313338] text-[#23a55a] border border-[#3b3e45]">
            Java · Spring · Systems
          </span>
        </div>
      </div>

    </div>
  );
};
