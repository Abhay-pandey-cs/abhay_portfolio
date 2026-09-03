import { NextResponse } from 'next/server';
import { DataStore } from '@/lib/storage';
import { Note } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');

    let notes = DataStore.getNotes();

    if (slug) {
      const note = notes.find(n => n.slug === slug || n.id === slug);
      if (!note) return NextResponse.json({ error: 'Note not found' }, { status: 404 });
      return NextResponse.json(note);
    }

    if (category) {
      notes = notes.filter(n => n.category === category);
    }

    return NextResponse.json(notes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.category) {
      return NextResponse.json({ error: 'Title and Category are required' }, { status: 400 });
    }

    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const note: Note = {
      id: body.id || `note-${Date.now()}`,
      title: body.title,
      slug,
      date: body.date || new Date().toISOString().split('T')[0],
      category: body.category,
      tags: Array.isArray(body.tags) ? body.tags : [],
      summary: body.summary || '',
      content: body.content || '',
      readTime: body.readTime || '3 min read',
      published: body.published !== undefined ? Boolean(body.published) : true,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    const saved = DataStore.saveNote(note);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save note' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    DataStore.deleteNote(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
}
