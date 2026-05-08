import { NextRequest, NextResponse } from 'next/server';
import * as cookie from 'cookie';
import { findNotePageBySlug } from '@/lib/mongodb/models/NotePage';
import { verifyNotePassword } from '@/lib/crypto/notePassword';
import { noteAuthCookieName, NOTE_COOKIE_MAX_AGE } from '@/lib/auth/note';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.slug !== 'string' || typeof body.password !== 'string') {
    return NextResponse.json({ error: 'slug y password requeridos' }, { status: 400 });
  }

  const note = await findNotePageBySlug(body.slug);
  if (!note || !note.enabled) {
    return NextResponse.json({ error: 'No encontrada' }, { status: 404 });
  }
  if (!note.passwordHash) {
    return NextResponse.json({ error: 'Esta nota no tiene contraseña' }, { status: 400 });
  }
  if (!verifyNotePassword(body.password, note.passwordHash)) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.headers.set(
    'Set-Cookie',
    cookie.serialize(noteAuthCookieName(note.slug), note.passwordHash, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: NOTE_COOKIE_MAX_AGE,
      sameSite: 'lax',
      path: '/',
    })
  );
  return response;
}

export async function DELETE(request: NextRequest) {
  const slug = new URL(request.url).searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'slug requerido' }, { status: 400 });
  const response = NextResponse.json({ ok: true });
  response.headers.set(
    'Set-Cookie',
    cookie.serialize(noteAuthCookieName(slug), '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
      sameSite: 'lax',
      path: '/',
    })
  );
  return response;
}
