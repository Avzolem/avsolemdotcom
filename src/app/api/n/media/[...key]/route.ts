import { NextRequest, NextResponse } from 'next/server';
import { isNoteAuthenticated } from '@/lib/auth/note';
import { isDashboardAuthenticated } from '@/lib/auth/dashboard';
import { isR2Configured } from '@/lib/r2';
import { isNoteKey, signNoteDownloadUrl, NOTE_PREFIX } from '@/lib/r2/note';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  if (!isNoteAuthenticated(request) && !isDashboardAuthenticated(request)) {
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
