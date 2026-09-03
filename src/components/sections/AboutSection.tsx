'use client';

import React, { useState } from 'react';
import { 
  GraduationCap, 
  Cpu, 
  Terminal, 
  Database, 
  Layers, 
  Binary, 
  Server, 
  BookOpen,
  Award,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { SiteSettings } from '@/types';

interface AboutSectionProps {
  settings: SiteSettings;
  onNavigateSection?: (sectionId: string) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings, onNavigateSection }) => {
  const [selectedInterest, setSelectedInterest] = useState<string>('java');

  const interests = [
    {
      id: 'java',
      name: 'Java Backend Development',
      icon: Server,
      tag: 'Core Focus',
      summary: 'Exploring multithreading, concurrency utilities (CompletableFuture), JVM memory structures (Heap, Stack, Metaspace), and Garbage Collection algorithms.'
    },
    {
      id: 'spring',
      name: 'Spring Boot & JPA',
      icon: Layers,
      tag: 'Frameworks',
      summary: 'Understanding Inversion of Control (IoC), Dependency Injection, Spring Data JPA repositories, Hibernate entity caching, and transactional ACID boundaries.'
    },
    {
      id: 'pg',
      name: 'PostgreSQL & Databases',
      icon: Database,
      tag: 'Data Layer',
      summary: 'Studying relational schema design, B-Tree and Hash index internals, query execution plans (EXPLAIN ANALYZE), and connection pooling performance.'
    },
    {
      id: 'dsa',
      name: 'Data Structures & Algorithms',
      icon: Binary,
      tag: 'Fundamentals',
      summary: 'Rigorous algorithmic problem solving in Java: Two Pointers, Sliding Window, Binary Trees, Heaps, Graph traversals (BFS/DFS), and Dynamic Programming.'
    },
    {
      id: 'systems',
      name: 'System Architecture',
      icon: Cpu,
      tag: 'Architecture',
      summary: 'Designing modular, event-driven decoupled services, telemetry pipelines, and low-latency communication channels like WebSockets and async queues.'
    },
    {
      id: 'os',
      name: 'Operating Systems',
      icon: Terminal,
      tag: 'Systems',
      summary: 'Investigating CPU context switching overhead, virtual memory paging, translation lookaside buffers (TLB), threads vs processes, and synchronization primitives.'
    },
    {
      id: 'linux',
      name: 'Linux & Low-Level',
      icon: Terminal,
      tag: 'Low-Level',
      summary: 'Working with POSIX syscalls (fork, exec, pipe, mmap, sockets), file descriptor tables, C/C++ memory allocation models, and embedded FreeRTOS on ESP32.'
    }
  ];

  const currentInterest = interests.find(i => i.id === selectedInterest) || interests[0];

  return (
    <section className="py-8 space-y-8">
      {/* Section Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-mono text-[#007acc]">
          <BookOpen className="w-3.5 h-3.5" />
          <span>ABOUT & FOUNDATIONS</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">A Little About Me</h2>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Education Card & Philosophy */}
        <div className="lg:col-span-5 space-y-4">
          {/* Education Card */}
          <div className="p-5 rounded-xl bg-[#18191d] border border-[#2e3038] shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#007acc]/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-[#25272e] border border-[#383a42] text-[#007acc]">
                <GraduationCap className="w-6 h-6" />
              </div>
               <span className="px-2.5 py-1 rounded-full bg-[#23a55a]/15 text-[#23a55a] border border-[#23a55a]/30 font-mono text-xs font-bold">
                 CGPA {settings.cgpaOverall} · S1 {settings.cgpaFirstSem} · S2 {settings.cgpaSecondSem}
               </span>
            </div>

            <div className="space-y-1 mb-4">
              <h3 className="text-lg font-bold text-white">{settings.degree}</h3>
              <p className="text-sm font-mono text-[#38bdf8]">{settings.university}</p>
              <p className="text-xs text-gray-400 font-mono">{settings.year} · Active Full-time</p>
            </div>

            <div className="pt-3 border-t border-[#282a33] text-xs text-gray-300 leading-relaxed font-sans">
              Focusing on strong computer science fundamentals, software engineering methodologies, and building practical systems from the ground up.
            </div>
          </div>

          {/* Philosophy Note */}
          <div className="p-4 rounded-xl bg-[#1a1b20] border border-[#2e3038] space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#f0b232] font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Engineering Approach</span>
            </div>
            <p className="text-gray-300 leading-relaxed font-sans">
              "I prefer understanding the underlying mechanical sympathy of systems—how memory flows, how kernels schedule tasks, and how databases index data—over simply stitching together high-level abstractions."
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Interest Explorer */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-xl bg-[#18191d] border border-[#2e3038] shadow-xl space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-gray-400">SELECT OR HOVER AN AREA OF INTEREST</span>
                <span className="text-[11px] font-mono text-[#007acc]">Interactive Inspector</span>
              </div>
              <p className="text-xs text-gray-300 font-sans">
                Explore the technical domains Abhay is actively cultivating:
              </p>
            </div>

            {/* Interest Pills */}
            <div className="flex flex-wrap gap-2">
              {interests.map((item) => {
                const isSelected = selectedInterest === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedInterest(item.id)}
                    onMouseEnter={() => setSelectedInterest(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all duration-150 ${
                      isSelected
                        ? 'bg-[#007acc] text-white font-semibold shadow-md shadow-[#007acc]/20 scale-105'
                        : 'bg-[#25272e] text-gray-300 hover:text-white hover:bg-[#2e313b] border border-[#383a42]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Interest Detail Box */}
            <div className="p-4 rounded-lg bg-[#141518] border border-[#2c2f38] space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <currentInterest.icon className="w-4 h-4 text-[#38bdf8]" />
                  <h4 className="text-sm font-bold text-white font-mono">{currentInterest.name}</h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2e3038] text-gray-300">
                  {currentInterest.tag}
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                {currentInterest.summary}
              </p>
            </div>

            {onNavigateSection && (
              <div className="flex items-center justify-end">
                <button
                  onClick={() => onNavigateSection('learning')}
                  className="text-xs font-mono text-[#007acc] hover:underline flex items-center gap-1"
                >
                  View full learning roadmap →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
