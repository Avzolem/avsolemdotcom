import { NextRequest, NextResponse } from 'next/server';
import * as cookie from 'cookie';

// POST - Login with password
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;
    const correctPassword = process.env.CLOUD_PASSWORD;

    if (!correctPassword) {
      console.error('CLOUD_PASSWORD environment variable is not set');
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }

    if (password === correctPassword) {
      const response = NextResponse.json({ success: true }, { status: 200 });

      response.headers.set(
        'Set-Cookie',
        cookie.serialize('cloud_auth', 'authenticated', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 30, // 30 days
          sameSite: 'strict',
          path: '/',
        })
      );

      return response;
    } else {
      return NextResponse.json({ error: 'Contrasena incorrecta' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Error de servidor' }, { status: 500 });
  }
}

// GET - Check if authenticated
export async function GET(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = cookie.parse(cookieHeader);

  if (cookies.cloud_auth === 'authenticated') {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}

// DELETE - Logout
export async function DELETE() {
  const response = NextResponse.json({ success: true });

  response.headers.set(
    'Set-Cookie',
    cookie.serialize('cloud_auth', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
      sameSite: 'strict',
      path: '/',
    })
  );

  return response;
}
