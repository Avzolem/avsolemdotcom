import { NextRequest, NextResponse } from 'next/server';
import { getPublishedNews, getNewsBySlug } from '@/lib/mongodb/models/News';

// GET - Get all published news or single by slug (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const article = await getNewsBySlug(slug);
      if (!article) {
        return NextResponse.json({ error: 'Noticia no encontrada' }, { status: 404 });
      }
      return NextResponse.json({ article });
    }

    const news = await getPublishedNews();
    return NextResponse.json({ news });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
