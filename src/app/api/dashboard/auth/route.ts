import { NextRequest, NextResponse } from 'next/server';
import * as cookie from 'cookie';

// Shared password with /cloud — single admin knob.
const COOKIE_NAME = 'dashboard_auth';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const correct = process.env.CLOUD_PASSWORD;

    if (!correct) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    }
    if (password !== correct) {
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.headers.set(
      'Set-Cookie',
      cookie.serialize(COOKIE_NAME, 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'strict',
        path: '/',
      })
    );
    return response;
  } catch {
    return NextResponse.json({ error: 'Error de servidor' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const cookies = cookie.parse(request.headers.get('cookie') || '');
  if (cookies[COOKIE_NAME] === 'authenticated') {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.headers.set(
    'Set-Cookie',
    cookie.serialize(COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
      sameSite: 'strict',
      path: '/',
    })
  );
  return response;
}
