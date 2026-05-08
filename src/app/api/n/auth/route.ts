import { NextRequest, NextResponse } from 'next/server';
import * as cookie from 'cookie';
import { NOTE_COOKIE, NOTE_COOKIE_VALUE, NOTE_COOKIE_MAX_AGE } from '@/lib/auth/note';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.password !== 'string') {
    return NextResponse.json({ error: 'password requerido' }, { status: 400 });
  }

  const expected = process.env.NOTE_PASSWORD;
  if (!expected) {
    console.error('NOTE_PASSWORD env var not set');
    return NextResponse.json({ error: 'No configurado' }, { status: 500 });
  }

  if (body.password !== expected) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.headers.set(
    'Set-Cookie',
    cookie.serialize(NOTE_COOKIE, NOTE_COOKIE_VALUE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: NOTE_COOKIE_MAX_AGE,
      sameSite: 'lax',
      path: '/',
    })
  );
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.headers.set(
    'Set-Cookie',
    cookie.serialize(NOTE_COOKIE, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
      sameSite: 'lax',
      path: '/',
    })
  );
  return response;
}
