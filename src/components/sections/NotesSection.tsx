'use client';

import React, { useState } from 'react';
import { 
  Terminal, 
  Search, 
  Calendar, 
  Clock, 
  Tag, 
  X, 
  BookOpen, 
  ArrowRight, 
  PlusCircle,
  FileText
} from 'lucide-react';
import { Note, NoteCategory } from '@/types';

interface NotesSectionProps {
  notes: Note[];
  onOpenNewNoteModal?: () => void;
}

export const NotesSection: React.FC<NotesSectionProps> = ({
  notes,
  onOpenNewNoteModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [readingNote, setReadingNote] = useState<Note | null>(null);

  const categories = ['All', 'Java', 'Backend', 'OS', 'Systems', 'DSA', 'Linux'];

  const publishedNotes = notes.filter(n => n.published !== false);

  const filteredNotes = publishedNotes.filter(n => {
    const matchesCat = selectedCategory === 'All' || n.category === selectedCategory;
    const matchesSearch = 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <section className="py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono text-[#007acc]">
            <Terminal className="w-3.5 h-3.5" />
            <span>TECHNICAL JOURNAL</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Engineering Notes</h2>
          <p className="text-sm text-gray-400 font-sans max-w-xl">
            Synthesized explanations, deep dives into OS internals, and lessons learned while building backend systems.
          </p>
        </div>

        {onOpenNewNoteModal && (
          <button
            onClick={onOpenNewNoteModal}
            className="self-start md:self-auto px-3.5 py-2 rounded-lg bg-[#25272e] hover:bg-[#2e313b] text-gray-200 hover:text-white border border-[#383a42] text-xs font-mono flex items-center gap-2 transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-[#23a55a]" />
            <span>+ Write Note</span>
          </button>
        )}
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-[#18191d] border border-[#2e3038]">
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

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes or tags..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#141518] text-gray-200 text-xs font-mono border border-[#2d3039] focus:border-[#007acc] outline-none"
          />
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            onClick={() => setReadingNote(note)}
            className="group p-5 rounded-xl bg-[#18191d] hover:bg-[#1e2026] border border-[#2e3038] hover:border-[#007acc]/60 shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between hover:-translate-y-1"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded bg-[#007acc]/15 text-[#38bdf8] border border-[#007acc]/30 text-[10px] font-mono font-semibold">
                  {note.category}
                </span>
                <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {note.date}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {note.readTime}
                  </span>
                </div>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-[#38bdf8] transition-colors font-sans leading-snug">
                {note.title}
              </h3>

              <p className="text-xs text-gray-300 leading-relaxed font-sans line-clamp-3">
                {note.summary}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-[#262830] flex items-center justify-between text-xs font-mono">
              <div className="flex flex-wrap gap-1">
                {note.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-[#23252d] text-gray-400">
                    #{tag}
                  </span>
                ))}
              </div>

              <span className="text-[#007acc] group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold text-xs">
                Read Note →
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="p-8 text-center rounded-xl bg-[#18191d] border border-[#2e3038] text-gray-400 font-mono text-xs">
          No engineering notes found.
        </div>
      )}

      {/* Note Reader Modal */}
      {readingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#16171b] rounded-2xl border border-[#2e3038] shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-[#1a1b20] border-b border-[#282a32] flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-[#007acc]/20 text-[#38bdf8] font-mono text-xs font-semibold">
                  {readingNote.category}
                </span>
                <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {readingNote.readTime}
                </span>
              </div>

              <button
                onClick={() => setReadingNote(null)}
                className="p-1.5 rounded-lg hover:bg-[#2e313b] text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Note Content Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-gray-300 font-sans">
              <div className="space-y-2 border-b border-[#262830] pb-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
                  {readingNote.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-gray-400">
                  <span>Published on {readingNote.date}</span>
                  <span>·</span>
                  <div className="flex gap-1.5">
                    {readingNote.tags.map(t => (
                      <span key={t} className="text-[#38bdf8]">#{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rendered content */}
              <div className="prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-4 whitespace-pre-line font-sans">
                {readingNote.content}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#1a1b20] border-t border-[#282a32] flex items-center justify-between text-xs font-mono text-gray-400">
              <span>Technical Notes Repository</span>
              <button
                onClick={() => setReadingNote(null)}
                className="px-4 py-1.5 rounded-lg bg-[#25272e] hover:bg-[#2e313b] text-white font-medium transition-colors"
              >
                Close Note
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
