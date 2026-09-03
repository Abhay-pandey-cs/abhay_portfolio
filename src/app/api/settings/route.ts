import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDatabase();
    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }
    const settings = await db.collection('settings').findOne({ _id: 'site_settings' } as any);
    return NextResponse.json(settings || {});
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await getDatabase();
    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const existing = await db.collection('settings').findOne({ _id: 'site_settings' } as any);
    const cleanedBody = Object.fromEntries(
      Object.entries(body).filter(([, value]) => value !== undefined && value !== null && value !== '')
    );
    const updated = { ...(existing || {}), ...cleanedBody, _id: 'site_settings' };
    await db.collection('settings').replaceOne({ _id: 'site_settings' } as any, updated as any, { upsert: true });
    
    await db.collection('settings').deleteMany({ _id: { $ne: 'site_settings' } } as any);
    
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const db = await getDatabase();
    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }
    await db.collection('settings').deleteOne({ _id: 'site_settings' } as any);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete settings' }, { status: 500 });
  }
}
