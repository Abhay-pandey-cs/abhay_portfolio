export type ProjectCategory = 'Backend' | 'IoT / Systems' | 'Full Stack' | 'Low Level' | 'Open Source' | 'Mobile';
export type ProjectStatus = 'Active' | 'Completed' | 'In Progress' | 'Prototype' | 'Exploring';

export interface ArchitectureNode {
  id: string;
  label: string;
  role: string;
  description: string;
  tech?: string;
  icon?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  shortDescription: string;
  fullDescription: string;
  category: ProjectCategory;
  status: ProjectStatus;
  featured: boolean;
  published: boolean;
  displayOrder: number;
  startDate?: string;
  completionDate?: string;
  githubUrl?: string;
  liveDemoUrl?: string;
  thumbnail?: string;
  gallery?: string[];
  technologies: string[];
  
  // Case Study & Detailed "What, When, How"
  whatWasBuilt: string;
  howItWorks: string;
  problem: string;
  solution: string;
  approach?: string;
  features: string[];
  architectureDescription?: string;
  architectureNodes?: ArchitectureNode[];
  challenges: string[];
  whatILearned: string[];
  futureImprovements: string[];
  updatedAt: string;
}

export type LearningStatus = 'Yet to Start' | 'Learning' | 'Finished';
export type LearningCategory = 'Backend' | 'DSA' | 'Computer Science' | 'Systems' | 'Web & Tools' | 'Cloud & DevOps';

export interface LearningTopic {
  id: string;
  title: string;
  category: LearningCategory;
  status: LearningStatus;
  notes?: string;
  subtopics?: string[];
  priority?: number;
  updatedAt?: string;
}

export type NoteCategory = 'Java' | 'Backend' | 'DSA' | 'Linux' | 'OS' | 'Systems' | 'Databases' | 'Projects' | 'CS Fundamentals';

export interface Note {
  id: string;
  title: string;
  slug: string;
  date: string;
  category: NoteCategory;
  tags: string[];
  summary: string;
  content: string; // Markdown
  readTime: string;
  published: boolean;
  updatedAt: string;
}

export type SkillProficiency = 'Used in Projects' | 'Currently Learning' | 'Exploring';
export type SkillGroup = 'Languages' | 'Backend' | 'Database' | 'Frontend' | 'Systems' | 'Tools';

export interface Skill {
  id: string;
  name: string;
  group: SkillGroup;
  status: SkillProficiency;
  icon?: string;
  highlight?: boolean;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  skills: string[];
  description: string;
  badgeImage?: string;
}

export interface Achievement {
  id: string;
  title: string;
  organization: string;
  date: string;
  rankOrHonor: string;
  description: string;
  proofUrl?: string;
}

export interface Experience {
  id: string;
  role: string;
  organization: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  highlights: string[];
  technologies: string[];
  certificateUrl?: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  year: string;
  cgpa: string;
  location: string;
  coursework: string[];
  description: string;
}

export interface CommunityProject {
  id: string;
  title: string;
  organization: string;
  role: string;
  hours: number;
  description: string;
  highlights: string[];
  startDate: string;
  endDate: string;
  photo?: string;
}

export interface SiteSettings {
  name: string;
  role: string;
  subtitle: string;
  bio: string;
  currentStatus: string;
  university: string;
  degree: string;
  year: string;
  cgpa: string;
  cgpaFirstSem: string;
  cgpaSecondSem: string;
  cgpaOverall: string;
  
  // Direct profiles
  email: string;
  github: string;
  linkedin: string;
  leetcode?: string;
  codechef?: string;
  whatsappNumber: string;
  resumeUrl: string;
  githubStatsUsername?: string;
  
  splineSceneUrl: string;
  footerQuote: string;
  profilePhoto: string;
  enablePhotoBooth: boolean;
}

// Stats types for AI Assistant & coding profiles
export interface GitHubStats {
  username: string;
  name: string;
  bio: string;
  avatarUrl: string;
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number;
  totalForks: number;
  totalCommits: number;
  topLanguages: { language: string; count: number }[];
  createdAt: string;
  updatedAt: string;
}

export interface LeetCodeStats {
  username: string;
  realName: string;
  ranking: number;
  avatar: string;
  totalSolved: number;
  acEasy: number;
  acMedium: number;
  acHard: number;
  totalSubmitted: number;
  contestRating: number;
  globalRanking: number;
  totalRanking: number;
  contestNum: number;
  updatedAt: string;
}

export interface CodeChefStats {
  username: string;
  fullName: string;
  rating: number;
  globalRank: number;
  countryRank: number;
  stars: string;
  highestRating: number;
  problemsSolved: number;
  problemsByDifficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
  contests: any[];
  updatedAt: string;
}

export interface CodingStats {
  github: GitHubStats | { error: string; username: string };
  leetcode: LeetCodeStats | { error: string; username: string };
  codechef: CodeChefStats | { error: string; username: string };
  fetchedAt: string;
}
