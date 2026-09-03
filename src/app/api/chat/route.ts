import { NextResponse } from 'next/server';
import { buildKnowledgeBase, retrieveRelevantData, retrieveExtendedRelevantData } from '@/lib/knowledgeBase';
import { getDatabase } from '@/lib/mongodb';
import { SiteSettings, Project, Note, Experience, LearningTopic, Achievement, Certification, EducationItem, Skill } from '@/types';

export async function POST(request: Request) {
  try {
    const { message, stats, projectContext } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'No message provided' }, { status: 400 });
    }

    let settings: SiteSettings = projectContext?.settings || {
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
    let projects: Project[] = projectContext?.projects || [];
    let notes: Note[] = projectContext?.notes || [];
    let experience: Experience[] = projectContext?.experience || [];
    let learning: LearningTopic[] = projectContext?.learning || [];
    let achievements: Achievement[] = projectContext?.achievements || [];
    let certifications: Certification[] = projectContext?.certifications || [];
    let education: EducationItem[] = projectContext?.education || [];
    let skills: Skill[] = projectContext?.skills || [];

    const db = await getDatabase();
    if (db) {
      if (!projectContext?.settings) {
        const settingsDoc = await db.collection('settings').findOne({ _id: 'site_settings' } as any);
        if (settingsDoc) {
          const { _id, ...rest } = settingsDoc as any;
          settings = { ...settings, ...rest } as SiteSettings;
        }
      }
      if (!projectContext?.projects) projects = (await db.collection('projects').find({}).toArray()) as unknown as Project[];
      if (!projectContext?.notes) notes = (await db.collection('notes').find({}).toArray()) as unknown as Note[];
      if (!projectContext?.experience) experience = (await db.collection('experience').find({}).toArray()) as unknown as Experience[];
      if (!projectContext?.learning) learning = (await db.collection('learning').find({}).toArray()) as unknown as LearningTopic[];
      if (!projectContext?.achievements) achievements = (await db.collection('achievements').find({}).toArray()) as unknown as Achievement[];
      if (!projectContext?.certifications) certifications = (await db.collection('certifications').find({}).toArray()) as unknown as Certification[];
      if (!projectContext?.education) education = (await db.collection('education').find({}).toArray()) as unknown as EducationItem[];
      if (!projectContext?.skills) skills = (await db.collection('skills').find({}).toArray()) as unknown as Skill[];
    }

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
