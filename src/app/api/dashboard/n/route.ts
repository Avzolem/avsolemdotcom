import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isDashboardAuthenticated } from '@/lib/auth/dashboard';
import {
  createNotePage,
  ensureNotePageIndexes,
  findNotePageBySlug,
  listNotePages,
} from '@/lib/mongodb/models/NotePage';

export async function GET(request: NextRequest) {
  if (!isDashboardAuthenticated(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  await ensureNotePageIndexes();
  const items = await listNotePages();
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  if (!isDashboardAuthenticated(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });

  const slug = typeof body.slug === 'string' ? body.slug.trim().toLowerCase() : '';
  const title = typeof body.title === 'string' ? body.title.trim() : '';

  if (!slug || !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(slug)) {
    return NextResponse.json(
      { error: 'slug inválido (solo a-z, 0-9, guiones)' },
      { status: 400 }
    );
  }
  if (!title) {
    return NextResponse.json({ error: 'title requerido' }, { status: 400 });
  }

  const existing = await findNotePageBySlug(slug);
  if (existing) {
    return NextResponse.json({ error: 'slug ya existe' }, { status: 409 });
  }

  const items = await listNotePages();
  const order = items.length > 0 ? Math.max(...items.map((p) => p.order)) + 1 : 0;

  const page = await createNotePage({
    slug,
    title,
    blocks: [],
    enabled: false,
    order,
  });

  revalidatePath('/n');
  return NextResponse.json({ ok: true, page });
}
