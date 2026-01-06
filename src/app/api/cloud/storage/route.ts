import { NextRequest, NextResponse } from 'next/server';
import * as cookie from 'cookie';
import { getStorageUsed } from '@/lib/mongodb/models/CloudFile';

const CLOUD_USER_ID = 'cloud_owner';
const STORAGE_LIMIT = 25 * 1024 * 1024 * 1024; // 25 GB

function isAuthenticated(request: NextRequest): boolean {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = cookie.parse(cookieHeader);
  return cookies.cloud_auth === 'authenticated';
}

export async function GET(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const usage = await getStorageUsed(CLOUD_USER_ID);

    return NextResponse.json({
      used: usage.totalSize,
      limit: STORAGE_LIMIT,
      fileCount: usage.fileCount,
      breakdown: usage.breakdown,
      percentage: Math.round((usage.totalSize / STORAGE_LIMIT) * 100),
    });
  } catch (error) {
    console.error('Storage API error:', error);
    return NextResponse.json({ error: 'Failed to get storage info' }, { status: 500 });
  }
}
