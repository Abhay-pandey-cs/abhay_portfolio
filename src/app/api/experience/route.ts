import { NextResponse } from 'next/server';
import { DataStore } from '@/lib/storage';
import { Experience } from '@/types';

export async function GET() {
  try {
    const experience = DataStore.getExperience();
    return NextResponse.json(experience);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch experience' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.role || !body.organization) {
      return NextResponse.json({ error: 'Role and Organization are required' }, { status: 400 });
    }

    const exp: Experience = {
      id: body.id || `exp-${Date.now()}`,
      role: body.role,
      organization: body.organization,
      location: body.location || undefined,
      startDate: body.startDate || '',
      endDate: body.endDate || '',
      current: Boolean(body.current),
      description: body.description || '',
      highlights: Array.isArray(body.highlights) ? body.highlights : (body.highlights ? String(body.highlights).split('\n').filter(Boolean) : []),
      technologies: Array.isArray(body.technologies) ? body.technologies : (body.technologies ? String(body.technologies).split(',').map((t: string) => t.trim()).filter(Boolean) : []),
      certificateUrl: body.certificateUrl || undefined
    };

    const saved = DataStore.saveExperience(exp);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save experience' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    DataStore.deleteExperience(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
  }
}
