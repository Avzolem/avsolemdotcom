import { NextRequest, NextResponse } from 'next/server';
import * as cookie from 'cookie';
import { getFileById, updateFile, deleteFile } from '@/lib/mongodb/models/CloudFile';
import { deleteFromCloudinary } from '@/lib/cloudinary/config';

const CLOUD_USER_ID = 'cloud_owner';

function isAuthenticated(request: NextRequest): boolean {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = cookie.parse(cookieHeader);
  return cookies.cloud_auth === 'authenticated';
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fileId } = await params;
    const file = await getFileById(fileId, CLOUD_USER_ID);

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    return NextResponse.json({ file });
  } catch (error) {
    console.error('Get file error:', error);
    return NextResponse.json({ error: 'Failed to get file' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fileId } = await params;
    const body = await request.json();
    const { name, description, folderId } = body;

    const file = await updateFile(fileId, CLOUD_USER_ID, {
      name,
      description,
      folderId,
    });

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    return NextResponse.json({ file });
  } catch (error) {
    console.error('Update file error:', error);
    return NextResponse.json({ error: 'Failed to update file' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fileId } = await params;
    const file = await getFileById(fileId, CLOUD_USER_ID);

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    await deleteFromCloudinary(file.cloudinaryPublicId, file.cloudinaryResourceType);
    await deleteFile(fileId, CLOUD_USER_ID);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete file error:', error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
