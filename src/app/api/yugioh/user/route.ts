import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import {
  findUserById,
  updateUserPreferences,
  deleteUser,
} from '@/lib/mongodb/models/User';
import { getUserStats, deleteUserLists } from '@/lib/mongodb/models/YugiohList';
import { unsubscribeFromNewsletter } from '@/lib/mongodb/models/Newsletter';

// GET: Get user profile and stats
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await findUserById(session.user.id);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const stats = await getUserStats(session.user.id);

    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        image: user.image,
        provider: user.provider,
        newsletterSubscribed: user.newsletterSubscribed,
        language: user.language,
        createdAt: user.createdAt,
      },
      stats,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { message: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PATCH: Update user preferences
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, newsletterSubscribed, language } = body;

    const updates: {
      name?: string;
      newsletterSubscribed?: boolean;
      language?: 'es' | 'en';
    } = {};

    if (name !== undefined) updates.name = name;
    if (newsletterSubscribed !== undefined) updates.newsletterSubscribed = newsletterSubscribed;
    if (language !== undefined) updates.language = language;

    await updateUserPreferences(session.user.id, updates);

    return NextResponse.json({ success: true, updates });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { message: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE: Delete user account and all data
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Delete all user lists
    await deleteUserLists(session.user.id);

    // Unsubscribe from newsletter
    await unsubscribeFromNewsletter(session.user.email);

    // Delete user account
    await deleteUser(session.user.id);

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { message: 'Failed to delete account' },
      { status: 500 }
    );
  }
}
