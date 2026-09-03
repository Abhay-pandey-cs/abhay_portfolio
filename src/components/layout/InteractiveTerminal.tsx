'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal as TerminalIcon, 
  ChevronUp, 
  ChevronDown, 
  X, 
  Maximize2, 
  Minimize2, 
  Trash2,
  Play,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Project, LearningTopic, Note, Skill, SiteSettings } from '@/types';

interface InteractiveTerminalProps {
  settings: SiteSettings;
  projects: Project[];
  learning: LearningTopic[];
  notes: Note[];
  skills: Skill[];
  onOpenAdmin?: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

interface CommandLog {
  id: string;
  command?: string;
  output: React.ReactNode;
  type?: 'input' | 'output' | 'error' | 'success';
}

export const InteractiveTerminal: React.FC<InteractiveTerminalProps> = ({
  settings,
  projects,
  learning,
  notes,
  skills,
  onOpenAdmin,
  onNavigateSection,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'terminal' | 'output' | 'debug' | 'problems'>('terminal');
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [logs, setLogs] = useState<CommandLog[]>([
    {
      id: 'init-1',
      output: (
        <div className="text-gray-300 space-y-1">
          <p className="text-[#38bdf8] font-bold">⚡ Abhay Pandey — Interactive Engineering Shell v2.4 (x86_64-lpu-cse)</p>
          <p className="text-gray-400 text-[11px]">Type <span className="text-[#23a55a] font-semibold">help</span> or <span className="text-[#f0b232] font-semibold">projects</span> to interact. Press <span className="text-[#5865f2]">Tab</span> for auto-completion.</p>
        </div>
      ),
      type: 'output'
    }
  ]);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isOpen]);

  const handleRunCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    setHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').toLowerCase();

    let outputNode: React.ReactNode = null;

