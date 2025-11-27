import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { clearList } from '@/lib/mongodb/models/YugiohList';

/**
 * POST: Clear all lists (collection, for-sale, wishlist)
 * Requires authentication
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Clear all three lists for this user
    await Promise.all([
      clearList('collection', userId),
      clearList('for-sale', userId),
      clearList('wishlist', userId),
    ]);

    return NextResponse.json({
      success: true,
      message: 'All lists cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing lists:', error);
    return NextResponse.json(
      { message: 'Failed to clear lists' },
      { status: 500 }
    );
  }
}
