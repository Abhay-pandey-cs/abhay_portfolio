import { NextResponse } from 'next/server';
import { DataStore } from '@/lib/storage';
import { Project } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const category = searchParams.get('category');
    const featuredOnly = searchParams.get('featured') === 'true';

    let projects = DataStore.getProjects();

    if (slug) {
      const project = DataStore.getProjectBySlug(slug);
      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
      return NextResponse.json(project);
    }

    if (featuredOnly) {
      projects = projects.filter(p => p.featured && p.published);
    }

    if (category) {
      projects = projects.filter(p => p.category === category);
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

    const saved = DataStore.saveProject(newProject);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create/update project' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (body.action === 'reorder' && Array.isArray(body.projectIds)) {
      const reordered = DataStore.reorderProjects(body.projectIds);
      return NextResponse.json(reordered);
    }

    if (!body.id) {
      return NextResponse.json({ error: 'Project ID is required for update' }, { status: 400 });
    }

    const saved = DataStore.saveProject(body);
    return NextResponse.json(saved);
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

    DataStore.deleteProject(id);
    return NextResponse.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
