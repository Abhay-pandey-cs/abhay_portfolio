'use client';

import React from 'react';
import { 
  Cpu, 
  BookOpen, 
  Terminal,
  CheckCircle2
} from 'lucide-react';

export const SystemsDeepDive: React.FC = () => {
  const gateSubjects = [
    'Operating Systems',
    'Database Management Systems (DBMS)',
    'Computer Networks',
    'Computer Organization & Architecture (COA)',
    'Data Structures & Algorithms (DSA)',
    'Discrete Mathematics',
  ];

  const interviewSubjects = [
    'Operating Systems',
    'DBMS & SQL',
    'Computer Networks',
    'Computer Organization & Architecture',
    'Data Structures & Algorithms',
    'System Design (Basics)',
    'OOP with Java',
  ];

  const backendTools = [
    'Java (JDK)',
    'Spring Boot',
    'Spring Data JPA',
    'Hibernate',
    'PostgreSQL',
    'Redis',
    'Maven / Gradle',
    'Docker',
    'Git & GitHub',
    'Postman',
    'IntelliJ IDEA',
  ];

  const columns = [
    { title: 'GATE Subjects', items: gateSubjects },
    { title: 'Interview Subjects', items: interviewSubjects },
    { title: 'Backend Tools', items: backendTools },
  ];

  return (
    <section className="py-8 space-y-6">
      {/* Section Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-mono text-[#f0b232]">
          <BookOpen className="w-3.5 h-3.5" />
          <span>BEYOND THE APPLICATION LAYER</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Core CS & Systems
        </h2>
        <p className="text-sm text-gray-300 font-sans max-w-2xl leading-relaxed">
          The subjects and tools I am working through for GATE preparation, technical interviews, and backend engineering.
        </p>
      </div>

      {/* Clean Lists */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {columns.map((col) => (
          <div
            key={col.title}
            className="p-5 rounded-xl bg-[#18191d] border border-[#2e3038] hover:border-[#007acc]/40 transition-colors shadow-lg space-y-3"
          >
            <div className="flex items-center gap-2.5 pb-2 border-b border-[#262830]">
              <div className="p-2 rounded-lg bg-[#202228] text-[#38bdf8]">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold font-mono text-white">{col.title}</h3>
            </div>

            <div className="space-y-1.5 text-xs font-sans text-gray-300">
              {col.items.map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#23a55a] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
