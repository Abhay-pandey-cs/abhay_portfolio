import { NextResponse } from 'next/server';
import { buildKnowledgeBase, retrieveRelevantData, retrieveExtendedRelevantData } from '@/lib/knowledgeBase';
import { DataStore } from '@/lib/storage';
import { SiteSettings, Project, Note, Experience, LearningTopic, Achievement, Certification, EducationItem, Skill } from '@/types';

export async function POST(request: Request) {
  try {
    const { message, stats, projectContext } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'No message provided' }, { status: 400 });
    }

    const settings: SiteSettings = projectContext?.settings || DataStore.getSettings();
    const projects: Project[] = projectContext?.projects || DataStore.getProjects();
    const notes: Note[] = projectContext?.notes || DataStore.getNotes();
    const experience: Experience[] = projectContext?.experience || DataStore.getExperience();
    const learning: LearningTopic[] = projectContext?.learning || DataStore.getLearningTopics();
    const achievements: Achievement[] = projectContext?.achievements || DataStore.getAchievements();
    const certifications: Certification[] = projectContext?.certifications || DataStore.getCertifications();
    const education: EducationItem[] = projectContext?.education || DataStore.getEducation();
    const skills: Skill[] = projectContext?.skills || DataStore.getSkills();

    const knowledgeBase = buildKnowledgeBase({
      settings,
      projects,
      notes,
      experience,
      learning,
      achievements,
      certifications,
      education,
      skills,
      stats
    });

    const extended = retrieveExtendedRelevantData(knowledgeBase, message);
    const targeted = retrieveRelevantData(knowledgeBase, message);
    const full = extended || targeted;

    const isSpecific = full !== retrieveRelevantData(knowledgeBase, '__full_fallback__') && full.trim().length > 0;

    if (isSpecific) {
      return NextResponse.json({
        response: full,
        source: 'knowledge_base',
        dataVersion: knowledgeBase.dataVersion,
        lastUpdated: knowledgeBase.lastUpdated
      });
    }

    return NextResponse.json({
      response: `I don't have that information in the current portfolio data. Try asking about projects, skills, education, experience, certifications, achievements, or coding profiles.`,
      source: 'knowledge_base',
      dataVersion: knowledgeBase.dataVersion,
      lastUpdated: knowledgeBase.lastUpdated
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
