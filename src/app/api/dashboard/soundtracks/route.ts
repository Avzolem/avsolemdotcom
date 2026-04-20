import { NextRequest, NextResponse } from 'next/server';
import { isDashboardAuthenticated } from '@/lib/auth/dashboard';
import { listSoundtracks, upsertSoundtrack, deleteSoundtrackByMonth } from '@/lib/mongodb/models/Soundtrack';

const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

export async function GET(request: NextRequest) {
  if (!isDashboardAuthenticated(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const soundtracks = await listSoundtracks();
  return NextResponse.json({ soundtracks });
}

export async function POST(request: NextRequest) {
  if (!isDashboardAuthenticated(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });

  const month = typeof body.month === 'string' ? body.month.trim() : '';
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const artist = typeof body.artist === 'string' ? body.artist.trim() : '';
  const youtubeId = typeof body.youtubeId === 'string' ? body.youtubeId.trim() : '';
  const description = typeof body.description === 'string' ? body.description.trim() : '';

  if (!MONTH_RE.test(month)) return NextResponse.json({ error: 'month debe ser YYYY-MM' }, { status: 400 });
  if (!title) return NextResponse.json({ error: 'title requerido' }, { status: 400 });
  if (!artist) return NextResponse.json({ error: 'artist requerido' }, { status: 400 });
  if (!youtubeId || youtubeId.length > 20) {
    return NextResponse.json({ error: 'youtubeId inválido' }, { status: 400 });
  }

  const soundtrack = await upsertSoundtrack({ month, title, artist, youtubeId, description });
  return NextResponse.json({ soundtrack });
}

export async function DELETE(request: NextRequest) {
  if (!isDashboardAuthenticated(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const month = new URL(request.url).searchParams.get('month');
  if (!month) return NextResponse.json({ error: 'month requerido' }, { status: 400 });
  const ok = await deleteSoundtrackByMonth(month);
  return NextResponse.json({ ok });
}
