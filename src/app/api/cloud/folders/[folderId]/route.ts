import { NextRequest, NextResponse } from 'next/server';
import * as cookie from 'cookie';
import { getFolderById, updateFolder, deleteFolder } from '@/lib/mongodb/models/CloudFolder';
import { getFilesByFolder, deleteFile } from '@/lib/mongodb/models/CloudFile';
import { deleteFromCloudinary } from '@/lib/cloudinary/config';

const CLOUD_USER_ID = 'cloud_owner';

function isAuthenticated(request: NextRequest): boolean {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = cookie.parse(cookieHeader);
  return cookies.cloud_auth === 'authenticated';
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ folderId: string }> }
) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { folderId } = await params;
    const folder = await getFolderById(folderId, CLOUD_USER_ID);

    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    return NextResponse.json({ folder });
  } catch (error) {
    console.error('Get folder error:', error);
    return NextResponse.json({ error: 'Failed to get folder' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ folderId: string }> }
) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { folderId } = await params;
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Folder name is required' }, { status: 400 });
    }

    const folder = await updateFolder(folderId, CLOUD_USER_ID, { name: name.trim() });

    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    return NextResponse.json({ folder });
  } catch (error) {
    console.error('Update folder error:', error);
    return NextResponse.json({ error: 'Failed to update folder' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ folderId: string }> }
) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { folderId } = await params;
    const folder = await getFolderById(folderId, CLOUD_USER_ID);

    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    // Delete all files in this folder
    const filesInFolder = await getFilesByFolder(folderId, CLOUD_USER_ID);
    for (const file of filesInFolder) {
      await deleteFromCloudinary(file.cloudinaryPublicId, file.cloudinaryResourceType);
      await deleteFile(file._id!.toString(), CLOUD_USER_ID);
    }

    // Delete the folder
    await deleteFolder(folderId, CLOUD_USER_ID);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete folder error:', error);
    return NextResponse.json({ error: 'Failed to delete folder' }, { status: 500 });
  }
}
