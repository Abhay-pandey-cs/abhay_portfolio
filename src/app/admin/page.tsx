'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { DataStore } from '@/lib/storage';
import { 
  Project, 
  LearningTopic, 
  Note, 
  Skill, 
  SiteSettings,
  Certification,
  Achievement,
  Experience,
  CommunityProject,
  EducationItem
} from '@/types';

export default function AdminPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [learning, setLearning] = useState<LearningTopic[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [community, setCommunity] = useState<CommunityProject[]>([]);
  const [education, setEducation] = useState<EducationItem[]>([]);

  const loadData = async () => {
    try {
      const [projects, learning, notes, skills, settings, certifications, achievements, experience, community, education] = await Promise.all([
        fetch('/api/projects').then(r => r.json()),
        fetch('/api/learning').then(r => r.json()),
        fetch('/api/notes').then(r => r.json()),
        fetch('/api/skills').then(r => r.json()),
        fetch('/api/settings').then(r => r.json()),
        fetch('/api/certifications').then(r => r.json()),
        fetch('/api/achievements').then(r => r.json()),
        fetch('/api/experience').then(r => r.json()),
        fetch('/api/community').then(r => r.json()),
        fetch('/api/education').then(r => r.json()),
      ]);
      setProjects(Array.isArray(projects) ? projects : []);
      setLearning(Array.isArray(learning) ? learning : []);
      setNotes(Array.isArray(notes) ? notes : []);
      setSkills(Array.isArray(skills) ? skills : []);
      setSettings(settings || null);
      setCertifications(Array.isArray(certifications) ? certifications : []);
      setAchievements(Array.isArray(achievements) ? achievements : []);
      setExperience(Array.isArray(experience) ? experience : []);
      setCommunity(Array.isArray(community) ? community : []);
      setEducation(Array.isArray(education) ? education : []);
    } catch (e) {
      console.error('Failed to load data from API', e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!settings) return null;

  return (
    <AdminPanel
      initialProjects={projects}
      initialLearning={learning}
      initialNotes={notes}
      initialSkills={skills}
      initialSettings={settings}
      initialCertifications={certifications}
      initialAchievements={achievements}
      initialExperience={experience}
      initialCommunity={community}
      initialEducation={education}
      onClose={() => router.push('/')}
      onDataChange={loadData}
    />
  );
}
