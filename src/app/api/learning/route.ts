import { NextResponse } from 'next/server';
import { DataStore } from '@/lib/storage';
import { LearningTopic } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    let topics = DataStore.getLearningTopics();

    if (category) {
      topics = topics.filter(t => t.category === category);
    }
    return NextResponse.json(topics);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch learning topics' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.category) {
      return NextResponse.json({ error: 'Title and Category are required' }, { status: 400 });
    }

    const topic: LearningTopic = {
      id: body.id || `learn-${Date.now()}`,
      title: body.title,
      category: body.category,
      status: body.status || 'Currently Learning',
      notes: body.notes || '',
      subtopics: Array.isArray(body.subtopics) ? body.subtopics : [],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    const saved = DataStore.saveLearningTopic(topic);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save learning topic' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    DataStore.deleteLearningTopic(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete topic' }, { status: 500 });
  }
}
