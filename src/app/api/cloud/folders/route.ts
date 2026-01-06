import { NextRequest, NextResponse } from 'next/server';
import * as cookie from 'cookie';
import { createFolder, getFoldersByUser } from '@/lib/mongodb/models/CloudFolder';

const CLOUD_USER_ID = 'cloud_owner';

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

    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parentId') || null;

    const folders = await getFoldersByUser(CLOUD_USER_ID, parentId);

    return NextResponse.json({ folders });
  } catch (error) {
    console.error('Get folders error:', error);
    return NextResponse.json({ error: 'Failed to get folders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, parentId = null } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Folder name is required' }, { status: 400 });
    }

    const folder = await createFolder(CLOUD_USER_ID, name.trim(), parentId);

    return NextResponse.json({ folder }, { status: 201 });
  } catch (error) {
    console.error('Create folder error:', error);
    return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 });
  }
}
