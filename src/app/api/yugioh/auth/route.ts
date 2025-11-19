import { NextRequest, NextResponse } from 'next/server';
import * as cookie from 'cookie';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;
    const correctPassword = process.env.YUGIOH_ADMIN_PASSWORD;

    if (!correctPassword) {
      console.error('YUGIOH_ADMIN_PASSWORD environment variable is not set');
      return NextResponse.json(
        { message: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (password === correctPassword) {
      const response = NextResponse.json({ success: true }, { status: 200 });

      response.headers.set(
        'Set-Cookie',
        cookie.serialize('yugioh_auth', 'authenticated', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          sameSite: 'strict',
          path: '/',
        })
      );

      return response;
    } else {
      return NextResponse.json(
        { message: 'Incorrect password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const cookies = cookie.parse(request.headers.get('cookie') || '');

  if (cookies.yugioh_auth === 'authenticated') {
    return NextResponse.json({ authenticated: true }, { status: 200 });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ success: true }, { status: 200 });

  response.headers.set(
    'Set-Cookie',
    cookie.serialize('yugioh_auth', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
      sameSite: 'strict',
      path: '/',
    })
  );

  return response;
}
