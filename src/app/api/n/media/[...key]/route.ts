import { NextRequest, NextResponse } from 'next/server';
import { findAllNoteAuthCookies } from '@/lib/auth/note';
import { isDashboardAuthenticated } from '@/lib/auth/dashboard';
import { isR2Configured } from '@/lib/r2';
import { isNoteKey, signNoteDownloadUrl, NOTE_PREFIX } from '@/lib/r2/note';
import { findNotePageBySlug } from '@/lib/mongodb/models/NotePage';

async function isMediaAuthorized(request: NextRequest): Promise<boolean> {
  if (isDashboardAuthenticated(request)) return true;
  const cookies = findAllNoteAuthCookies(request.headers.get('cookie'));
  for (const { slug, value } of cookies) {
    const note = await findNotePageBySlug(slug);
    // Cookie value matches the note's stored passwordHash → that user authed for this note
    if (note?.passwordHash && note.passwordHash === value) return true;
    // Public note (no password) — any reader is allowed
    if (note && !note.passwordHash) return true;
  }
  return false;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  if (!(await isMediaAuthorized(request))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  if (!isR2Configured()) {
    return NextResponse.json({ error: 'R2 no configurado' }, { status: 500 });
  }

  const { key: parts } = await params;
  const fullKey = parts.join('/');

  const normalizedKey = fullKey.startsWith(NOTE_PREFIX) ? fullKey : `${NOTE_PREFIX}${fullKey}`;
  if (!isNoteKey(normalizedKey)) {
    return NextResponse.json({ error: 'key inválida' }, { status: 400 });
  }

  const url = await signNoteDownloadUrl(normalizedKey);
  return NextResponse.redirect(url, 302);
}
