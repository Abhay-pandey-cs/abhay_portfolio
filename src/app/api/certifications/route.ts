import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Certification } from '@/types';

export async function GET() {
  try {
    const db = await getDatabase();
    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }
    const certifications = await db.collection('certifications').find({}).toArray();
    return NextResponse.json(certifications);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch certifications' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.issuer) {
      return NextResponse.json({ error: 'Title and Issuer are required' }, { status: 400 });
    }

    const cert: Certification = {
      id: body.id || `cert-${Date.now()}`,
      title: body.title,
      issuer: body.issuer,
      date: body.date || '',
      credentialUrl: body.credentialUrl || undefined,
      skills: Array.isArray(body.skills) ? body.skills : (body.skills ? String(body.skills).split(',').map((s: string) => s.trim()).filter(Boolean) : []),
      description: body.description || '',
      badgeImage: body.badgeImage || undefined
    };

    const db = await getDatabase();
    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    await db.collection('certifications').insertOne(cert as any);
    return NextResponse.json(cert, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save certification' }, { status: 500 });
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

    await db.collection('certifications').deleteOne({ id });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete certification' }, { status: 500 });
  }
}
