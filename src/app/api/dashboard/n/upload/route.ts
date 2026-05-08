import { NextRequest, NextResponse } from 'next/server';
import { isDashboardAuthenticated } from '@/lib/auth/dashboard';
import { isR2Configured } from '@/lib/r2';
import { buildNoteKey, signNoteUploadUrl } from '@/lib/r2/note';

const MAX_BYTES = 5 * 1024 * 1024 * 1024;

export async function POST(request: NextRequest) {
  if (!isDashboardAuthenticated(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  if (!isR2Configured()) {
    return NextResponse.json({ error: 'R2 no configurado' }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });

  const filename = typeof body.filename === 'string' ? body.filename : '';
  const contentType = typeof body.contentType === 'string' ? body.contentType : '';
  const size = typeof body.size === 'number' ? body.size : null;

  if (!filename || !contentType) {
    return NextResponse.json({ error: 'filename y contentType requeridos' }, { status: 400 });
  }
  if (!/^image\/|^video\//.test(contentType)) {
    return NextResponse.json({ error: 'solo image/* o video/*' }, { status: 400 });
  }
  if (size !== null && size > MAX_BYTES) {
    return NextResponse.json({ error: 'archivo > 5 GB' }, { status: 400 });
  }

  const key = buildNoteKey(filename);
  const uploadUrl = await signNoteUploadUrl(key, contentType);

  return NextResponse.json({ key, uploadUrl });
}
