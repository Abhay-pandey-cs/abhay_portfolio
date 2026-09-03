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

  const loadData = () => {
    setProjects(DataStore.getProjects());
    setLearning(DataStore.getLearningTopics());
    setNotes(DataStore.getNotes());
    setSkills(DataStore.getSkills());
    setSettings(DataStore.getSettings());
    setCertifications(DataStore.getCertifications());
    setAchievements(DataStore.getAchievements());
    setExperience(DataStore.getExperience());
    setCommunity(DataStore.getCommunity());
    setEducation(DataStore.getEducation());
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
