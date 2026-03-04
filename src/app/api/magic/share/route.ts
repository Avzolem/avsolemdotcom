import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { randomBytes } from 'crypto';
import { ListType } from '@/types/magic';
import { getOrCreateList } from '@/lib/mongodb/models/MagicList';
import {
  createSharedLink,
  getSharedLink,
} from '@/lib/mongodb/models/MagicSharedLink';

function validateListType(type: string): type is ListType {
  return ['collection', 'for-sale', 'wishlist'].includes(type);
}

/**
 * POST: Generate a shareable link for a list
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { listType, expiresInDays = 7 } = await request.json();

    if (!validateListType(listType)) {
      return NextResponse.json({ message: 'Invalid list type' }, { status: 400 });
    }

    // Generate unique token
    const token = randomBytes(16).toString('hex');

    // Get list cards to snapshot into the shared link
    const list = await getOrCreateList(listType, userId);

    // Create shared link in MongoDB
    const sharedLink = await createSharedLink({
      userId,
      userName: session?.user?.name || undefined,
      token,
      listType,
      cards: list.cards || [],
      expiresInDays,
    });

    const baseUrl = request.headers.get('origin') || 'http://localhost:3000';
    const shareUrl = `${baseUrl}/magic/shared/${token}`;

    return NextResponse.json({
      success: true,
      shareUrl,
      token,
      expiresAt: sharedLink.expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('Error creating share link:', error);
    return NextResponse.json(
      { message: 'Failed to create share link' },
      { status: 500 }
    );
  }
}

/**
 * GET: Get shared list by token
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { message: 'Token required' },
        { status: 400 }
      );
    }

    const shareData = await getSharedLink(token);

    if (!shareData) {
      return NextResponse.json(
        { message: 'Share link not found or expired' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      listType: shareData.listType,
      cards: shareData.cards,
      userName: shareData.userName,
      expiresAt: shareData.expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('Error fetching shared list:', error);
    return NextResponse.json(
      { message: 'Failed to fetch shared list' },
      { status: 500 }
    );
  }
}
