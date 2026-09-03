import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { CommunityProject } from '@/types';

export async function GET() {
  try {
    const db = await getDatabase();
    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }
    const community = await db.collection('community').find({}).toArray();
    return NextResponse.json(community);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch community projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.organization) {
      return NextResponse.json({ error: 'Title and Organization are required' }, { status: 400 });
    }

    const project: CommunityProject = {
      id: body.id || `comm-${Date.now()}`,
      title: body.title,
      organization: body.organization,
      role: body.role || '',
      hours: body.hours || 0,
      description: body.description || '',
      highlights: Array.isArray(body.highlights) ? body.highlights : (body.highlights ? String(body.highlights).split('\n').filter(Boolean) : []),
      startDate: body.startDate || '',
      endDate: body.endDate || '',
      photo: body.photo || ''
    };

    const db = await getDatabase();
    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    await db.collection('community').insertOne(project as any);
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save community project' }, { status: 500 });
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

    await db.collection('community').deleteOne({ id });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete community project' }, { status: 500 });
  }
}
