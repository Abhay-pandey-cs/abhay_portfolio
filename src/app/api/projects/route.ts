import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Project } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const category = searchParams.get('category');
    const featuredOnly = searchParams.get('featured') === 'true';

    const db = await getDatabase();
    if (!db) {
      return NextResponse.json([]);
    }

    let projects = await db.collection('projects').find({}).toArray();

    if (slug) {
      const project = projects.find((p: any) => p.slug === slug || p.id === slug);
      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
      return NextResponse.json(project);
    }

    if (featuredOnly) {
      projects = projects.filter((p: any) => p.featured && p.published);
    }

    if (category) {
      projects = projects.filter((p: any) => p.category === category);
    }

    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.slug) {
      return NextResponse.json({ error: 'Title and Slug are required' }, { status: 400 });
    }

    const newProject: Project = {
      id: body.id || `proj-${Date.now()}`,
      title: body.title,
      slug: body.slug,
      subtitle: body.subtitle || '',
      shortDescription: body.shortDescription || '',
      fullDescription: body.fullDescription || '',
      category: body.category || 'Backend',
      status: body.status || 'In Progress',
      featured: Boolean(body.featured),
      published: body.published !== undefined ? Boolean(body.published) : true,
      displayOrder: body.displayOrder || 99,
      githubUrl: body.githubUrl || '',
      liveDemoUrl: body.liveDemoUrl || '',
      thumbnail: body.thumbnail || '',
      technologies: Array.isArray(body.technologies) ? body.technologies : [],
      problem: body.problem || '',
      solution: body.solution || '',
      approach: body.approach || '',
      whatWasBuilt: body.whatWasBuilt || '',
      howItWorks: body.howItWorks || '',
      features: Array.isArray(body.features) ? body.features : [],
      architectureDescription: body.architectureDescription || '',
      architectureNodes: Array.isArray(body.architectureNodes) ? body.architectureNodes : [],
      challenges: Array.isArray(body.challenges) ? body.challenges : [],
      whatILearned: Array.isArray(body.whatILearned) ? body.whatILearned : [],
      futureImprovements: Array.isArray(body.futureImprovements) ? body.futureImprovements : [],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    const db = await getDatabase();
    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    await db.collection('projects').insertOne(newProject as any);
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create/update project' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const db = await getDatabase();
    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    if (body.action === 'reorder' && Array.isArray(body.projectIds)) {
      const projects = await db.collection('projects').find({}).toArray();
      const projectMap = new Map(projects.map((p: any) => [p.id, p]));
      const reordered: any[] = [];

      body.projectIds.forEach((id: string, index: number) => {
        const p = projectMap.get(id);
        if (p) {
          reordered.push({ ...p, displayOrder: index + 1 });
          projectMap.delete(id);
        }
      });

      projectMap.forEach((p: any) => {
        reordered.push({ ...p, displayOrder: reordered.length + 1 });
      });

      await db.collection('projects').deleteMany({});
      if (reordered.length > 0) {
        await db.collection('projects').insertMany(reordered);
      }

      return NextResponse.json(reordered);
    }

    if (!body.id) {
      return NextResponse.json({ error: 'Project ID is required for update' }, { status: 400 });
    }

    const updated = { ...body, updatedAt: new Date().toISOString().split('T')[0] };
    await db.collection('projects').replaceOne({ id: body.id }, updated as any, { upsert: true });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const db = await getDatabase();
    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    await db.collection('projects').deleteOne({ id });
    return NextResponse.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
