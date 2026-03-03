import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import {
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
  isSubscribed,
  getSubscriberCount,
} from '@/lib/mongodb/models/Newsletter';
import { updateUserPreferences } from '@/lib/mongodb/models/User';

// GET - Check subscription status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    // If no email provided, check for session
    if (!email) {
      const session = await getServerSession(authOptions);

      if (!session?.user?.email) {
        return NextResponse.json(
          { subscribed: false },
          { status: 200 }
        );
      }

      const subscribed = await isSubscribed(session.user.email);
      return NextResponse.json({ subscribed }, { status: 200 });
    }

    const subscribed = await isSubscribed(email);
    return NextResponse.json({ subscribed }, { status: 200 });
  } catch (error) {
    console.error('Newsletter check error:', error);
    return NextResponse.json(
      { error: 'Error checking subscription status' },
      { status: 500 }
    );
  }
}

// POST - Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, language = 'es' } = body;

    // Check for session to get userId
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // If no email in body, use session email
    const subscriptionEmail = email || session?.user?.email;

    if (!subscriptionEmail) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(subscriptionEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const subscriber = await subscribeToNewsletter(subscriptionEmail, language, userId);

    // Update user preferences if logged in
    if (userId) {
      await updateUserPreferences(userId, { newsletterSubscribed: true });
    }

    return NextResponse.json(
      {
        success: true,
        subscriber: {
          email: subscriber.email,
          language: subscriber.language,
          isActive: subscriber.isActive,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    return NextResponse.json(
      { error: 'Error subscribing to newsletter' },
      { status: 500 }
    );
  }
}

// DELETE - Unsubscribe from newsletter
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let email = searchParams.get('email');

    // If no email in params, check for session
    if (!email) {
      const session = await getServerSession(authOptions);

      if (!session?.user?.email) {
        return NextResponse.json(
          { error: 'Email is required' },
          { status: 400 }
        );
      }

      email = session.user.email;

      // Update user preferences
      if (session.user.id) {
        await updateUserPreferences(session.user.id, { newsletterSubscribed: false });
      }
    }

    await unsubscribeFromNewsletter(email);

    return NextResponse.json(
      { success: true, message: 'Unsubscribed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Error unsubscribing from newsletter' },
      { status: 500 }
    );
  }
}
