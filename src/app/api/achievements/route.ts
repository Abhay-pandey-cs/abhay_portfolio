import { NextResponse } from 'next/server';
import { DataStore } from '@/lib/storage';
import { Achievement } from '@/types';

export async function GET() {
  try {
    const achievements = DataStore.getAchievements();
    return NextResponse.json(achievements);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.organization) {
      return NextResponse.json({ error: 'Title and Organization are required' }, { status: 400 });
    }

    const ach: Achievement = {
      id: body.id || `ach-${Date.now()}`,
      title: body.title,
      organization: body.organization,
      date: body.date || '',
      rankOrHonor: body.rankOrHonor || '',
      description: body.description || '',
      proofUrl: body.proofUrl || undefined
    };

    const saved = DataStore.saveAchievement(ach);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save achievement' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    DataStore.deleteAchievement(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete achievement' }, { status: 500 });
  }
}
