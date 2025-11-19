import { NextRequest, NextResponse } from 'next/server';
import * as cookie from 'cookie';
import { randomBytes } from 'crypto';
import { ListType } from '@/types/yugioh';
import { getOrCreateList } from '@/lib/mongodb/models/YugiohList';

function isAuthenticated(request: NextRequest): boolean {
  const cookies = cookie.parse(request.headers.get('cookie') || '');
  return cookies.yugioh_auth === 'authenticated';
}

function validateListType(type: string): type is ListType {
  return ['collection', 'for-sale', 'wishlist'].includes(type);
}

// In-memory store for shared lists (in production, use MongoDB)
// Structure: { token: { listType, createdAt, expiresAt } }
const sharedLinks = new Map<string, {
  listType: ListType;
  createdAt: Date;
  expiresAt: Date;
}>();

/**
 * POST: Generate a shareable link for a list
 */
export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { listType, expiresInDays = 7 } = await request.json();

    if (!validateListType(listType)) {
      return NextResponse.json({ message: 'Invalid list type' }, { status: 400 });
    }

    // Generate unique token
    const token = randomBytes(16).toString('hex');

    // Calculate expiration
    const createdAt = new Date();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    // Store the shared link
    sharedLinks.set(token, {
      listType,
      createdAt,
      expiresAt,
    });

    // Clean up expired links
    for (const [key, value] of sharedLinks.entries()) {
      if (value.expiresAt < new Date()) {
        sharedLinks.delete(key);
      }
    }

    const baseUrl = request.headers.get('origin') || 'http://localhost:3000';
    const shareUrl = `${baseUrl}/yugioh/shared/${token}`;

    return NextResponse.json({
      success: true,
      shareUrl,
      token,
      expiresAt: expiresAt.toISOString(),
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

    const shareData = sharedLinks.get(token);

    if (!shareData) {
      return NextResponse.json(
        { message: 'Share link not found or expired' },
        { status: 404 }
      );
    }

    // Check if expired
    if (shareData.expiresAt < new Date()) {
      sharedLinks.delete(token);
      return NextResponse.json(
        { message: 'Share link has expired' },
        { status: 410 }
      );
    }

    // Get the list data
    const list = await getOrCreateList(shareData.listType);

    return NextResponse.json({
      success: true,
      listType: shareData.listType,
      list,
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
