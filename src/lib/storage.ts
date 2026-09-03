import { 
  Project, 
  LearningTopic, 
  Note, 
  Skill, 
  SiteSettings, 
  CommunityProject,
  Certification,
  Achievement,
  Experience,
  EducationItem
} from '@/types';
import { 
  initialProjects, 
  initialLearningTopics, 
  initialNotes, 
  initialSkills, 
  initialSiteSettings, 
  initialCommunityProjects,
  initialCertifications,
  initialAchievements,
  initialExperience,
  initialEducation
} from './initialData';

const STORAGE_KEYS = {
  PROJECTS: 'abhay_portfolio_projects_v3',
  LEARNING: 'abhay_portfolio_learning_v3',
  NOTES: 'abhay_portfolio_notes_v3',
  SKILLS: 'abhay_portfolio_skills_v3',
  SETTINGS: 'abhay_portfolio_settings_v3',
  COMMUNITY: 'abhay_portfolio_community_v3',
  CERTIFICATIONS: 'abhay_portfolio_certs_v3',
  ACHIEVEMENTS: 'abhay_portfolio_achievements_v3',
  EXPERIENCE: 'abhay_portfolio_experience_v3',
  EDUCATION: 'abhay_portfolio_education_v3'
};

// Check if a storage key has been initialized (even if empty)
// This distinguishes "never set" from "set but emptied"
function isInitialized(key: string): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(`${key}_initialized`) === 'true';
}

function markInitialized(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${key}_initialized`, 'true');
  } catch (err) {
    console.error(`Error marking ${key} as initialized`, err);
  }
}

function getClientItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const data = localStorage.getItem(key);
    if (!data) return fallback;
    return JSON.parse(data) as T;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage`, err);
    return fallback;
  }
}

function setClientItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage`, err);
  }
}

interface GlobalStore {
  projects: Project[];
  learning: LearningTopic[];
  notes: Note[];
  skills: Skill[];
  settings: SiteSettings;
  community: CommunityProject[];
  certifications: Certification[];
  achievements: Achievement[];
  experience: Experience[];
  education: EducationItem[];
}

const globalForStore = globalThis as unknown as { portfolioStore?: GlobalStore };

export function getServerStore(): GlobalStore {
  if (!globalForStore.portfolioStore) {
    globalForStore.portfolioStore = {
      projects: [...initialProjects],
      learning: [...initialLearningTopics],
      notes: [...initialNotes],
      skills: [...initialSkills],
      settings: { ...initialSiteSettings },
      community: [...initialCommunityProjects],
      certifications: [...initialCertifications],
      achievements: [...initialAchievements],
      experience: [...initialExperience],
      education: [...initialEducation]
    };
  }
  return globalForStore.portfolioStore;
}

export const DataStore = {
  // Projects
  getProjects(): Project[] {
    if (typeof window !== 'undefined') {
      const stored = getClientItem<Project[]>(STORAGE_KEYS.PROJECTS, []);
      if (stored && stored.length > 0) {
        return stored.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      }
      if (!isInitialized(STORAGE_KEYS.PROJECTS)) {
        setClientItem(STORAGE_KEYS.PROJECTS, initialProjects);
        markInitialized(STORAGE_KEYS.PROJECTS);
        return initialProjects;
      }
      // Initialized but empty — return empty, don't re-seed
      return stored;
    }
    return getServerStore().projects.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  },

  getProjectBySlug(slug: string): Project | undefined {
    const projects = this.getProjects();
    return projects.find(p => p.slug === slug || p.id === slug);
  },

  saveProject(project: Project): Project {
    const projects = this.getProjects();
    const index = projects.findIndex(p => p.id === project.id);
    let updated: Project[];
    
    if (index >= 0) {
      updated = [...projects];
      updated[index] = { ...project, updatedAt: new Date().toISOString().split('T')[0] };
    } else {
      const newOrder = projects.length > 0 ? Math.max(...projects.map(p => p.displayOrder || 0)) + 1 : 1;
      updated = [...projects, { ...project, displayOrder: project.displayOrder || newOrder, updatedAt: new Date().toISOString().split('T')[0] }];
    }

    if (typeof window !== 'undefined') {
      setClientItem(STORAGE_KEYS.PROJECTS, updated);
    } else {
      getServerStore().projects = updated;
    }
    return project;
  },

  deleteProject(id: string): boolean {
    const projects = this.getProjects();
    const updated = projects.filter(p => p.id !== id);
    if (typeof window !== 'undefined') {
      setClientItem(STORAGE_KEYS.PROJECTS, updated);
    } else {
      getServerStore().projects = updated;
    }
    return true;
  },

  reorderProjects(projectIds: string[]): Project[] {
    const projects = this.getProjects();
    const projectMap = new Map(projects.map(p => [p.id, p]));
    const reordered: Project[] = [];

    projectIds.forEach((id, index) => {
      const p = projectMap.get(id);
      if (p) {
        reordered.push({ ...p, displayOrder: index + 1 });
        projectMap.delete(id);
      }
    });

    projectMap.forEach(p => {
      reordered.push({ ...p, displayOrder: reordered.length + 1 });
    });

    if (typeof window !== 'undefined') {
      setClientItem(STORAGE_KEYS.PROJECTS, reordered);
    } else {
      getServerStore().projects = reordered;
    }
    return reordered;
  },

  // Learning Topics
  getLearningTopics(): LearningTopic[] {
    if (typeof window !== 'undefined') {
      const stored = getClientItem<LearningTopic[]>(STORAGE_KEYS.LEARNING, []);
      if (stored && stored.length > 0) return stored;
      if (!isInitialized(STORAGE_KEYS.LEARNING)) {
        setClientItem(STORAGE_KEYS.LEARNING, initialLearningTopics);
        markInitialized(STORAGE_KEYS.LEARNING);
        return initialLearningTopics;
      }
      return stored;
    }
    return getServerStore().learning;
  },

  saveLearningTopic(topic: LearningTopic): LearningTopic {
    const topics = this.getLearningTopics();
    const index = topics.findIndex(t => t.id === topic.id);
    let updated: LearningTopic[];

    if (index >= 0) {
      updated = [...topics];
      updated[index] = { ...topic, updatedAt: new Date().toISOString().split('T')[0] };
    } else {
      updated = [...topics, { ...topic, updatedAt: new Date().toISOString().split('T')[0] }];
    }

    if (typeof window !== 'undefined') {
      setClientItem(STORAGE_KEYS.LEARNING, updated);
    } else {
      getServerStore().learning = updated;
    }
    return topic;
  },

  deleteLearningTopic(id: string): boolean {
    const topics = this.getLearningTopics();
    const updated = topics.filter(t => t.id !== id);
    if (typeof window !== 'undefined') {
      setClientItem(STORAGE_KEYS.LEARNING, updated);
    } else {
      getServerStore().learning = updated;
    }
    return true;
  },

  // Notes
  getNotes(): Note[] {
    if (typeof window !== 'undefined') {
      const stored = getClientItem<Note[]>(STORAGE_KEYS.NOTES, []);
      if (stored && stored.length > 0) return stored;
      if (!isInitialized(STORAGE_KEYS.NOTES)) {
        setClientItem(STORAGE_KEYS.NOTES, initialNotes);
        markInitialized(STORAGE_KEYS.NOTES);
        return initialNotes;
      }
      return stored;
    }
    return getServerStore().notes;
  },

  saveNote(note: Note): Note {
    const notes = this.getNotes();
    const index = notes.findIndex(n => n.id === note.id);
    let updated: Note[];

    if (index >= 0) {
      updated = [...notes];
      updated[index] = { ...note, updatedAt: new Date().toISOString().split('T')[0] };
    } else {
      updated = [...notes, { ...note, updatedAt: new Date().toISOString().split('T')[0] }];
    }

    if (typeof window !== 'undefined') {
      setClientItem(STORAGE_KEYS.NOTES, updated);
    } else {
      getServerStore().notes = updated;
    }
    return note;
  },

  deleteNote(id: string): boolean {
    const notes = this.getNotes();
    const updated = notes.filter(n => n.id !== id);
    if (typeof window !== 'undefined') {
      setClientItem(STORAGE_KEYS.NOTES, updated);
    } else {
      getServerStore().notes = updated;
    }
    return true;
  },

  // Skills
  getSkills(): Skill[] {
    if (typeof window !== 'undefined') {
      const stored = getClientItem<Skill[]>(STORAGE_KEYS.SKILLS, []);
      if (stored && stored.length > 0) return stored;
      if (!isInitialized(STORAGE_KEYS.SKILLS)) {
        setClientItem(STORAGE_KEYS.SKILLS, initialSkills);
        markInitialized(STORAGE_KEYS.SKILLS);
        return initialSkills;
      }
      return stored;
    }
    return getServerStore().skills;
  },

  saveSkill(skill: Skill): Skill {
    const skills = this.getSkills();
    const index = skills.findIndex(s => s.id === skill.id);
    let updated: Skill[];

    if (index >= 0) {
      updated = [...skills];
      updated[index] = skill;
    } else {
      updated = [...skills, skill];
    }

    if (typeof window !== 'undefined') {
      setClientItem(STORAGE_KEYS.SKILLS, updated);
    } else {
      getServerStore().skills = updated;
    }
    return skill;
  },

  deleteSkill(id: string): boolean {
    const skills = this.getSkills();
    const updated = skills.filter(s => s.id !== id);
    if (typeof window !== 'undefined') {
      setClientItem(STORAGE_KEYS.SKILLS, updated);
    } else {
      getServerStore().skills = updated;
    }
    return true;
  },

  // Certifications
  getCertifications(): Certification[] {
    if (typeof window !== 'undefined') {
      const stored = getClientItem<Certification[]>(STORAGE_KEYS.CERTIFICATIONS, []);
      if (stored && stored.length > 0) return stored;
      if (!isInitialized(STORAGE_KEYS.CERTIFICATIONS)) {
        setClientItem(STORAGE_KEYS.CERTIFICATIONS, initialCertifications);
        markInitialized(STORAGE_KEYS.CERTIFICATIONS);
        return initialCertifications;
      }
      return stored;
    }
    return getServerStore().certifications;
  },

  saveCertification(cert: Certification): Certification {
    const certs = this.getCertifications();
    const index = certs.findIndex(c => c.id === cert.id);
    let updated: Certification[];

    if (index >= 0) {
      updated = [...certs];
      updated[index] = cert;
    } else {
      updated = [...certs, cert];
    }

    if (typeof window !== 'undefined') {
      setClientItem(STORAGE_KEYS.CERTIFICATIONS, updated);
    } else {
      getServerStore().certifications = updated;
    }
    return cert;
  },

  deleteCertification(id: string): boolean {
    const certs = this.getCertifications();
    const updated = certs.filter(c => c.id !== id);
    if (typeof window !== 'undefined') {
      setClientItem(STORAGE_KEYS.CERTIFICATIONS, updated);
    } else {
      getServerStore().certifications = updated;
    }
    return true;
  },

  // Achievements
  getAchievements(): Achievement[] {
    if (typeof window !== 'undefined') {
      const stored = getClientItem<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS, []);
      if (stored && stored.length > 0) return stored;
      if (!isInitialized(STORAGE_KEYS.ACHIEVEMENTS)) {
        setClientItem(STORAGE_KEYS.ACHIEVEMENTS, initialAchievements);
        markInitialized(STORAGE_KEYS.ACHIEVEMENTS);
        return initialAchievements;
      }
      return stored;
    }
    return getServerStore().achievements;
  },

  saveAchievement(ach: Achievement): Achievement {
    const achs = this.getAchievements();
    const index = achs.findIndex(a => a.id === ach.id);
    let updated: Achievement[];

    if (index >= 0) {
      updated = [...achs];
      updated[index] = ach;
    } else {
      updated = [...achs, ach];
    }

    if (typeof window !== 'undefined') {
      setClientItem(STORAGE_KEYS.ACHIEVEMENTS, updated);
    } else {
      getServerStore().achievements = updated;
    }
    return ach;
  },

  deleteAchievement(id: string): boolean {
    const achs = this.getAchievements();
    const updated = achs.filter(a => a.id !== id);
    if (typeof window !== 'undefined') {
      setClientItem(STORAGE_KEYS.ACHIEVEMENTS, updated);
    } else {
      getServerStore().achievements = updated;
    }
    return true;
  },

  // Community
  getCommunity(): CommunityProject[] {
    if (typeof window !== 'undefined') {
      const stored = getClientItem<CommunityProject[]>(STORAGE_KEYS.COMMUNITY, []);
      if (stored && stored.length > 0) return stored;
      if (!isInitialized(STORAGE_KEYS.COMMUNITY)) {
        setClientItem(STORAGE_KEYS.COMMUNITY, initialCommunityProjects);
        markInitialized(STORAGE_KEYS.COMMUNITY);
        return initialCommunityProjects;
      }
      return stored;
    }
    return getServerStore().community;
  },

  saveCommunity(community: CommunityProject): CommunityProject {
    const items = this.getCommunity();
    const index = items.findIndex(c => c.id === community.id);
    let updated: CommunityProject[];

    if (index >= 0) {
      updated = [...items];
      updated[index] = community;
    } else {
      updated = [...items, community];
    }

    if (typeof window !== 'undefined') {
      setClientItem(STORAGE_KEYS.COMMUNITY, updated);
    } else {
      getServerStore().community = updated;
    }
    return community;
  },

  deleteCommunity(id: string): boolean {
    const items = this.getCommunity();
    const updated = items.filter(c => c.id !== id);
    if (typeof window !== 'undefined') {
      setClientItem(STORAGE_KEYS.COMMUNITY, updated);
    } else {
      getServerStore().community = updated;
    }
    return true;
  },

  // Experience
  getExperience(): Experience[] {
    if (typeof window !== 'undefined') {
      const stored = getClientItem<Experience[]>(STORAGE_KEYS.EXPERIENCE, []);
      if (stored && stored.length > 0) return stored;
      if (!isInitialized(STORAGE_KEYS.EXPERIENCE)) {
        setClientItem(STORAGE_KEYS.EXPERIENCE, initialExperience);
        markInitialized(STORAGE_KEYS.EXPERIENCE);
        return initialExperience;
      }
      return stored;
    }
    return getServerStore().experience;
  },

  saveExperience(exp: Experience): Experience {
    const exps = this.getExperience();
    const index = exps.findIndex(e => e.id === exp.id);
    let updated: Experience[];

    if (index >= 0) {
      updated = [...exps];
      updated[index] = exp;
    } else {
      updated = [...exps, exp];
    }

    if (typeof window !== 'undefined') {
      setClientItem(STORAGE_KEYS.EXPERIENCE, updated);
    } else {
      getServerStore().experience = updated;
    }
    return exp;
  },

  deleteExperience(id: string): boolean {
    const exps = this.getExperience();
    const updated = exps.filter(e => e.id !== id);
    if (typeof window !== 'undefined') {
      setClientItem(STORAGE_KEYS.EXPERIENCE, updated);
    } else {
      getServerStore().experience = updated;
    }
    return true;
  },

  // Education
  getEducation(): EducationItem[] {
    if (typeof window !== 'undefined') {
      const stored = getClientItem<EducationItem[]>(STORAGE_KEYS.EDUCATION, []);
      if (stored && stored.length > 0) return stored;
      if (!isInitialized(STORAGE_KEYS.EDUCATION)) {
        setClientItem(STORAGE_KEYS.EDUCATION, initialEducation);
        markInitialized(STORAGE_KEYS.EDUCATION);
        return initialEducation;
      }
      return stored;
    }
    return getServerStore().education;
  },

  saveEducation(edu: EducationItem): EducationItem {
    const items = this.getEducation();
    const index = items.findIndex(e => e.id === edu.id);
    let updated: EducationItem[];

    if (index >= 0) {
      updated = [...items];
      updated[index] = edu;
    } else {
      updated = [...items, edu];
    }

    if (typeof window !== 'undefined') {
      setClientItem(STORAGE_KEYS.EDUCATION, updated);
    } else {
      getServerStore().education = updated;
    }
    return edu;
  },

  deleteEducation(id: string): boolean {
    const items = this.getEducation();
    const updated = items.filter(e => e.id !== id);
    if (typeof window !== 'undefined') {
      setClientItem(STORAGE_KEYS.EDUCATION, updated);
    } else {
      getServerStore().education = updated;
    }
    return true;
  },

  // Settings
  getSettings(): SiteSettings {
    if (typeof window !== 'undefined') {
      const stored = getClientItem<SiteSettings>(STORAGE_KEYS.SETTINGS, initialSiteSettings);
      return { ...initialSiteSettings, ...(stored || {}) };
    }
    return getServerStore().settings;
  },

  updateSettings(settings: Partial<SiteSettings>): SiteSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    if (typeof window !== 'undefined') {
      setClientItem(STORAGE_KEYS.SETTINGS, updated);
    } else {
      getServerStore().settings = updated;
    }
    return updated;
  },

  resetAll(): void {
    if (typeof window !== 'undefined') {
      setClientItem(STORAGE_KEYS.PROJECTS, initialProjects);
      setClientItem(STORAGE_KEYS.LEARNING, initialLearningTopics);
      setClientItem(STORAGE_KEYS.NOTES, initialNotes);
      setClientItem(STORAGE_KEYS.SKILLS, initialSkills);
      setClientItem(STORAGE_KEYS.SETTINGS, initialSiteSettings);
      setClientItem(STORAGE_KEYS.COMMUNITY, initialCommunityProjects);
      setClientItem(STORAGE_KEYS.CERTIFICATIONS, initialCertifications);
      setClientItem(STORAGE_KEYS.ACHIEVEMENTS, initialAchievements);
      setClientItem(STORAGE_KEYS.EXPERIENCE, initialExperience);
      setClientItem(STORAGE_KEYS.EDUCATION, initialEducation);
      // Re-mark all as initialized so future get* calls don't re-seed
      Object.values(STORAGE_KEYS).forEach(key => markInitialized(key));
    } else {
      getServerStore().projects = [...initialProjects];
      getServerStore().learning = [...initialLearningTopics];
      getServerStore().notes = [...initialNotes];
      getServerStore().skills = [...initialSkills];
      getServerStore().settings = { ...initialSiteSettings };
      getServerStore().community = [...initialCommunityProjects];
      getServerStore().certifications = [...initialCertifications];
      getServerStore().achievements = [...initialAchievements];
      getServerStore().experience = [...initialExperience];
      getServerStore().education = [...initialEducation];
    }
  }
};
