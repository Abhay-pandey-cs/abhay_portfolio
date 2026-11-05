import {
  Activity,
  Award,
  BookOpen,
  Briefcase,
  Cpu,
  FileCode,
  FileText,
  Heart,
  Mail,
  Trophy,
  type LucideIcon,
} from 'lucide-react';

export interface WorkspaceTab {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
}

export const workspaceTabs: WorkspaceTab[] = [
  { id: 'overview', title: 'hero-about.tsx', icon: FileCode, color: '#38bdf8' },
  { id: 'projects', title: 'projects-showcase.tsx', icon: FileCode, color: '#007acc' },
  { id: 'experience', title: 'experience.tsx', icon: Briefcase, color: '#38bdf8' },
  { id: 'learning', title: 'learning-roadmap.json', icon: BookOpen, color: '#23a55a' },
  { id: 'systems', title: 'systems-deepdive.c', icon: Cpu, color: '#f0b232' },
  { id: 'coding', title: 'coding-profiles.ts', icon: Activity, color: '#007acc' },
  { id: 'notes', title: 'technical-notes.md', icon: FileText, color: '#c084fc' },
  { id: 'certifications', title: 'certifications.json', icon: Award, color: '#f0b232' },
  { id: 'achievements', title: 'achievements.md', icon: Trophy, color: '#23a55a' },
  { id: 'community', title: 'community-impact.md', icon: Heart, color: '#f43f5e' },
  { id: 'contact', title: 'contact-socials.env', icon: Mail, color: '#25d366' },
];
