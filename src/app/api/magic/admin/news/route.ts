import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import {
  getAllNews,
  createNews,
  updateNews,
  deleteNews,
} from '@/lib/mongodb/models/MagicNews';

// Get admin emails from environment variable
function getAdminEmails(): string[] {
  const adminEmails = process.env.YUGIOH_ADMIN_EMAILS || '';
  return adminEmails.split(',').map(email => email.trim().toLowerCase()).filter(Boolean);
}

function isAdminEmail(email: string): boolean {
  return getAdminEmails().includes(email.toLowerCase());
}

// GET - Get all news (admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const news = await getAllNews();
    return NextResponse.json({ news });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

// POST - Create news
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const body = await request.json();
    const { title, summary, content, coverImage, tags, isPublished, isFeatured } = body;

    if (!title) {
      return NextResponse.json({ error: 'Titulo es requerido' }, { status: 400 });
    }

    const author = session.user.name || session.user.email;

    const news = await createNews({
      title,
      content: content || '',
      summary: summary || '',
      imageUrl: coverImage || '',
      author,
      isPublished: isPublished || false,
      publishedAt: isPublished ? new Date() : undefined,
    });

    return NextResponse.json({ news }, { status: 201 });
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

// PATCH - Update news
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
    }

    // Map coverImage to imageUrl for model compatibility
    if (updates.coverImage !== undefined) {
      updates.imageUrl = updates.coverImage;
      delete updates.coverImage;
    }

    // If publishing for the first time, set publishedAt
    if (updates.isPublished && !updates.publishedAt) {
      updates.publishedAt = new Date();
    }

    const success = await updateNews(id, updates);

    if (!success) {
      return NextResponse.json({ error: 'Noticia no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating news:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

// DELETE - Delete news
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
    }

    const success = await deleteNews(id);

    if (!success) {
      return NextResponse.json({ error: 'Noticia no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
