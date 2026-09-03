import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Achievement } from '@/types';

export async function GET() {
  try {
    const db = await getDatabase();
    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }
    const achievements = await db.collection('achievements').find({}).toArray();
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

    const db = await getDatabase();
    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    await db.collection('achievements').insertOne(ach as any);
    return NextResponse.json(ach, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save achievement' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const db = await getDatabase();
    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    await db.collection('achievements').deleteOne({ id });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete achievement' }, { status: 500 });
  }
}
