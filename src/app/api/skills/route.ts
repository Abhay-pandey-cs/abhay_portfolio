import { NextResponse } from 'next/server';
import { DataStore } from '@/lib/storage';
import { Skill } from '@/types';

export async function GET() {
  try {
    const skills = DataStore.getSkills();
    return NextResponse.json(skills);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.group) {
      return NextResponse.json({ error: 'Name and Group are required' }, { status: 400 });
    }

    const skill: Skill = {
      id: body.id || `skill-${Date.now()}`,
      name: body.name,
      group: body.group,
      status: body.status || 'Currently Learning',
      highlight: Boolean(body.highlight)
    };

    const saved = DataStore.saveSkill(skill);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save skill' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    DataStore.deleteSkill(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
  }
}
