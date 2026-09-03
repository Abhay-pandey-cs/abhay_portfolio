import { NextResponse } from 'next/server';
import { DataStore, getServerStore } from '@/lib/storage';

export async function GET() {
  try {
    const store = getServerStore();
    return NextResponse.json({
      exportDate: new Date().toISOString(),
      version: '2.0',
      data: store
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to export backup' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.action === 'reset') {
      DataStore.resetAll();
      return NextResponse.json({ success: true, message: 'Reset to default data complete' });
    }

    if (body.action === 'import' && body.data) {
      const { projects, learning, notes, skills, settings, community, education } = body.data;
      const store = getServerStore();
      if (Array.isArray(projects)) store.projects = projects;
      if (Array.isArray(learning)) store.learning = learning;
      if (Array.isArray(notes)) store.notes = notes;
      if (Array.isArray(skills)) store.skills = skills;
      if (settings) store.settings = settings;
      if (community) store.community = Array.isArray(community) ? community : [community];
      if (education) store.education = education;
      return NextResponse.json({ success: true, message: 'Data imported successfully' });
    }

    return NextResponse.json({ error: 'Invalid backup action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Backup operation failed' }, { status: 500 });
  }
}
