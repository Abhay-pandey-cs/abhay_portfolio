import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDatabase();
    if (!db) {
      return NextResponse.json({ connected: false, error: 'Database not configured' });
    }
    const collections = await db.listCollections().toArray();
    return NextResponse.json({ 
      connected: true, 
      database: db.databaseName,
      collections: collections.map(c => c.name)
    });
  } catch (e) {
    return NextResponse.json({ connected: false, error: String(e) });
  }
}
