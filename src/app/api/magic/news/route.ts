import { NextResponse } from 'next/server';
import { getPublishedNews } from '@/lib/mongodb/models/MagicNews';

// GET - Get all published news (public)
export async function GET() {
  try {
    const news = await getPublishedNews();
    return NextResponse.json({ news });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
