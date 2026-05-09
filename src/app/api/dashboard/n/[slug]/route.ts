import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isDashboardAuthenticated } from '@/lib/auth/dashboard';
import {
  deleteNotePageBySlug,
  findNotePageBySlug,
  updateNotePageBySlug,
} from '@/lib/mongodb/models/NotePage';
import { hashNotePassword } from '@/lib/crypto/notePassword';
import { isR2Configured } from '@/lib/r2';
import { extractNoteKeysFromBlocks, deleteNoteObjectsBulk } from '@/lib/r2/note';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isDashboardAuthenticated(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const { slug } = await params;
  const page = await findNotePageBySlug(slug);
  if (!page) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  return NextResponse.json({ page });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isDashboardAuthenticated(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const { slug } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });

  const patch: Record<string, unknown> = {};

  if (typeof body.title === 'string') {
    const title = body.title.trim();
    if (!title) return NextResponse.json({ error: 'title vacío' }, { status: 400 });
    patch.title = title;
  }

  if (typeof body.slug === 'string' && body.slug !== slug) {
    const newSlug = body.slug.trim().toLowerCase();
    if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(newSlug)) {
      return NextResponse.json({ error: 'slug inválido' }, { status: 400 });
    }
    const collision = await findNotePageBySlug(newSlug);
    if (collision) {
      return NextResponse.json({ error: 'slug ya existe' }, { status: 409 });
    }
    patch.slug = newSlug;
  }

  if (Array.isArray(body.blocks)) patch.blocks = body.blocks;
  if (typeof body.enabled === 'boolean') patch.enabled = body.enabled;
  if (typeof body.order === 'number') patch.order = body.order;

  if (typeof body.password === 'string' && body.password.length > 0) {
    patch.passwordHash = hashNotePassword(body.password);
  } else if (body.clearPassword === true) {
    patch.passwordHash = null;
  }

  const updated = await updateNotePageBySlug(slug, patch);
  if (!updated) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

  revalidatePath('/n');
  revalidatePath(`/n/${updated.slug}`);
  if (patch.slug && patch.slug !== slug) revalidatePath(`/n/${slug}`);

  return NextResponse.json({ ok: true, page: updated });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isDashboardAuthenticated(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const { slug } = await params;

  // Fetch blocks first so we can clean up R2 media after the doc is gone.
  const note = await findNotePageBySlug(slug);
  if (!note) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

  const keys = extractNoteKeysFromBlocks(note.blocks);
  const ok = await deleteNotePageBySlug(slug);
  if (!ok) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

  let mediaResult = { deleted: 0, failed: 0 };
  if (keys.length > 0 && isR2Configured()) {
    mediaResult = await deleteNoteObjectsBulk(keys);
  }

  revalidatePath('/n');
  revalidatePath(`/n/${slug}`);
  return NextResponse.json({ ok: true, media: mediaResult });
}
