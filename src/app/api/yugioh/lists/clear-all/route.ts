import { NextRequest, NextResponse } from 'next/server';
import * as cookie from 'cookie';
import { clearList } from '@/lib/mongodb/models/YugiohList';

function isAuthenticated(request: NextRequest): boolean {
  const cookies = cookie.parse(request.headers.get('cookie') || '');
  return cookies.yugioh_auth === 'authenticated';
}

/**
 * POST: Clear all lists (collection, for-sale, wishlist)
 * Requires authentication
 */
export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Clear all three lists
    await Promise.all([
      clearList('collection'),
      clearList('for-sale'),
      clearList('wishlist'),
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