    switch (cmd) {
      case 'help':
      case '?':
        outputNode = (
          <div className="space-y-1.5 text-gray-300">
            <p className="text-[#38bdf8] font-semibold">Available Shell Commands:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-[11px]">
              <div><span className="text-[#23a55a] font-mono font-bold">projects</span> : List all engineering projects</div>
              <div><span className="text-[#23a55a] font-mono font-bold">learning</span> : Inspect current learning roadmap</div>
              <div><span className="text-[#23a55a] font-mono font-bold">systems</span> : View low-level & OS explorations</div>
              <div><span className="text-[#23a55a] font-mono font-bold">notes</span> : List technical journal notes</div>
              <div><span className="text-[#23a55a] font-mono font-bold">skills</span> : Show verified tech stack</div>
              <div><span className="text-[#23a55a] font-mono font-bold">cat bio.txt</span> : View Abhay's student bio & CGPA</div>
              <div><span className="text-[#23a55a] font-mono font-bold">curl /api/abhay</span> : Fetch JSON profile payload</div>
              <div><span className="text-[#23a55a] font-mono font-bold">sudo admin</span> : Launch CMS Management Panel</div>
              <div><span className="text-[#23a55a] font-mono font-bold">contact</span> : Get direct communication channels</div>
              <div><span className="text-[#23a55a] font-mono font-bold">clear</span> : Clear terminal screen</div>
            </div>
          </div>
        );
        break;

      case 'clear':
      case 'cls':
        setLogs([]);
        setInputVal('');
        return;

      case 'projects':
      case 'ls':
        outputNode = (
          <div className="space-y-2 text-gray-300">
            <p className="text-[#38bdf8] font-semibold">📂 Loaded Engineering Projects ({projects.length}):</p>
            <div className="space-y-1 text-xs">
              {projects.map((p, idx) => (
                <div key={p.id} className="flex items-center gap-2">
                  <span className="text-[#f0b232] font-mono">{idx + 1}.</span>
                  <span className="text-white font-bold">{p.title}</span>
                  <span className="text-gray-400">[{p.category}]</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#007acc]/20 text-[#38bdf8]">{p.status}</span>
                  {p.liveDemoUrl && (
                    <a href={p.liveDemoUrl} target="_blank" rel="noreferrer" className="text-[#25d366] underline text-[11px]">
                      Live Demo ↗
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
        if (onNavigateSection) onNavigateSection('projects');
        break;

      case 'learning':
        outputNode = (
          <div className="space-y-1.5 text-gray-300">
            <p className="text-[#38bdf8] font-semibold">🧠 Active Learning Roadmap ({learning.length} Topics):</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 text-xs">
              {learning.map((t) => (
                <div key={t.id} className="bg-[#1e1f24] p-1.5 rounded border border-[#2e3038]">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{t.title}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#23a55a]/20 text-[#23a55a] font-mono">{t.status}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 truncate mt-0.5">{t.notes}</p>
                </div>
              ))}
            </div>
          </div>
        );
        if (onNavigateSection) onNavigateSection('learning');
        break;

      case 'systems':
        outputNode = (
          <div className="space-y-1.5 text-gray-300 text-xs">
            <p className="text-[#38bdf8] font-semibold">⚙️ Beyond the Application Layer (Systems Focus):</p>
            <p className="text-gray-300">
              Exploring OS Kernels, Linux POSIX syscalls (<code className="text-[#f0b232]">fork</code>, <code className="text-[#f0b232]">exec</code>, <code className="text-[#f0b232]">pipe</code>, <code className="text-[#f0b232]">mmap</code>), 
              CPU Context Switching & TLB caching, Memory Allocation in C/C++, and Dual-core ESP32 FreeRTOS tasks.
            </p>
          </div>
        );
        if (onNavigateSection) onNavigateSection('systems');
        break;

      case 'notes':
        outputNode = (
          <div className="space-y-1 text-gray-300 text-xs">
            <p className="text-[#38bdf8] font-semibold">📝 Technical Notes Archive:</p>
            {notes.map((n) => (
              <div key={n.id} className="flex items-center gap-2">
                <span className="text-[#23a55a]">[{n.category}]</span>
                <span className="text-white font-medium">{n.title}</span>
                <span className="text-gray-400 text-[10px]">({n.date})</span>
              </div>
            ))}
          </div>
        );
        if (onNavigateSection) onNavigateSection('notes');
        break;

      case 'skills':
        outputNode = (
          <div className="space-y-1.5 text-gray-300 text-xs">
            <p className="text-[#38bdf8] font-semibold">🛠️ Verified Technical Stack:</p>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <span key={s.id} className="px-2 py-0.5 bg-[#25272e] border border-[#383a42] rounded text-[11px] font-mono text-gray-200">
                  {s.name} <span className="text-gray-400">({s.group})</span>
                </span>
              ))}
            </div>
          </div>
        );
        break;

      case 'cat':
        if (arg === 'bio.txt' || arg === 'bio' || arg === 'about') {
          outputNode = (
            <div className="space-y-1 text-gray-300 text-xs font-mono bg-[#1a1b20] p-2.5 rounded border border-[#2e3038]">
              <p><span className="text-[#007acc]">Name:</span> {settings.name}</p>
              <p><span className="text-[#007acc]">University:</span> {settings.university}</p>
              <p><span className="text-[#007acc]">Academic Year:</span> {settings.year} · {settings.degree}</p>
              <p><span className="text-[#007acc]">CGPA:</span> Overall <span className="text-[#23a55a] font-bold">{settings.cgpaOverall}</span> (Sem 1: {settings.cgpaFirstSem} · Sem 2: {settings.cgpaSecondSem})</p>
              <p><span className="text-[#007acc]">Bio:</span> {settings.bio}</p>
            </div>
          );
        } else {
          outputNode = <p className="text-red-400 text-xs">cat: {arg || 'file'}: No such file or directory. Try 'cat bio.txt'</p>;
        }
        break;

      case 'curl':
        if (arg.includes('/api/abhay') || arg.includes('api')) {
          outputNode = (
            <pre className="text-[11px] font-mono text-[#38bdf8] bg-[#16171b] p-2 rounded border border-[#2e3038] overflow-x-auto">
{JSON.stringify({
  student: settings.name,
  institution: settings.university,
  standing: settings.currentStatus,
  cgpa: Number(settings.cgpa),
  focus: ['Java Backend', 'Spring Boot', 'PostgreSQL', 'IoT / ESP32', 'Operating Systems'],
  featuredProjects: ['AidSphere', 'AgroSmart']
}, null, 2)}
            </pre>
          );
        } else {
          outputNode = <p className="text-red-400 text-xs">curl: could not resolve host {arg}. Try 'curl /api/abhay'</p>;
        }
        break;

      case 'sudo':
      case 'admin':
        if (onOpenAdmin) {
          onOpenAdmin();
          outputNode = <p className="text-[#23a55a] text-xs">🚀 Launching Portfolio Admin Management Console...</p>;
        } else {
          outputNode = <p className="text-yellow-400 text-xs">Opening /admin dashboard...</p>;
        }
        break;

      case 'contact':
        outputNode = (
          <div className="space-y-1 text-xs text-gray-300 font-mono">
            <p className="text-[#38bdf8] font-semibold">📬 Get in Touch with Abhay:</p>
            <p>Email: <span className="text-white">{settings.email}</span></p>
            <p>GitHub: <a href={settings.github} target="_blank" rel="noreferrer" className="text-[#007acc] underline">{settings.github}</a></p>
            <p>LinkedIn: <a href={settings.linkedin} target="_blank" rel="noreferrer" className="text-[#5865f2] underline">{settings.linkedin}</a></p>
            <p>WhatsApp: <span className="text-[#25d366]">{settings.whatsappNumber}</span></p>
          </div>
        );
        if (onNavigateSection) onNavigateSection('contact');
        break;

      default:
        outputNode = (
          <p className="text-red-400 text-xs font-mono">
            zsh: command not found: <span className="font-bold">{cmd}</span>. Type <span className="text-[#23a55a] underline cursor-pointer" onClick={() => handleRunCommand('help')}>help</span> for available commands.
          </p>
        );
        break;
    }

    setLogs(prev => [
      ...prev,
      {
        id: `cmd-${Date.now()}`,
        command: trimmed,
        output: outputNode,
        type: 'output'
      }
    ]);

    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRunCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIndex);
        setInputVal(history[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const nextIndex = historyIndex + 1;
        if (nextIndex < history.length) {
          setHistoryIndex(nextIndex);
          setInputVal(history[nextIndex]);
        } else {
          setHistoryIndex(-1);
          setInputVal('');
        }
      }
    }
  };

  return (
    <div
      className={`w-full bg-[#18191d] border-t border-[#2e3038] transition-all duration-200 flex flex-col font-mono text-xs z-30 ${
        !isOpen ? 'h-8' : isExpanded ? 'h-[300px]' : 'h-[132px]'
      }`}
    >
      {/* Terminal Title Bar & Tabs */}
      <div className="h-8 bg-[#1e1f24] px-3 flex items-center justify-between border-b border-[#2b2d35] select-none">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-3 py-1 flex items-center gap-1.5 text-xs transition-colors rounded-t ${
              activeTab === 'terminal'
                ? 'bg-[#18191d] text-white font-medium border-t-2 border-[#007acc]'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <TerminalIcon className="w-3.5 h-3.5 text-[#007acc]" />
            <span>Terminal</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#23a55a]" />
          </button>

          <button
            onClick={() => setActiveTab('output')}
            className={`px-3 py-1 flex items-center gap-1.5 text-xs transition-colors rounded-t ${
              activeTab === 'output'
                ? 'bg-[#18191d] text-white font-medium border-t-2 border-[#007acc]'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Info className="w-3.5 h-3.5 text-gray-400" />
            <span>Output</span>
          </button>

          <button
            onClick={() => setActiveTab('problems')}
            className={`px-3 py-1 flex items-center gap-1.5 text-xs transition-colors rounded-t ${
              activeTab === 'problems'
                ? 'bg-[#18191d] text-white font-medium border-t-2 border-[#007acc]'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#23a55a]" />
            <span>Problems (0)</span>
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 text-gray-400">
          <button
            onClick={() => setLogs([])}
            title="Clear Terminal"
            className="p-1 hover:text-white hover:bg-[#2b2d35] rounded"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Collapse' : 'Expand'}
            className="p-1 hover:text-white hover:bg-[#2b2d35] rounded"
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            title={isOpen ? 'Hide Panel' : 'Show Panel'}
            className="p-1 hover:text-white hover:bg-[#2b2d35] rounded"
          >
            {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Terminal View Body */}
      {isOpen && (
        <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-[#141518] text-[#cccccc]">
          {activeTab === 'terminal' && (
            <>
              {logs.map((log) => (
                <div key={log.id} className="space-y-1">
                  {log.command && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <span className="text-[#23a55a] font-bold">abhay@lpu-cse:~$</span>
                      <span className="text-white font-semibold">{log.command}</span>
                    </div>
                  )}
                  <div className="pl-0">{log.output}</div>
                </div>
              ))}

              {/* Interactive prompt line */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[#23a55a] font-bold whitespace-nowrap">abhay@lpu-cse:~$</span>
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="type 'help', 'projects', 'cat bio.txt' or 'sudo admin'..."
                  className="flex-1 bg-transparent text-white outline-none border-none font-mono text-xs placeholder:text-gray-400"
                  autoFocus
                />
              </div>
              <div ref={bottomRef} />
            </>
          )}

          {activeTab === 'output' && (
            <div className="space-y-1 text-gray-400 text-xs">
              <p className="text-gray-300">[Ready] Next.js 15.1 Runtime initialized on Windows 64-bit.</p>
              <p className="text-gray-300">[Info] SQLite / JSON DataStore loaded 2 featured projects (AidSphere, AgroSmart).</p>
              <p className="text-gray-300">[Status] Student status: 2nd Year CSE @ LPU (CGPA: 9.42).</p>
            </div>
          )}

          {activeTab === 'problems' && (
            <div className="flex items-center gap-2 text-[#23a55a] py-2 text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>No errors or linting warnings detected. All systems operational.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
