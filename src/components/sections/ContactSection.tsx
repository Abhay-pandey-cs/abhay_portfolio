'use client';

import React, { useState } from 'react';
import { 
  Mail, 
  MessageSquare, 
  ExternalLink, 
  FileText, 
  Copy, 
  Check, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/icons/BrandIcons';
import { SiteSettings } from '@/types';

interface ContactSectionProps {
  settings: SiteSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    if (settings.email) {
      navigator.clipboard.writeText(settings.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  return (
    <section className="py-8 space-y-8">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-mono text-[#23a55a]">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>DIRECT CONNECT</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Let's Connect</h2>
        <p className="text-sm text-gray-300 font-sans max-w-xl leading-relaxed">
          If you're interested in technology, systems or building things, feel free to connect.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Email & Direct channels */}
        <div className="p-6 rounded-xl bg-[#18191d] border border-[#2e3038] shadow-xl space-y-5">
          <div className="space-y-2">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider font-semibold">
              Primary Email
            </span>
            <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#141518] border border-[#2b2d35]">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#007acc]" />
                <span className="text-xs sm:text-sm font-mono text-white select-all">{settings.email}</span>
              </div>
              <button
                onClick={handleCopyEmail}
                className="p-2 hover:bg-[#25272e] rounded text-gray-400 hover:text-white transition-colors"
                title="Copy Email Address"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-[#23a55a]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Social Links Cards */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider font-semibold">
              Developer Profiles & Socials
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <a
                href={settings.github}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-lg bg-[#202228] hover:bg-[#282b33] border border-[#31343f] flex items-center justify-between text-xs font-mono text-gray-200 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <GithubIcon className="w-4 h-4 text-white" />
                  <span>GitHub</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" />
              </a>

              <a
                href={settings.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-lg bg-[#202228] hover:bg-[#282b33] border border-[#31343f] flex items-center justify-between text-xs font-mono text-gray-200 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <LinkedinIcon className="w-4 h-4 text-[#5865f2]" />
                  <span>LinkedIn</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Resume Card & WhatsApp Fast Link */}
        <div className="p-6 rounded-xl bg-[#18191d] border border-[#2e3038] shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#f0b232]" />
                <h3 className="text-base font-bold text-white font-mono">Curriculum Vitae / Resume</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f0b232]/10 text-[#f0b232] border border-[#f0b232]/25 font-semibold">
                Updated
              </span>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed font-sans">
              While the live portfolio showcases code architecture and systems in depth, a structured PDF summary is available.
            </p>

            <a
              href={settings.resumeUrl || '#'}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-[#25272e] hover:bg-[#2e313b] text-white border border-[#383a42] text-xs font-mono font-medium transition-all shadow-sm"
            >
              <FileText className="w-4 h-4 text-[#f0b232]" />
              <span>View / Download Resume</span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
            </a>
          </div>

          {/* WhatsApp Direct Banner */}
          <div className="p-3.5 rounded-lg bg-[#141518] border border-[#282a32] flex items-center justify-between text-xs font-mono">
            <span className="text-gray-300">WhatsApp Instant Connect:</span>
            <span className="text-[#25d366] font-semibold">{settings.whatsappNumber}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
