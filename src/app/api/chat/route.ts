import { NextResponse } from 'next/server';
import { buildKnowledgeBase, retrieveRelevantData } from '@/lib/knowledgeBase';
import { DataStore } from '@/lib/storage';

export async function POST(request: Request) {
  try {
    const { message, stats } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'No message provided' }, { status: 400 });
    }

    // Build knowledge base from current portfolio data
    const knowledgeBase = buildKnowledgeBase({
      settings: DataStore.getSettings(),
      projects: DataStore.getProjects(),
      notes: DataStore.getNotes(),
      experience: DataStore.getExperience(),
      learning: DataStore.getLearningTopics(),
      achievements: DataStore.getAchievements(),
      certifications: DataStore.getCertifications(),
      education: DataStore.getEducation(),
      skills: DataStore.getSkills(),
      stats
    });

    // Retrieve relevant data based on the user's question
    const relevantData = retrieveRelevantData(knowledgeBase, message);

    // Check if we got specific relevant data (not the full knowledge base)
    const { serializeKnowledgeBase } = await import('@/lib/knowledgeBase');
    const isSpecificData = relevantData !== serializeKnowledgeBase(knowledgeBase);

    if (isSpecificData) {
      return NextResponse.json({
        response: relevantData,
        source: 'knowledge_base',
        dataVersion: knowledgeBase.dataVersion,
        lastUpdated: knowledgeBase.lastUpdated
      });
    }

    // Return null response to trigger client-side fallback
    return NextResponse.json({
      response: null,
      source: 'fallback',
      dataVersion: knowledgeBase.dataVersion
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
