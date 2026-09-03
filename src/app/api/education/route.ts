import { NextResponse } from 'next/server';
import { DataStore } from '@/lib/storage';
import { EducationItem } from '@/types';

export async function GET() {
  try {
    const education = DataStore.getEducation();
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

    const saved = DataStore.saveEducation(education);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save education' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    DataStore.deleteEducation(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete education' }, { status: 500 });
  }
}
