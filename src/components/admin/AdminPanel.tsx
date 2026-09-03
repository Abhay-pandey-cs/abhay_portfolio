'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Plus, 
  Edit3, 
  Trash2, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  X, 
  Lock, 
  Save, 
  RefreshCw, 
  Sparkles, 
  Layers, 
  BookOpen, 
  Terminal, 
  Cpu, 
  Wrench, 
  Sliders, 
  Download, 
  AlertTriangle,
  ExternalLink,
  Code2,
  Calendar,
  Database,
  CheckCircle2,
  HardDrive,
  Award,
  Trophy,
  Briefcase,
  Heart,
  GraduationCap
} from 'lucide-react';
import { MongoIcon, LeetCodeIcon, CodeChefIcon, GithubIcon, LinkedinIcon } from '@/components/icons/BrandIcons';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { 
  Project, 
  LearningTopic, 
  LearningStatus,
  Note, 
  Skill, 
  SiteSettings, 
  Certification,
  Achievement,
  Experience,
  EducationItem,
  CommunityProject
} from '@/types';
import { DataStore } from '@/lib/storage';

interface AdminPanelProps {
  initialProjects: Project[];
  initialLearning: LearningTopic[];
  initialNotes: Note[];
  initialSkills: Skill[];
  initialSettings: SiteSettings;
  initialCertifications?: Certification[];
  initialAchievements?: Achievement[];
   initialExperience?: Experience[];
  initialCommunity?: CommunityProject[];
  initialEducation?: EducationItem[];
  onClose?: () => void;
  onDataChange?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  initialProjects,
  initialLearning,
  initialNotes,
  initialSkills,
  initialSettings,
  initialCertifications = [],
  initialAchievements = [],
  initialExperience = [],
  initialCommunity,
  initialEducation = [],
  onClose,
  onDataChange,
}) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Active admin tab
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'experience' | 'certifications' | 'achievements' | 'learning' | 'notes' | 'skills' | 'community' | 'education' | 'database' | 'settings'>('overview');

  // Live state
  const [projects, setProjects] = useState<Project[]>([]);
  const [learning, setLearning] = useState<LearningTopic[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
    name: '',
    role: '',
    subtitle: '',
    bio: '',
    currentStatus: '',
    university: '',
    degree: '',
    year: '',
    cgpa: '',
    cgpaFirstSem: '',
    cgpaSecondSem: '',
    cgpaOverall: '',
    email: '',
    github: '',
    linkedin: '',
    leetcode: '',
    codechef: '',
    whatsappNumber: '',
    resumeUrl: '',
    githubStatsUsername: '',
    splineSceneUrl: '',
    footerQuote: '',
    profilePhoto: '',
    enablePhotoBooth: false
  });
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [community, setCommunity] = useState<CommunityProject[]>([]);
  const [education, setEducation] = useState<EducationItem[]>([]);

  // Modals & Editors
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingLearning, setEditingLearning] = useState<LearningTopic | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [editingAch, setEditingAch] = useState<Achievement | null>(null);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [editingCommunity, setEditingCommunity] = useState<CommunityProject | null>(null);
  const [editingEducation, setEditingEducation] = useState<EducationItem | null>(null);

  // Safe Delete Modal State
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string; title: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Initial sync from props (only on mount)
  const [isInitialSync, setIsInitialSync] = useState(true);
  useEffect(() => {
    if (!isInitialSync) return;
    setProjects(initialProjects);
    setLearning(initialLearning);
    setNotes(initialNotes);
    setSkills(initialSkills);
    setCertifications(initialCertifications);
    setAchievements(initialAchievements);
    setExperience(initialExperience);
    setCommunity(initialCommunity || []);
    setEducation(initialEducation);
    setIsInitialSync(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'abhay2026') {
      setIsAuthenticated(true);
      setAuthError('');
      showToast('Admin session authenticated successfully');
    } else {
      setAuthError('Incorrect passcode. Contact the site owner for access.');
    }
  };

  // Safe delete handler
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      const res = await fetch(`/api/${deleteTarget.type === 'learning' ? 'learning' : deleteTarget.type}s`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteTarget.id }),
      });
      if (!res.ok) throw new Error('Delete failed');
      onDataChange?.();
      showToast(`Deleted ${deleteTarget.type} "${deleteTarget.title}"`);
    } catch (e) {
      showToast('Failed to delete');
    }
    setDeleteTarget(null);
    if (onDataChange) onDataChange();
  };

  // Reorder projects
  const handleMoveProject = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === projects.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...projects];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    const ids = reordered.map(p => p.id);
    try {
      const res = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reorder', projectIds: ids }),
      });
      if (!res.ok) throw new Error('Reorder failed');
      const updated = await res.json();
      setProjects(updated);
      if (onDataChange) onDataChange();
      showToast('Project display order updated.');
    } catch (e) {
      showToast('Failed to reorder projects');
    }
  };

  // Save Project
  const handleSaveProject = async (project: Project) => {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });
      if (!res.ok) throw new Error('Failed to save project');
      const saved = await res.json();
      onDataChange?.();
      setEditingProject(null);
      showToast(`Project "${saved.title}" saved successfully!`);
    } catch (e) {
      showToast('Failed to save project');
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('Failed to save settings');
      const updated = await res.json();
      setSettings(updated);
      showToast('Site settings, profiles & resume updated.');
      if (onDataChange) onDataChange();
    } catch (e) {
      showToast('Failed to save settings');
    }
  };

  // Quick learning status switch
  const handleSetLearningStatus = async (id: string, status: LearningStatus) => {
    const topic = learning.find((t) => t.id === id);
    if (!topic) return;
    try {
      const res = await fetch('/api/learning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...topic, status }),
      });
      if (!res.ok) throw new Error('Failed to update learning topic');
      onDataChange?.();
      if (onDataChange) onDataChange();
    } catch (e) {
      showToast('Failed to update learning topic');
    }
  };

  // Export JSON backup
  const handleExportBackup = () => {
    const data = {
      projects,
      learning,
      notes,
      skills,
      settings,
      certifications,
      achievements,
      experience,
      community,
      education,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `abhay-portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('Portfolio database backup exported.');
  };

  // Reset to Defaults
  const handleResetDefaults = async () => {
    if (window.confirm('Reset all portfolio projects, notes, and topics to original defaults?')) {
      try {
        const res = await fetch('/api/backup', { method: 'POST' });
        if (!res.ok) throw new Error('Reset failed');
        onDataChange?.();
        showToast('Reset to original default state complete.');
        if (onDataChange) onDataChange();
      } catch (e) {
        showToast('Failed to reset defaults');
      }
    }
  };

  // Login Gate View
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div className="w-full max-w-md bg-[#18191e] rounded-2xl border border-[#2e3038] p-6 sm:p-8 shadow-2xl space-y-6 font-sans">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#5865f2]/20 text-[#5865f2]">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white font-mono">Admin Management CMS</h2>
                <p className="text-xs text-gray-400 font-mono">Abhay Pandey Portfolio Control</p>
              </div>
            </div>
            {onClose && (
              <button onClick={onClose} className="p-1 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-gray-300">Enter Admin Passcode:</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                   placeholder="Enter admin access key"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#141518] text-white text-xs font-mono border border-[#2e3038] focus:border-[#5865f2] outline-none"
                  autoFocus
                />
              </div>
              {authError && <p className="text-xs text-red-400 font-mono">{authError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[#5865f2] hover:bg-[#4752c4] text-white font-medium text-xs font-mono shadow-md transition-colors"
            >
              Unlock Admin Panel
            </button>
          </form>

          <p className="text-[11px] font-mono text-gray-400 text-center">
            Authorized access only.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#121316] text-[#e2e4e9] font-sans">
      {/* Admin Top Header */}
      <header className="h-14 bg-[#18191e] border-b border-[#2b2d35] px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#5865f2]" />
            <span className="font-mono font-bold text-sm text-white">Portfolio Admin CMS</span>
          </div>
          <span className="hidden sm:inline px-2 py-0.5 rounded bg-[#23a55a]/15 text-[#23a55a] border border-[#23a55a]/30 text-[10px] font-mono font-semibold">
            AUTHENTICATED
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportBackup}
            className="px-2.5 py-1.5 rounded-lg bg-[#25272e] hover:bg-[#2e313b] text-gray-300 text-xs font-mono flex items-center gap-1.5 border border-[#383a42]"
            title="Download JSON Database"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Export JSON</span>
          </button>

          <button
            onClick={handleResetDefaults}
            className="px-2.5 py-1.5 rounded-lg bg-[#25272e] hover:bg-[#2e313b] text-gray-300 text-xs font-mono flex items-center gap-1.5 border border-[#383a42]"
            title="Reset to initial data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset Defaults</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-[#5865f2] hover:bg-[#4752c4] text-white text-xs font-mono font-semibold flex items-center gap-1"
            >
              <span>Exit Admin</span>
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* Admin Subnav Tabs */}
      <div className="bg-[#16171b] border-b border-[#25272e] px-4 sm:px-6 flex items-center gap-1 overflow-x-auto scrollbar-none py-1.5 text-xs font-mono">
        {[
          { id: 'overview', label: 'Overview', icon: Sparkles },
          { id: 'projects', label: `Projects (${projects.length})`, icon: Code2 },
          { id: 'experience', label: `Experience (${experience.length})`, icon: Briefcase },
          { id: 'certifications', label: `Certificates (${certifications.length})`, icon: Award },
          { id: 'achievements', label: `Achievements (${achievements.length})`, icon: Trophy },
          { id: 'learning', label: `Learning (${learning.length})`, icon: BookOpen },
          { id: 'notes', label: `Notes (${notes.length})`, icon: Terminal },
          { id: 'skills', label: `Skills (${skills.length})`, icon: Wrench },
          { id: 'community', label: `Community (${community.length})`, icon: Heart },
          { id: 'education', label: `Education (${education.length})`, icon: GraduationCap },
          { id: 'database', label: 'MongoDB & Database', icon: Database },
          { id: 'settings', label: 'Profiles & Settings', icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-[#5865f2] text-white font-semibold shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#202228]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Body */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-6">
        {toastMessage && (
          <div className="p-3 bg-[#23a55a]/20 border border-[#23a55a]/40 text-[#23a55a] rounded-lg text-xs font-mono flex items-center justify-between animate-in fade-in">
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage(null)}><X className="w-3.5 h-3.5" /></button>
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              <div className="p-4 rounded-xl bg-[#18191d] border border-[#2e3038] space-y-1">
                <span className="text-[11px] font-mono text-gray-400">Projects</span>
                <p className="text-xl font-bold text-white font-mono">{projects.length}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#18191d] border border-[#2e3038] space-y-1">
                <span className="text-[11px] font-mono text-gray-400">Experience</span>
                <p className="text-xl font-bold text-[#007acc] font-mono">{experience.length}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#18191d] border border-[#2e3038] space-y-1">
                <span className="text-[11px] font-mono text-gray-400">Certificates</span>
                <p className="text-xl font-bold text-[#f0b232] font-mono">{certifications.length}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#18191d] border border-[#2e3038] space-y-1">
                <span className="text-[11px] font-mono text-gray-400">Achievements</span>
                <p className="text-xl font-bold text-[#23a55a] font-mono">{achievements.length}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#18191d] border border-[#2e3038] space-y-1">
                <span className="text-[11px] font-mono text-gray-400">Learning Topics</span>
                <p className="text-xl font-bold text-[#38bdf8] font-mono">{learning.length}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#18191d] border border-[#2e3038] space-y-1">
                <span className="text-[11px] font-mono text-gray-400">Notes</span>
                <p className="text-xl font-bold text-[#c084fc] font-mono">{notes.length}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#18191d] border border-[#2e3038] space-y-1">
                <span className="text-[11px] font-mono text-gray-400">Skills</span>
                <p className="text-xl font-bold text-gray-200 font-mono">{skills.length}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#18191d] border border-[#2e3038] space-y-1">
                <span className="text-[11px] font-mono text-gray-400">Community</span>
                <p className="text-xl font-bold text-[#5865f2] font-mono">{community.length}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#18191d] border border-[#2e3038] space-y-1">
                <span className="text-[11px] font-mono text-gray-400">Education</span>
                <p className="text-xl font-bold text-[#f0b232] font-mono">{education.length}</p>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="p-6 rounded-xl bg-[#18191d] border border-[#2e3038] space-y-4">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                Quick Content Adders
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <button
                  onClick={() => {
                    setEditingProject({
                      id: `proj-${Date.now()}`,
                      title: '',
                      slug: '',
                      subtitle: '',
                      shortDescription: '',
                      fullDescription: '',
                      category: 'Backend',
                      status: 'In Progress',
                      featured: false,
                      published: true,
                      displayOrder: projects.length + 1,
                      technologies: [],
                      whatWasBuilt: '',
                      howItWorks: '',
                      problem: '',
                      solution: '',
                      approach: '',
                      features: [],
                      challenges: [],
                      whatILearned: [],
                      futureImprovements: [],
                      updatedAt: new Date().toISOString().split('T')[0]
                    });
                    setActiveTab('projects');
                  }}
                  className="p-4 rounded-lg bg-[#202228] hover:bg-[#282b33] border border-[#31343f] text-left transition-colors flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white font-mono">+ New Project</h4>
                    <p className="text-[11px] text-gray-400">What, When, How</p>
                  </div>
                  <Code2 className="w-5 h-5 text-[#007acc]" />
                </button>

                <button
                  onClick={() => {
                    setEditingCert({
                      id: `cert-${Date.now()}`,
                      title: '',
                      issuer: '',
                      date: new Date().toISOString().split('T')[0],
                      skills: [],
                      description: ''
                    });
                    setActiveTab('certifications');
                  }}
                  className="p-4 rounded-lg bg-[#202228] hover:bg-[#282b33] border border-[#31343f] text-left transition-colors flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white font-mono">+ Certificate</h4>
                    <p className="text-[11px] text-gray-400">Course & Credential</p>
                  </div>
                  <Award className="w-5 h-5 text-[#f0b232]" />
                </button>

                <button
                  onClick={() => {
                    setEditingAch({
                      id: `ach-${Date.now()}`,
                      title: '',
                      organization: '',
                      date: '2024',
                      rankOrHonor: '',
                      description: '',
                      proofUrl: undefined
                    });
                    setActiveTab('achievements');
                  }}
                  className="p-4 rounded-lg bg-[#202228] hover:bg-[#282b33] border border-[#31343f] text-left transition-colors flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white font-mono">+ Achievement</h4>
                    <p className="text-[11px] text-gray-400">Academic & Hackathon</p>
                  </div>
                  <Trophy className="w-5 h-5 text-[#23a55a]" />
                </button>

                <button
                  onClick={() => {
                    setEditingExp({
                      id: `exp-${Date.now()}`,
                      role: '',
                      organization: '',
                      location: '',
                      startDate: '2024-01',
                      endDate: 'Present',
                      current: true,
                      description: '',
                      highlights: [],
                      technologies: [],
                      certificateUrl: undefined
                    });
                    setActiveTab('experience');
                  }}
                  className="p-4 rounded-lg bg-[#202228] hover:bg-[#282b33] border border-[#31343f] text-left transition-colors flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white font-mono">+ Experience</h4>
                    <p className="text-[11px] text-gray-400">Roles & Contributions</p>
                  </div>
                  <Briefcase className="w-5 h-5 text-[#38bdf8]" />
                </button>

                <button
                  onClick={() => {
                    setEditingCommunity({
                      id: `comm-${Date.now()}`,
                      title: '',
                      organization: '',
                      role: '',
                      hours: 0,
                      description: '',
                      highlights: [],
                      startDate: '',
                      endDate: '',
                      photo: ''
                    });
                    setActiveTab('community');
                  }}
                  className="p-4 rounded-lg bg-[#202228] hover:bg-[#282b33] border border-[#31343f] text-left transition-colors flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white font-mono">+ Community</h4>
                    <p className="text-[11px] text-gray-400">Impact & Mentorship</p>
                  </div>
                  <Heart className="w-5 h-5 text-[#5865f2]" />
                </button>

                <button
                  onClick={() => {
                    setEditingEducation({
                      id: `edu-${Date.now()}`,
                      degree: '',
                      institution: '',
                      year: '',
                      cgpa: '',
                      location: '',
                      coursework: [],
                      description: ''
                    });
                    setActiveTab('education');
                  }}
                  className="p-4 rounded-lg bg-[#202228] hover:bg-[#282b33] border border-[#31343f] text-left transition-colors flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white font-mono">+ Education</h4>
                    <p className="text-[11px] text-gray-400">Academic History</p>
                  </div>
                  <GraduationCap className="w-5 h-5 text-[#f0b232]" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROJECTS MANAGEMENT */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                Projects List & "What, When, How"
              </h3>
              <button
                onClick={() => setEditingProject({
                  id: `proj-${Date.now()}`,
                  title: '',
                  slug: '',
                  subtitle: '',
                  shortDescription: '',
                  fullDescription: '',
                  category: 'Backend',
                  status: 'In Progress',
                  featured: false,
                  published: true,
                  displayOrder: projects.length + 1,
                  technologies: [],
                  whatWasBuilt: '',
                  howItWorks: '',
                  problem: '',
                  solution: '',
                  approach: '',
                  features: [],
                  challenges: [],
                  whatILearned: [],
                  futureImprovements: [],
                  updatedAt: new Date().toISOString().split('T')[0]
                })}
                className="px-3 py-1.5 rounded-lg bg-[#007acc] hover:bg-[#006bb3] text-white text-xs font-mono font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ New Project</span>
              </button>
            </div>

            <div className="rounded-xl bg-[#18191d] border border-[#2e3038] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#141518] text-gray-400 border-b border-[#2e3038]">
                    <tr>
                      <th className="p-3">Order</th>
                      <th className="p-3">Project</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Visibility</th>
                      <th className="p-3">Featured</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#262830]">
                    {projects.map((proj, idx) => (
                      <tr key={proj.id} className="hover:bg-[#1f2026] transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <span className="w-4 text-gray-400">{idx + 1}</span>
                            <button
                              onClick={() => handleMoveProject(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleMoveProject(idx, 'down')}
                              disabled={idx === projects.length - 1}
                              className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-white">{proj.title}</div>
                          <div className="text-[10px] text-gray-400 truncate max-w-xs">{proj.subtitle}</div>
                        </td>
                        <td className="p-3 text-gray-300">{proj.category}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-[#23a55a]/10 text-[#23a55a] border border-[#23a55a]/30 text-[10px]">
                            {proj.status}
                          </span>
                        </td>
                         <td className="p-3">
                           <button
                             onClick={async () => {
                               const updated = { ...proj, published: !proj.published };
                               await fetch('/api/projects', {
                                 method: 'POST',
                                 headers: { 'Content-Type': 'application/json' },
                                 body: JSON.stringify(updated),
                               });
                               onDataChange?.();
                               if (onDataChange) onDataChange();
                             }}
                             className={`px-2 py-0.5 rounded text-[10px] ${
                               proj.published ? 'bg-[#23a55a]/20 text-[#23a55a]' : 'bg-gray-700/30 text-gray-400'
                             }`}
                           >
                             {proj.published ? 'Published' : 'Draft'}
                           </button>
                         </td>
                         <td className="p-3">
                           <button
                             onClick={async () => {
                               const updated = { ...proj, featured: !proj.featured };
                               await fetch('/api/projects', {
                                 method: 'POST',
                                 headers: { 'Content-Type': 'application/json' },
                                 body: JSON.stringify(updated),
                               });
                               onDataChange?.();
                               if (onDataChange) onDataChange();
                             }}
                             className={`px-2 py-0.5 rounded text-[10px] ${
                               proj.featured ? 'bg-[#f0b232]/20 text-[#f0b232]' : 'bg-gray-700/30 text-gray-400'
                             }`}
                           >
                             {proj.featured ? 'Featured' : 'Normal'}
                          </button>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingProject(proj)}
                              className="p-1.5 rounded hover:bg-[#2e313b] text-[#38bdf8]"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget({ type: 'project', id: proj.id, title: proj.title })}
                              className="p-1.5 rounded hover:bg-red-500/20 text-red-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: EXPERIENCE */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                Experience & Leadership Roles
              </h3>
              <button
                onClick={() => setEditingExp({
                  id: `exp-${Date.now()}`,
                  role: '',
                  organization: '',
                  location: '',
                  startDate: '2024-01',
                  endDate: 'Present',
                  current: true,
                  description: '',
                  highlights: [],
                  technologies: [],
                  certificateUrl: undefined
                })}
                className="px-3 py-1.5 rounded-lg bg-[#007acc] text-white text-xs font-mono font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Experience</span>
              </button>
            </div>

            <div className="space-y-3">
              {experience.map((exp) => (
                <div key={exp.id} className="p-4 rounded-xl bg-[#18191d] border border-[#2e3038] flex items-start justify-between gap-3 text-xs font-mono">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{exp.role}</span>
                      <span className="text-[#38bdf8]">@ {exp.organization}</span>
                    </div>
                    <p className="text-[11px] text-gray-400">{exp.startDate} — {exp.endDate}</p>
                    <p className="text-xs text-gray-300 font-sans line-clamp-2 mt-1">{exp.description}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button onClick={() => setEditingExp(exp)} className="p-1.5 text-[#38bdf8]">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDeleteTarget({ type: 'experience', id: exp.id, title: exp.role })} className="p-1.5 text-red-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: CERTIFICATIONS */}
        {activeTab === 'certifications' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                Certifications & Courseworks
              </h3>
              <button
                onClick={() => setEditingCert({
                  id: `cert-${Date.now()}`,
                  title: '',
                  issuer: '',
                  date: '2024',
                  skills: [],
                  description: ''
                })}
                className="px-3 py-1.5 rounded-lg bg-[#f0b232] text-black font-bold text-xs font-mono flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Certificate</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {certifications.map((cert) => (
                <div key={cert.id} className="p-4 rounded-xl bg-[#18191d] border border-[#2e3038] flex items-start justify-between gap-3 text-xs font-mono">
                  <div className="space-y-1">
                    <div className="font-bold text-white">{cert.title}</div>
                    <div className="text-[11px] text-[#38bdf8]">{cert.issuer} · {cert.date}</div>
                    <p className="text-[11px] text-gray-300 font-sans mt-1">{cert.description}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button onClick={() => setEditingCert(cert)} className="p-1.5 text-[#38bdf8]">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDeleteTarget({ type: 'certification', id: cert.id, title: cert.title })} className="p-1.5 text-red-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: ACHIEVEMENTS */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                Achievements & Academic Honors
              </h3>
              <button
                onClick={() => setEditingAch({
                  id: `ach-${Date.now()}`,
                  title: '',
                  organization: '',
                  date: '2024',
                  rankOrHonor: '',
                  description: ''
                })}
                className="px-3 py-1.5 rounded-lg bg-[#23a55a] text-white font-bold text-xs font-mono flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Achievement</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {achievements.map((ach) => (
                <div key={ach.id} className="p-4 rounded-xl bg-[#18191d] border border-[#2e3038] flex items-start justify-between gap-3 text-xs font-mono">
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#f0b232] font-semibold">{ach.rankOrHonor}</span>
                    <div className="font-bold text-white">{ach.title}</div>
                    <div className="text-[11px] text-gray-400">{ach.organization} ({ach.date})</div>
                    <p className="text-[11px] text-gray-300 font-sans mt-1">{ach.description}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button onClick={() => setEditingAch(ach)} className="p-1.5 text-[#38bdf8]">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDeleteTarget({ type: 'achievement', id: ach.id, title: ach.title })} className="p-1.5 text-red-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: LEARNING */}
        {activeTab === 'learning' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                Learning Topics Roadmap
              </h3>
              <button
                onClick={() => setEditingLearning({
                  id: `learn-${Date.now()}`,
                  title: '',
                  category: 'Backend',
                  status: 'Learning',
                  notes: '',
                  subtopics: [],
                  updatedAt: new Date().toISOString().split('T')[0]
                })}
                className="px-3 py-1.5 rounded-lg bg-[#23a55a] text-white text-xs font-mono font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Topic</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {learning.map((topic) => (
                <div key={topic.id} className="p-4 rounded-xl bg-[#18191d] border border-[#2e3038] flex items-start justify-between gap-3 text-xs font-mono">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{topic.title}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#25272e] text-gray-400">{topic.category}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 font-sans line-clamp-2">{topic.notes}</p>
                    <div className="flex items-center gap-1 flex-wrap">
                      {(['Yet to Start', 'Learning', 'Finished'] as LearningStatus[]).map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSetLearningStatus(topic.id, s)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-colors ${
                            topic.status === s
                              ? 'bg-[#5865f2] text-white border-[#5865f2]'
                              : 'bg-[#141518] text-gray-400 border-[#2e3038] hover:text-white'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setEditingLearning(topic)} className="p-1.5 text-[#38bdf8]"><Edit3 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setDeleteTarget({ type: 'learning', id: topic.id, title: topic.title })} className="p-1.5 text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: NOTES */}
        {activeTab === 'notes' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Technical Notes & Journal</h3>
              <button
                onClick={() => setEditingNote({
                  id: `note-${Date.now()}`,
                  title: '',
                  slug: '',
                  date: new Date().toISOString().split('T')[0],
                  category: 'Java',
                  tags: [],
                  summary: '',
                  content: '',
                  readTime: '3 min read',
                  published: true,
                  updatedAt: new Date().toISOString().split('T')[0]
                })}
                className="px-3 py-1.5 rounded-lg bg-[#5865f2] text-white text-xs font-mono font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ Write Note</span>
              </button>
            </div>

            <div className="space-y-3">
              {notes.map((note) => (
                <div key={note.id} className="p-4 rounded-xl bg-[#18191d] border border-[#2e3038] flex items-center justify-between gap-3 text-xs font-mono">
                  <div className="space-y-1">
                    <div className="font-bold text-white">{note.title}</div>
                    <div className="text-[10px] text-gray-400">{note.date} · {note.category}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setEditingNote(note)} className="p-1.5 text-[#38bdf8]"><Edit3 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setDeleteTarget({ type: 'note', id: note.id, title: note.title })} className="p-1.5 text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: SKILLS */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Tech Stack Management</h3>
              <button
                onClick={() => setEditingSkill({
                  id: `skill-${Date.now()}`,
                  name: '',
                  group: 'Languages',
                  status: 'Used in Projects'
                })}
                className="px-3 py-1.5 rounded-lg bg-[#007acc] text-white text-xs font-mono font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Skill</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {skills.map((skill) => (
                <div key={skill.id} className="p-3 rounded-lg bg-[#18191d] border border-[#2e3038] flex items-center justify-between text-xs font-mono">
                  <div>
                    <div className="font-bold text-white">{skill.name}</div>
                    <div className="text-[10px] text-gray-400">{skill.group} · {skill.status}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setEditingSkill(skill)} className="p-1 text-[#38bdf8]"><Edit3 className="w-3 h-3" /></button>
                    <button onClick={() => setDeleteTarget({ type: 'skill', id: skill.id, title: skill.name })} className="p-1 text-red-400"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

         {/* TAB: COMMUNITY IMPACT */}
         {activeTab === 'community' && (
           <div className="p-6 rounded-xl bg-[#18191d] border border-[#2e3038] space-y-6 text-xs font-mono max-w-5xl">
             <div className="flex items-center justify-between border-b border-[#282a32] pb-4">
               <div className="flex items-center gap-3">
                 <div className="p-2 rounded-lg bg-[#5865f2]/20 text-[#5865f2]">
                   <Heart className="w-6 h-6" />
                 </div>
                 <div>
                   <h3 className="text-sm font-bold text-white">Community Impact Projects</h3>
                   <p className="text-[11px] text-gray-400">Manage multiple community projects — title, org, role, hours, dates, photo, description, highlights</p>
                 </div>
               </div>
               <button
                 onClick={() => setEditingCommunity({
                   id: `comm-${Date.now()}`,
                   title: '',
                   organization: '',
                   role: '',
                   hours: 0,
                   description: '',
                   highlights: [],
                   startDate: '',
                   endDate: '',
                   photo: ''
                 })}
                 className="px-3 py-1.5 rounded-lg bg-[#23a55a] hover:bg-[#1f934f] text-white font-bold text-xs font-mono flex items-center gap-1.5"
               >
                 <Plus className="w-4 h-4" />
                 <span>+ Add Community Project</span>
               </button>
             </div>

             <div className="space-y-3">
               {community.map((item) => (
                 <div key={item.id} className="p-4 rounded-xl bg-[#18191d] border border-[#2e3038] flex items-center justify-between gap-3 text-xs font-mono">
                   <div className="flex items-center gap-3">
                     {item.photo && (
                       <img src={item.photo} alt={item.title} className="w-10 h-10 rounded border border-[#2e3038] object-cover" />
                     )}
                     <div className="space-y-0.5">
                       <div className="font-bold text-white">{item.title || 'Untitled Project'}</div>
                       <div className="text-[11px] text-gray-400">{item.organization} — {item.role} — {item.hours} hrs</div>
                     </div>
                   </div>
                   <div className="flex items-center gap-1">
                     <button onClick={() => setEditingCommunity(item)} className="p-1.5 text-[#38bdf8]">
                       <Edit3 className="w-3.5 h-3.5" />
                     </button>
                     <button onClick={() => setDeleteTarget({ type: 'community', id: item.id, title: item.title })} className="p-1.5 text-red-400">
                       <Trash2 className="w-3.5 h-3.5" />
                     </button>
                   </div>
                 </div>
               ))}
               {community.length === 0 && (
                 <div className="text-center py-8 text-gray-500 text-xs">No community projects yet. Click "+ Add Community Project" to get started.</div>
               )}
             </div>
           </div>
          )}

         {/* TAB: EDUCATION */}
         {activeTab === 'education' && (
           <div className="p-6 rounded-xl bg-[#18191d] border border-[#2e3038] space-y-6 text-xs font-mono max-w-5xl">
             <div className="flex items-center justify-between border-b border-[#282a32] pb-4">
               <div className="flex items-center gap-3">
                 <div className="p-2 rounded-lg bg-[#f0b232]/20 text-[#f0b232]">
                   <GraduationCap className="w-6 h-6" />
                 </div>
                 <div>
                   <h3 className="text-sm font-bold text-white">Education History</h3>
                   <p className="text-[11px] text-gray-400">Degree, institution, year, CGPA, location, coursework</p>
                 </div>
               </div>
               <button
                 onClick={() => setEditingEducation({
                   id: `edu-${Date.now()}`,
                   degree: '',
                   institution: '',
                   year: '',
                   cgpa: '',
                   location: '',
                   coursework: [],
                   description: ''
                 })}
                 className="px-3 py-1.5 rounded-lg bg-[#23a55a] hover:bg-[#1f934f] text-white font-bold text-xs font-mono flex items-center gap-1.5"
               >
                 <Plus className="w-4 h-4" />
                 <span>+ Add Education</span>
               </button>
             </div>

             <div className="space-y-3">
               {education.map((edu) => (
                 <div key={edu.id} className="p-4 rounded-xl bg-[#18191d] border border-[#2e3038] flex items-center justify-between gap-3 text-xs font-mono">
                   <div className="space-y-0.5">
                     <div className="font-bold text-white">{edu.degree}</div>
                     <div className="text-[11px] text-gray-400">{edu.institution} ({edu.year}) — CGPA: {edu.cgpa}</div>
                   </div>
                   <div className="flex items-center gap-1">
                     <button onClick={() => setEditingEducation(edu)} className="p-1.5 text-[#38bdf8]">
                       <Edit3 className="w-3.5 h-3.5" />
                     </button>
                     <button onClick={() => setDeleteTarget({ type: 'education', id: edu.id, title: edu.degree })} className="p-1.5 text-red-400">
                       <Trash2 className="w-3.5 h-3.5" />
                     </button>
                   </div>
                 </div>
               ))}
               {education.length === 0 && (
                 <div className="text-center py-8 text-gray-500 text-xs">No education entries yet. Click "+ Add Education" to get started.</div>
               )}
             </div>
           </div>
         )}

         {/* TAB: DATABASE & MONGODB */}
        {activeTab === 'database' && (
          <div className="p-6 rounded-xl bg-[#18191d] border border-[#2e3038] space-y-6 text-xs font-mono max-w-3xl">
            <div className="flex items-center justify-between border-b border-[#282a32] pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#23a55a]/20 text-[#23a55a]">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">MongoDB & Student Multi-Use Database Engine</h3>
                  <p className="text-[11px] text-gray-400">Long-term persistent data storage for all engineering records</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-[#23a55a]/15 text-[#23a55a] border border-[#23a55a]/30 font-bold">
                ACTIVE & SYNCED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-[#141518] border border-[#282a32] space-y-2">
                <div className="flex items-center gap-2 text-white font-bold">
                  <HardDrive className="w-4 h-4 text-[#38bdf8]" />
                  <span>Local Persistent Engine</span>
                </div>
                <p className="text-[11px] text-gray-400">
                  Self-contained JSON & storage cache. Everything you create is saved to your browser and workspace files immediately.
                </p>
                <span className="text-[10px] text-[#23a55a] flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3 h-3" /> Ready & Operational
                </span>
              </div>

              <div className="p-4 rounded-lg bg-[#141518] border border-[#282a32] space-y-2">
                <div className="flex items-center gap-2 text-white font-bold">
                  <MongoIcon className="w-4 h-4 text-[#23a55a]" />
                  <span>MongoDB Atlas Cloud Uplink</span>
                </div>
                <p className="text-[11px] text-gray-400">
                  Set <code className="text-[#38bdf8]">MONGODB_URI</code> in environment variables or cloud provider to enable automatic Atlas syncing.
                </p>
                <span className="text-[10px] text-[#38bdf8] flex items-center gap-1 font-bold">
                  ● Cloud Adapter Wired
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <span className="text-gray-400 font-bold uppercase tracking-wider text-[11px]">Database Operations</span>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleExportBackup}
                  className="px-4 py-2.5 rounded-lg bg-[#007acc] hover:bg-[#006bb3] text-white font-bold flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Full JSON Database</span>
                </button>
              </div>

              <div className="pt-4 space-y-2">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[11px]">Export Collections Separately</span>
                <p className="text-[10px] text-gray-500">Download each collection as its own JSON file for MongoDB import</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {[
                    { name: 'projects', data: projects },
                    { name: 'skills', data: skills },
                    { name: 'experience', data: experience },
                     { name: 'education', data: education },
                    { name: 'certifications', data: certifications },
                    { name: 'achievements', data: achievements },
                    { name: 'community', data: community },
                    { name: 'learning', data: learning },
                    { name: 'notes', data: notes },
                    { name: 'settings', data: [settings] }
                  ].map(col => (
                    <button
                      key={col.name}
                      onClick={() => {
                        const blob = new Blob([JSON.stringify(col.data, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${col.name}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="px-3 py-2 rounded bg-[#141518] border border-[#282a32] hover:border-[#38bdf8] text-[11px] text-gray-300 hover:text-white transition-colors text-left"
                    >
                      <span className="font-bold">{col.name}</span>
                      <span className="text-[10px] text-gray-500 ml-1">
                        ({Array.isArray(col.data) ? col.data.length : 1})
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: SETTINGS & PROFILES */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="p-6 rounded-xl bg-[#18191d] border border-[#2e3038] space-y-5 text-xs font-mono max-w-3xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Student Profiles, Socials & Resume
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-gray-400">Full Name:</label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400">Subtitle / Tagline:</label>
                <input
                  type="text"
                  value={settings.subtitle}
                  onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
                  className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400">Role / Title:</label>
                <input
                  type="text"
                  value={settings.role}
                  onChange={(e) => setSettings({ ...settings, role: e.target.value })}
                  className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400">Current Status:</label>
                <input
                  type="text"
                  value={settings.currentStatus}
                  onChange={(e) => setSettings({ ...settings, currentStatus: e.target.value })}
                  className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400">University:</label>
                <input
                  type="text"
                  value={settings.university}
                  onChange={(e) => setSettings({ ...settings, university: e.target.value })}
                  className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400">Degree:</label>
                <input
                  type="text"
                  value={settings.degree}
                  onChange={(e) => setSettings({ ...settings, degree: e.target.value })}
                  className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400">Year / Period:</label>
                <input
                  type="text"
                  value={settings.year}
                  onChange={(e) => setSettings({ ...settings, year: e.target.value })}
                  className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400">CGPA:</label>
                <input
                  type="text"
                  value={settings.cgpa}
                  onChange={(e) => setSettings({ ...settings, cgpa: e.target.value })}
                  className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <ImageUpload
                  label="Profile Photo"
                  value={settings.profilePhoto}
                  onChange={(url) => setSettings({ ...settings, profilePhoto: url })}
                  placeholder="https://... or upload photo"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400">CGPA — Overall:</label>
                <input
                  type="text"
                  value={settings.cgpaOverall}
                  onChange={(e) => setSettings({ ...settings, cgpaOverall: e.target.value })}
                  className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <label className="text-gray-400">CGPA — First Semester:</label>
                  <input
                    type="text"
                    value={settings.cgpaFirstSem}
                    onChange={(e) => setSettings({ ...settings, cgpaFirstSem: e.target.value })}
                    className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                  />
                </div>
                <div className="space-y-1">
                   <label className="text-gray-400">CGPA — Second Semester:</label>
                  <input
                    type="text"
                    value={settings.cgpaSecondSem}
                    onChange={(e) => setSettings({ ...settings, cgpaSecondSem: e.target.value })}
                    className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                  />
                </div>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-gray-400">Hero Bio:</label>
                <textarea
                  rows={3}
                  value={settings.bio}
                  onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
                  className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white font-sans text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400">Email Address:</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400">WhatsApp Number:</label>
                <input
                  type="text"
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400">GitHub Profile URL:</label>
                <input
                  type="text"
                  value={settings.github}
                  onChange={(e) => setSettings({ ...settings, github: e.target.value })}
                  className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400">LinkedIn Profile URL:</label>
                <input
                  type="text"
                  value={settings.linkedin}
                  onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
                  className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 flex items-center gap-1.5">
                  <LeetCodeIcon className="w-3.5 h-3.5 text-[#f0b232]" />
                  <span>LeetCode Profile URL:</span>
                </label>
                <input
                  type="text"
                  value={settings.leetcode || ''}
                  onChange={(e) => setSettings({ ...settings, leetcode: e.target.value })}
                  className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                  placeholder="https://leetcode.com/u/..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 flex items-center gap-1.5">
                  <CodeChefIcon className="w-3.5 h-3.5 text-[#5865f2]" />
                  <span>CodeChef Profile URL:</span>
                </label>
                <input
                  type="text"
                  value={settings.codechef || ''}
                  onChange={(e) => setSettings({ ...settings, codechef: e.target.value })}
                  className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                  placeholder="https://www.codechef.com/users/..."
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-gray-400">Resume Link / URL:</label>
                <input
                  type="text"
                  value={settings.resumeUrl}
                  onChange={(e) => setSettings({ ...settings, resumeUrl: e.target.value })}
                  className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                  placeholder="https://... or /resume.pdf"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 flex items-center gap-1.5">
                  <GithubIcon className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>GitHub Stats Username:</span>
                </label>
                <input
                  type="text"
                  value={settings.githubStatsUsername || ''}
                  onChange={(e) => setSettings({ ...settings, githubStatsUsername: e.target.value || undefined })}
                  className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                  placeholder="e.g. abhaypandey"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-gray-400">Spline Scene URL:</label>
                <input
                  type="url"
                  value={settings.splineSceneUrl}
                  onChange={(e) => setSettings({ ...settings, splineSceneUrl: e.target.value })}
                  className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                  placeholder="https://my.spline.design/..."
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-gray-400">Footer Quote:</label>
                <textarea
                  rows={2}
                  value={settings.footerQuote}
                  onChange={(e) => setSettings({ ...settings, footerQuote: e.target.value })}
                  className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white font-sans text-xs"
                />
              </div>

              <div className="space-y-1 flex items-end">
                <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enablePhotoBooth}
                    onChange={(e) => setSettings({ ...settings, enablePhotoBooth: e.target.checked })}
                    className="w-4 h-4 rounded bg-[#141518] border border-[#2e3038] text-[#007acc]"
                  />
                  <span>Enable Photo Booth</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#23a55a] hover:bg-[#1f934f] text-white font-bold flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save All Settings & Profiles</span>
            </button>
          </form>
        )}
      </main>

      {/* SAFE DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#18191e] rounded-xl border border-red-500/40 p-6 space-y-4 font-sans text-xs">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-white font-mono">Delete {deleteTarget.type}?</h3>
                <p className="text-gray-400 font-mono text-[11px]">{deleteTarget.title}</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">This action cannot be undone. Are you sure?</p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setDeleteTarget(null)} className="px-3 py-1.5 rounded-lg bg-[#25272e] text-gray-300">Cancel</button>
              <button onClick={handleConfirmDelete} className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold">Confirm Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* PROJECT EDITOR MODAL */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-3xl max-h-[92vh] bg-[#16171b] rounded-2xl border border-[#2e3038] shadow-2xl flex flex-col overflow-hidden font-sans">
            <div className="p-4 bg-[#1a1b20] border-b border-[#282a32] flex items-center justify-between">
              <h3 className="text-sm font-mono font-bold text-white">
                {editingProject.id.startsWith('proj-') && !editingProject.title ? 'Create New Project (What, When, How)' : `Edit: ${editingProject.title}`}
              </h3>
              <button onClick={() => setEditingProject(null)} className="p-1 text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-400">Project Title *</label>
                  <input
                    type="text"
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ 
                      ...editingProject, 
                      title: e.target.value,
                      slug: editingProject.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                    })}
                    placeholder="e.g. AidSphere"
                    className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-400">URL Slug *</label>
                  <input
                    type="text"
                    value={editingProject.slug}
                    onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                    placeholder="e.g. aidsphere"
                    className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-gray-400">Subtitle</label>
                  <input
                    type="text"
                    value={editingProject.subtitle}
                    onChange={(e) => setEditingProject({ ...editingProject, subtitle: e.target.value })}
                    placeholder="e.g. Intelligent Emergency Response Platform"
                    className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-400">Start Date (When)</label>
                  <input
                    type="text"
                    value={editingProject.startDate || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, startDate: e.target.value })}
                    placeholder="e.g. 2024-06"
                    className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-400">Completion Date</label>
                  <input
                    type="text"
                    value={editingProject.completionDate || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, completionDate: e.target.value })}
                    placeholder="e.g. 2024-11 or Present"
                    className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-gray-400">What Was Built</label>
                  <textarea
                    rows={2}
                    value={editingProject.whatWasBuilt || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, whatWasBuilt: e.target.value })}
                    placeholder="Describe the system and deliverable built..."
                    className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white font-sans text-xs"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-gray-400">How It Works (Architecture & Methods)</label>
                  <textarea
                    rows={2}
                    value={editingProject.howItWorks || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, howItWorks: e.target.value })}
                    placeholder="Explain the technical mechanics and engineering flow..."
                    className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white font-sans text-xs"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-gray-400">Technologies (comma separated)</label>
                  <input
                    type="text"
                    value={editingProject.technologies.join(', ')}
                    onChange={(e) => setEditingProject({ 
                      ...editingProject, 
                      technologies: e.target.value.split(',').map(t => t.trim()).filter(Boolean) 
                    })}
                    placeholder="Java, Spring Boot, PostgreSQL, ESP32"
                    className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-400">Live Demo URL</label>
                  <input
                    type="text"
                    value={editingProject.liveDemoUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, liveDemoUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-400">GitHub Repository URL</label>
                  <input
                    type="text"
                    value={editingProject.githubUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                  />
                </div>

                <div className="flex items-center gap-6 sm:col-span-2 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProject.published}
                      onChange={(e) => setEditingProject({ ...editingProject, published: e.target.checked })}
                    />
                    <span>Published</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProject.featured}
                      onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                    />
                    <span className="text-[#f0b232]">Featured on Hero</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#1a1b20] border-t border-[#282a32] flex items-center justify-between">
              <button onClick={() => setEditingProject(null)} className="px-4 py-2 rounded-lg bg-[#25272e] text-gray-300">Cancel</button>
              <button onClick={() => handleSaveProject(editingProject)} disabled={!editingProject.title} className="px-4 py-2 rounded-lg bg-[#007acc] text-white font-bold flex items-center gap-1.5">
                <Save className="w-4 h-4" />
                <span>Save Project</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CERTIFICATION EDITOR MODAL */}
      {editingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#18191e] rounded-xl border border-[#2e3038] p-5 space-y-4 text-xs font-mono">
            <h3 className="text-sm font-bold text-white">Edit Certificate</h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-gray-400">Certificate Title *</label>
                <input
                  type="text"
                  value={editingCert.title}
                  onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                  placeholder="e.g. Java Programming Fundamentals"
                  className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400">Issuer / Organization</label>
                <input
                  type="text"
                  value={editingCert.issuer}
                  onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                  placeholder="e.g. Duke University / Coursera / Oracle"
                  className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400">Date Issued (When)</label>
                <input
                  type="text"
                  value={editingCert.date}
                  onChange={(e) => setEditingCert({ ...editingCert, date: e.target.value })}
                  placeholder="e.g. 2024-03"
                  className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400">Credential Verification Link</label>
                <input
                  type="text"
                  value={editingCert.credentialUrl || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, credentialUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                 />
               </div>
               <div className="space-y-1">
                 <label className="text-gray-400">Badge / Certificate Image</label>
                 <ImageUpload
                   value={editingCert.badgeImage || ''}
                   onChange={(url) => setEditingCert({ ...editingCert, badgeImage: url })}
                   placeholder="https://... or upload badge image"
                 />
               </div>
               <div className="space-y-1">
                 <label className="text-gray-400">Description / Skills Learned</label>
                <textarea
                  rows={2}
                  value={editingCert.description}
                  onChange={(e) => setEditingCert({ ...editingCert, description: e.target.value })}
                  className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white font-sans text-xs"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setEditingCert(null)} className="px-3 py-1.5 rounded bg-[#25272e] text-gray-300">Cancel</button>
               <button onClick={async () => {
                 await fetch('/api/certifications', {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify(editingCert),
                 });
                 onDataChange?.();
                 setEditingCert(null);
                 showToast('Certificate saved.');
                 if (onDataChange) onDataChange();
               }} disabled={!editingCert.title} className="px-3 py-1.5 rounded bg-[#f0b232] text-black font-bold">Save Certificate</button>
            </div>
          </div>
        </div>
      )}

      {/* ACHIEVEMENT EDITOR MODAL */}
      {editingAch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#18191e] rounded-xl border border-[#2e3038] p-5 space-y-4 text-xs font-mono">
            <h3 className="text-sm font-bold text-white">Edit Achievement</h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-gray-400">Title *</label>
                <input
                  type="text"
                  value={editingAch.title}
                  onChange={(e) => setEditingAch({ ...editingAch, title: e.target.value })}
                  placeholder="e.g. Dean's Academic Honor List"
                  className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400">Honor / Rank</label>
                <input
                  type="text"
                  value={editingAch.rankOrHonor}
                  onChange={(e) => setEditingAch({ ...editingAch, rankOrHonor: e.target.value })}
                  placeholder="e.g. CGPA 9.42 / Finalist Lead"
                  className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400">Organization / Event</label>
                <input
                  type="text"
                  value={editingAch.organization}
                  onChange={(e) => setEditingAch({ ...editingAch, organization: e.target.value })}
                  placeholder="e.g. Lovely Professional University"
                  className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400">Year / Date</label>
                <input
                  type="text"
                  value={editingAch.date}
                  onChange={(e) => setEditingAch({ ...editingAch, date: e.target.value })}
                  placeholder="e.g. 2024"
                  className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400">Description</label>
                <textarea
                  rows={2}
                  value={editingAch.description}
                  onChange={(e) => setEditingAch({ ...editingAch, description: e.target.value })}
                  className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white font-sans text-xs"
                />
               </div>
               <div className="space-y-1">
                 <label className="text-gray-400">Proof / Verification URL (optional)</label>
                 <input
                   type="url"
                   value={editingAch.proofUrl || ''}
                   onChange={(e) => setEditingAch({ ...editingAch, proofUrl: e.target.value || undefined })}
                   placeholder="https://..."
                   className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                 />
               </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button onClick={() => setEditingAch(null)} className="px-3 py-1.5 rounded bg-[#25272d] text-gray-300">Cancel</button>
                 <button onClick={async () => {
                   await fetch('/api/achievements', {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify(editingAch),
                   });
                   onDataChange?.();
                   setEditingAch(null);
                   showToast('Achievement saved.');
                   if (onDataChange) onDataChange();
                 }} disabled={!editingAch.title} className="px-3 py-1.5 rounded bg-[#23a55a] text-white font-bold">Save Achievement</button>
              </div>
            </div>
          </div>
        )}

       {/* EXPERIENCE EDITOR MODAL */}
       {editingExp && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
           <div className="w-full max-w-2xl max-h-[90vh] bg-[#18191e] rounded-xl border border-[#2e3038] shadow-2xl flex flex-col overflow-hidden font-sans">
             <div className="p-4 bg-[#1a1b20] border-b border-[#282a32] flex items-center justify-between">
               <h3 className="text-sm font-mono font-bold text-white">
                 {editingExp.id.startsWith('exp-') ? 'Create New Experience' : `Edit: ${editingExp.role}`}
               </h3>
               <button onClick={() => setEditingExp(null)} className="p-1 text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
             </div>
             <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs font-mono">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                 <div className="space-y-1">
                   <label className="text-gray-400">Role / Position *</label>
                   <input
                     type="text"
                     value={editingExp.role}
                     onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                     placeholder="e.g. Lead Developer"
                     className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                   />
                 </div>
                 <div className="space-y-1">
                   <label className="text-gray-400">Organization *</label>
                   <input
                     type="text"
                     value={editingExp.organization}
                     onChange={(e) => setEditingExp({ ...editingExp, organization: e.target.value })}
                     placeholder="e.g. AidSphere Project / Gaganraj Foundation"
                     className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                   />
                 </div>
                 <div className="space-y-1">
                   <label className="text-gray-400">Location</label>
                   <input
                     type="text"
                     value={editingExp.location || ''}
                     onChange={(e) => setEditingExp({ ...editingExp, location: e.target.value })}
                     placeholder="e.g. Punjab, India or Remote"
                     className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                   />
                 </div>
                 <div className="space-y-1">
                   <label className="text-gray-400">Start Date</label>
                   <input
                     type="text"
                     value={editingExp.startDate}
                     onChange={(e) => setEditingExp({ ...editingExp, startDate: e.target.value })}
                     placeholder="2024-06"
                     className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                   />
                 </div>
                 <div className="space-y-1">
                   <label className="text-gray-400">End Date</label>
                   <input
                     type="text"
                     value={editingExp.endDate}
                     onChange={(e) => setEditingExp({ ...editingExp, endDate: e.target.value })}
                     placeholder="Present or 2024-11"
                     className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                   />
                 </div>
                 <div className="space-y-1 flex items-end">
                   <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                     <input
                       type="checkbox"
                       checked={editingExp.current}
                       onChange={(e) => setEditingExp({ ...editingExp, current: e.target.checked })}
                       className="w-4 h-4 rounded bg-[#141518] border border-[#2e3038] text-[#007acc]"
                     />
                     <span>Current / Ongoing</span>
                   </label>
                 </div>
                 <div className="sm:col-span-2 space-y-1">
                   <label className="text-gray-400">Technologies (comma separated)</label>
                   <input
                     type="text"
                     value={(editingExp.technologies || []).join(', ')}
                     onChange={(e) => setEditingExp({ ...editingExp, technologies: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                     placeholder="e.g. React, Node.js, MongoDB, WebSockets"
                     className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                   />
                 </div>
                 <div className="sm:col-span-2 space-y-1">
                   <label className="text-gray-400">Highlights (one per line)</label>
                   <textarea
                     rows={3}
                     value={(editingExp.highlights || []).join('\n')}
                     onChange={(e) => setEditingExp({ ...editingExp, highlights: e.target.value.split('\n').filter(Boolean) })}
                     placeholder="Key accomplishment or highlight"
                     className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white font-sans text-xs"
                   />
                 </div>
                 <div className="space-y-1">
                   <label className="text-gray-400">Certificate URL (optional)</label>
                   <input
                     type="url"
                     value={editingExp.certificateUrl || ''}
                     onChange={(e) => setEditingExp({ ...editingExp, certificateUrl: e.target.value || undefined })}
                     placeholder="https://..."
                     className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                   />
                 </div>
                 <div className="sm:col-span-2 space-y-1">
                   <label className="text-gray-400">Description</label>
                   <textarea
                     rows={3}
                     value={editingExp.description}
                     onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })}
                     className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white font-sans text-xs"
                   />
                 </div>
               </div>
             </div>
             <div className="p-4 bg-[#1a1b20] border-t border-[#282a32] flex items-center justify-end gap-2">
               <button onClick={() => setEditingExp(null)} className="px-4 py-2 rounded bg-[#25272e] text-gray-300">Cancel</button>
                <button onClick={async () => {
                  await fetch('/api/experience', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(editingExp),
                  });
                  onDataChange?.();
                  setEditingExp(null);
                  showToast('Experience saved.');
                  if (onDataChange) onDataChange();
                }} disabled={!editingExp.role} className="px-4 py-2 rounded bg-[#007acc] hover:bg-[#006bb3] text-white font-bold flex items-center gap-1.5">
                  <Save className="w-4 h-4" />
                  <span>Save Experience</span>
                </button>
             </div>
           </div>
         </div>
       )}

       {/* COMMUNITY EDITOR MODAL */}
       {editingCommunity && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
           <div className="w-full max-w-2xl max-h-[90vh] bg-[#18191e] rounded-xl border border-[#2e3038] shadow-2xl flex flex-col overflow-hidden font-sans">
             <div className="p-4 bg-[#1a1b20] border-b border-[#282a32] flex items-center justify-between">
               <h3 className="text-sm font-mono font-bold text-white">
                 {editingCommunity.id.startsWith('comm-') ? 'Create New Community Project' : `Edit: ${editingCommunity.title}`}
               </h3>
               <button onClick={() => setEditingCommunity(null)} className="p-1 text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
             </div>
             <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs font-mono">
               <div className="space-y-1">
                 <label className="text-gray-400">Title</label>
                 <input
                   type="text"
                   value={editingCommunity.title}
                   onChange={(e) => setEditingCommunity({ ...editingCommunity, title: e.target.value })}
                   className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                 />
               </div>
               <div className="space-y-1">
                 <label className="text-gray-400">Organization</label>
                 <input
                   type="text"
                   value={editingCommunity.organization}
                   onChange={(e) => setEditingCommunity({ ...editingCommunity, organization: e.target.value })}
                   className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                 />
               </div>
               <div className="space-y-1">
                 <label className="text-gray-400">Role</label>
                 <input
                   type="text"
                   value={editingCommunity.role}
                   onChange={(e) => setEditingCommunity({ ...editingCommunity, role: e.target.value })}
                   className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                 />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                   <label className="text-gray-400">Start Date</label>
                   <input
                     type="text"
                     value={editingCommunity.startDate}
                     onChange={(e) => setEditingCommunity({ ...editingCommunity, startDate: e.target.value })}
                     placeholder="2024-06"
                     className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                   />
                 </div>
                 <div className="space-y-1">
                   <label className="text-gray-400">End Date</label>
                   <input
                     type="text"
                     value={editingCommunity.endDate}
                     onChange={(e) => setEditingCommunity({ ...editingCommunity, endDate: e.target.value })}
                     placeholder="2024-07 or Present"
                     className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                   />
                 </div>
               </div>
               <div className="space-y-1">
                 <label className="text-gray-400">Hours Volunteered</label>
                 <input
                   type="number"
                   value={editingCommunity.hours}
                   onChange={(e) => setEditingCommunity({ ...editingCommunity, hours: Number(e.target.value) })}
                   className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                 />
               </div>
               <div className="space-y-1">
                 <label className="text-gray-400">Photo</label>
                 <ImageUpload
                   value={editingCommunity.photo || ''}
                   onChange={(url) => setEditingCommunity({ ...editingCommunity, photo: url })}
                   placeholder="https://... or upload community photo"
                 />
               </div>
               <div className="space-y-1">
                 <label className="text-gray-400">Description</label>
                 <textarea
                   rows={3}
                   value={editingCommunity.description}
                   onChange={(e) => setEditingCommunity({ ...editingCommunity, description: e.target.value })}
                   className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white font-sans text-xs"
                 />
               </div>
               <div className="space-y-1">
                 <label className="text-gray-400">Highlights (one per line)</label>
                 <textarea
                   rows={4}
                   value={editingCommunity.highlights.join('\n')}
                   onChange={(e) => setEditingCommunity({ ...editingCommunity, highlights: e.target.value.split('\n').filter(Boolean) })}
                   className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white font-sans text-xs"
                 />
               </div>
             </div>
             <div className="p-4 bg-[#1a1b20] border-t border-[#282a32] flex items-center justify-end gap-2">
               <button onClick={() => setEditingCommunity(null)} className="px-4 py-2 rounded bg-[#25272e] text-gray-300">Cancel</button>
                <button onClick={async () => {
                  await fetch('/api/community', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(editingCommunity),
                  });
                  onDataChange?.();
                  setEditingCommunity(null);
                  showToast('Community project saved.');
                  if (onDataChange) onDataChange();
                }} disabled={!editingCommunity.title} className="px-4 py-2 rounded bg-[#5865f2] hover:bg-[#4752c4] text-white font-bold flex items-center gap-1.5">
                  <Save className="w-4 h-4" />
                  <span>Save Community Project</span>
                </button>
             </div>
           </div>
         </div>
       )}

       {/* LEARNING TOPIC MODAL */}
      {editingLearning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#18191e] rounded-xl border border-[#2e3038] p-5 space-y-4 text-xs font-mono">
            <h3 className="text-sm font-bold text-white">Edit Learning Topic</h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-gray-400">Topic Title</label>
                <input
                  type="text"
                  value={editingLearning.title}
                  onChange={(e) => setEditingLearning({ ...editingLearning, title: e.target.value })}
                  className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400">Category</label>
                <select
                  value={editingLearning.category}
                  onChange={(e) => setEditingLearning({ ...editingLearning, category: e.target.value as any })}
                  className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                >
                  <option value="Backend">Backend</option>
                  <option value="DSA">DSA</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Systems">Systems</option>
                  <option value="Web & Tools">Web & Tools</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-gray-400">Status</label>
                <select
                  value={editingLearning.status}
                  onChange={(e) => setEditingLearning({ ...editingLearning, status: e.target.value as any })}
                  className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                >
                  <option value="Yet to Start">Yet to Start</option>
                  <option value="Learning">Learning</option>
                  <option value="Finished">Finished</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-gray-400">Concept Notes</label>
                <textarea
                  rows={3}
                  value={editingLearning.notes || ''}
                  onChange={(e) => setEditingLearning({ ...editingLearning, notes: e.target.value })}
                  className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white font-sans text-xs"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setEditingLearning(null)} className="px-3 py-1.5 rounded bg-[#25272e] text-gray-300">Cancel</button>
               <button onClick={async () => {
                 await fetch('/api/learning', {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify(editingLearning),
                 });
                 onDataChange?.();
                 setEditingLearning(null);
                 showToast('Topic saved.');
                 if (onDataChange) onDataChange();
               }} disabled={!editingLearning.title} className="px-3 py-1.5 rounded bg-[#23a55a] text-white font-bold">Save Topic</button>
            </div>
          </div>
        </div>
      )}

      {/* NOTE MODAL */}
      {editingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl max-h-[90vh] bg-[#16171b] rounded-2xl border border-[#2e3038] shadow-2xl flex flex-col overflow-hidden font-sans">
            <div className="p-4 bg-[#1a1b20] border-b border-[#282a32] flex items-center justify-between">
              <h3 className="text-sm font-mono font-bold text-white">Write / Edit Note</h3>
              <button onClick={() => setEditingNote(null)} className="p-1 text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-gray-400">Note Title *</label>
                <input
                  type="text"
                  value={editingNote.title}
                  onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                  className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400">Markdown Content</label>
                <textarea
                  rows={8}
                  value={editingNote.content}
                  onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                  className="w-full p-2.5 rounded bg-[#141518] border border-[#2e3038] text-white font-mono text-xs leading-relaxed"
                />
              </div>
            </div>
            <div className="p-4 bg-[#1a1b20] border-t border-[#282a32] flex items-center justify-between">
              <button onClick={() => setEditingNote(null)} className="px-4 py-2 rounded bg-[#25272e] text-gray-300">Cancel</button>
              <button onClick={async () => {
                await fetch('/api/notes', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(editingNote),
                });
                onDataChange?.();
                setEditingNote(null);
                showToast('Note saved.');
                if (onDataChange) onDataChange();
              }} disabled={!editingNote.title} className="px-4 py-2 rounded bg-[#5865f2] text-white font-bold flex items-center gap-1.5"><Save className="w-4 h-4" /><span>Save Note</span></button>
            </div>
          </div>
        </div>
      )}

      {/* SKILL MODAL */}
      {editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#18191e] rounded-xl border border-[#2e3038] p-5 space-y-4 text-xs font-mono">
            <h3 className="text-sm font-bold text-white">Edit Skill</h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-gray-400">Skill Name</label>
                <input
                  type="text"
                  value={editingSkill.name}
                  onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400">Group</label>
                <select
                  value={editingSkill.group}
                  onChange={(e) => setEditingSkill({ ...editingSkill, group: e.target.value as any })}
                  className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                >
                  <option value="Languages">Languages</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="Systems">Systems</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Tools">Tools</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setEditingSkill(null)} className="px-3 py-1.5 rounded bg-[#25272e] text-gray-300">Cancel</button>
              <button onClick={async () => {
                await fetch('/api/skills', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(editingSkill),
                });
                onDataChange?.();
                setEditingSkill(null);
                showToast('Skill saved.');
                if (onDataChange) onDataChange();
              }} disabled={!editingSkill.name} className="px-3 py-1.5 rounded bg-[#007acc] text-white font-bold">Save Skill</button>
            </div>
          </div>
        </div>
      )}

      {/* EDUCATION EDITOR MODAL */}
      {editingEducation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] bg-[#18191e] rounded-xl border border-[#2e3038] shadow-2xl flex flex-col overflow-hidden font-sans">
            <div className="p-4 bg-[#1a1b20] border-b border-[#282a32] flex items-center justify-between">
              <h3 className="text-sm font-mono font-bold text-white">
                {editingEducation.id.startsWith('edu-') ? 'Create New Education Entry' : `Edit: ${editingEducation.degree}`}
              </h3>
              <button onClick={() => setEditingEducation(null)} className="p-1 text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-400">Degree / Program *</label>
                  <input
                    type="text"
                    value={editingEducation.degree}
                    onChange={(e) => setEditingEducation({ ...editingEducation, degree: e.target.value })}
                    placeholder="e.g. B.Tech — Computer Science Engineering"
                    className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400">Institution *</label>
                  <input
                    type="text"
                    value={editingEducation.institution}
                    onChange={(e) => setEditingEducation({ ...editingEducation, institution: e.target.value })}
                    placeholder="e.g. Lovely Professional University"
                    className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400">Year / Period *</label>
                  <input
                    type="text"
                    value={editingEducation.year}
                    onChange={(e) => setEditingEducation({ ...editingEducation, year: e.target.value })}
                    placeholder="e.g. 2023 — Present"
                    className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400">CGPA / Score *</label>
                  <input
                    type="text"
                    value={editingEducation.cgpa}
                    onChange={(e) => setEditingEducation({ ...editingEducation, cgpa: e.target.value })}
                    placeholder="e.g. 9.42 / 10 or 3.7 / 4.0"
                    className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-gray-400">Location</label>
                  <input
                    type="text"
                    value={editingEducation.location}
                    onChange={(e) => setEditingEducation({ ...editingEducation, location: e.target.value })}
                    placeholder="e.g. Punjab, India"
                    className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-gray-400">Coursework / Key Subjects (one per line)</label>
                  <textarea
                    rows={3}
                    value={editingEducation.coursework.join('\n')}
                    onChange={(e) => setEditingEducation({ ...editingEducation, coursework: e.target.value.split('\n').filter(Boolean) })}
                    className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white font-sans text-xs"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-gray-400">Description</label>
                  <textarea
                    rows={3}
                    value={editingEducation.description}
                    onChange={(e) => setEditingEducation({ ...editingEducation, description: e.target.value })}
                    className="w-full p-2 rounded bg-[#141518] border border-[#2e3038] text-white font-sans text-xs"
                  />
                </div>
              </div>
            </div>
            <div className="p-4 bg-[#1a1b20] border-t border-[#282a32] flex items-center justify-end gap-2">
              <button onClick={() => setEditingEducation(null)} className="px-4 py-2 rounded bg-[#25272e] text-gray-300">Cancel</button>
              <button onClick={async () => {
                await fetch('/api/education', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(editingEducation),
                });
                onDataChange?.();
                setEditingEducation(null);
                showToast('Education saved.');
                if (onDataChange) onDataChange();
              }} disabled={!editingEducation.degree || !editingEducation.institution} className="px-4 py-2 rounded bg-[#007acc] hover:bg-[#006bb3] text-white font-bold flex items-center gap-1.5">
                <Save className="w-4 h-4" />
                <span>Save Education</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
