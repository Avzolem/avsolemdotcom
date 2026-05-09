import { NextRequest, NextResponse } from 'next/server';
import { findAllNoteAuthCookies } from '@/lib/auth/note';
import { isDashboardAuthenticated } from '@/lib/auth/dashboard';
import { isR2Configured } from '@/lib/r2';
import { isNoteKey, signNoteDownloadUrl, NOTE_PREFIX } from '@/lib/r2/note';
import { findNotePageBySlug, listNotePages } from '@/lib/mongodb/models/NotePage';

// Find which note (if any) embeds this R2 key in its blocks JSON.
// Keys are unique random hex prefixes — substring match on the serialized
// blocks is reliable and cheap given a small N of notes.
async function findNoteOwningKey(fullKey: string): Promise<{ slug: string; passwordHash?: string | null } | null> {
  const notes = await listNotePages();
  for (const note of notes) {
    if (JSON.stringify(note.blocks ?? []).includes(fullKey)) {
      return { slug: note.slug, passwordHash: note.passwordHash ?? null };
    }
  }
  return null;
}

async function isMediaAuthorized(request: NextRequest, fullKey: string): Promise<boolean> {
  if (isDashboardAuthenticated(request)) return true;

  const owner = await findNoteOwningKey(fullKey);

  // Media not embedded in any note (orphan) → only the dashboard can fetch it.
  if (!owner) return false;

  // Owning note is public → anyone can fetch its media, no cookie needed.
  if (!owner.passwordHash) return true;

  // Owning note is protected → require the matching note auth cookie.
  const cookies = findAllNoteAuthCookies(request.headers.get('cookie'));
  return cookies.some(
    ({ slug, value }) => slug === owner.slug && value === owner.passwordHash
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  if (!isR2Configured()) {
    return NextResponse.json({ error: 'R2 no configurado' }, { status: 500 });
  }

  const { key: parts } = await params;
  const fullKey = parts.join('/');

  const normalizedKey = fullKey.startsWith(NOTE_PREFIX) ? fullKey : `${NOTE_PREFIX}${fullKey}`;
  if (!isNoteKey(normalizedKey)) {
    return NextResponse.json({ error: 'key inválida' }, { status: 400 });
  }

  if (!(await isMediaAuthorized(request, normalizedKey))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const url = await signNoteDownloadUrl(normalizedKey);
  return NextResponse.redirect(url, 302);
}
