import { NextRequest, NextResponse } from 'next/server';
import { createUserWithCredentials } from '@/lib/mongodb/models/User';
import { subscribeToNewsletter } from '@/lib/mongodb/models/Newsletter';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, language = 'es', subscribeNewsletter = false } = body;

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { message: 'MISSING_FIELDS', error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'INVALID_EMAIL', error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'WEAK_PASSWORD', error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Validate name length
    if (name.length < 2 || name.length > 50) {
      return NextResponse.json(
        { message: 'INVALID_NAME', error: 'Name must be between 2 and 50 characters' },
        { status: 400 }
      );
    }

    // Create user
    const user = await createUserWithCredentials(
      email,
      password,
      name,
      language,
      subscribeNewsletter
    );

    // Subscribe to newsletter if requested
    if (subscribeNewsletter && user._id) {
      await subscribeToNewsletter(email, language, user._id.toString());
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (errorMessage === 'EMAIL_EXISTS') {
      return NextResponse.json(
        { message: 'EMAIL_EXISTS', error: 'This email is already registered' },
        { status: 409 }
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'SERVER_ERROR', error: 'Internal server error' },
      { status: 500 }
    );
  }
}
