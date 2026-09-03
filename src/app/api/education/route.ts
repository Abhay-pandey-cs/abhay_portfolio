import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { EducationItem } from '@/types';

export async function GET() {
  try {
    const db = await getDatabase();
    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }
    const education = await db.collection('education').find({}).toArray();
    return NextResponse.json(education);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch education' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.degree || !body.institution) {
      return NextResponse.json({ error: 'Degree and Institution are required' }, { status: 400 });
    }

    const education: EducationItem = {
      id: body.id || `edu-${Date.now()}`,
      degree: body.degree,
      institution: body.institution,
      year: body.year || '',
      cgpa: body.cgpa || '',
      location: body.location || '',
      coursework: Array.isArray(body.coursework) ? body.coursework : (body.coursework ? String(body.coursework).split('\n').filter(Boolean) : []),
      description: body.description || ''
    };

    const db = await getDatabase();
    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    await db.collection('education').insertOne(education as any);
    return NextResponse.json(education, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save education' }, { status: 500 });
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

    await db.collection('education').deleteOne({ id });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete education' }, { status: 500 });
  }
}
