import { 
  Project, 
  LearningTopic, 
  Note, 
  Skill, 
  CommunityProject, 
  SiteSettings,
  Certification,
  Achievement,
  Experience,
  EducationItem
} from '@/types';

export const initialSiteSettings: SiteSettings = {
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
};

export const initialProjects: Project[] = [];
export const initialCertifications: Certification[] = [];
export const initialAchievements: Achievement[] = [];
export const initialExperience: Experience[] = [];
export const initialEducation: EducationItem[] = [];
export const initialLearningTopics: LearningTopic[] = [];
export const initialNotes: Note[] = [];
export const initialSkills: Skill[] = [];
export const initialCommunityProjects: CommunityProject[] = [];
