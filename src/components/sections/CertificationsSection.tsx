'use client';

import React from 'react';
import { Award, ExternalLink, Calendar, CheckCircle2, PlusCircle, ShieldCheck } from 'lucide-react';
import { Certification } from '@/types';

interface CertificationsSectionProps {
  certifications: Certification[];
  onOpenAddModal?: () => void;
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({
  certifications,
  onOpenAddModal,
}) => {
  return (
    <section className="py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono text-[#f0b232]">
            <Award className="w-3.5 h-3.5" />
            <span>CREDENTIALS & KNOWLEDGE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Certifications & Validations</h2>
          <p className="text-sm text-gray-400 font-sans max-w-xl">
            Structured courseworks and technical assessments completed by Abhay.
          </p>
        </div>

        {onOpenAddModal && (
          <button
            onClick={onOpenAddModal}
            className="self-start sm:self-auto px-3.5 py-2 rounded-lg bg-[#25272e] hover:bg-[#2e313b] text-gray-200 hover:text-white border border-[#383a42] text-xs font-mono flex items-center gap-2 transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-[#23a55a]" />
            <span>+ Add Certificate</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {certifications.map((cert) => (
          <div
            key={cert.id}
            className="p-5 rounded-xl bg-[#18191d] border border-[#2e3038] hover:border-[#f0b232]/50 shadow-lg transition-all duration-200 flex flex-col justify-between space-y-4 group hover:-translate-y-1"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="p-2 rounded-lg bg-[#f0b232]/10 text-[#f0b232] border border-[#f0b232]/20">
                  <Award className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>{cert.date}</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-[#f0b232] transition-colors font-sans leading-snug">
                  {cert.title}
                </h3>
                <p className="text-xs font-mono text-[#38bdf8] mt-0.5">{cert.issuer}</p>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed font-sans line-clamp-3">
                {cert.description}
              </p>
            </div>

            <div className="space-y-3 pt-2 border-t border-[#262830]">
              <div className="flex flex-wrap gap-1">
                {cert.skills.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded bg-[#23252d] text-[10px] font-mono text-gray-300"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-mono text-[#38bdf8] hover:underline"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#23a55a]" />
                  <span>Verify Credential ↗</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
