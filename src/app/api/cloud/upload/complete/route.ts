import { NextRequest, NextResponse } from 'next/server';
import * as cookie from 'cookie';
import { createFile } from '@/lib/mongodb/models/CloudFile';
import { generateThumbnailUrl } from '@/lib/cloudinary/config';

const CLOUD_USER_ID = 'cloud_owner';

function isAuthenticated(request: NextRequest): boolean {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = cookie.parse(cookieHeader);
  return cookies.cloud_auth === 'authenticated';
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      public_id,
      secure_url,
      resource_type,
      format,
      bytes,
      duration,
      width,
      height,
      original_filename,
      version,
      folderId,
    } = body;

    if (!public_id || !secure_url) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let thumbnailUrl: string | undefined;
    if (resource_type === 'video') {
      thumbnailUrl = generateThumbnailUrl(public_id);
    }

    const mimeType = getMimeType(resource_type, format);

    const file = await createFile({
      userId: CLOUD_USER_ID,
      folderId: folderId || null,
      name: original_filename || public_id.split('/').pop() || 'Untitled',
      originalName: original_filename || 'Untitled',
      cloudinaryPublicId: public_id,
      cloudinaryResourceType: resource_type,
      cloudinaryFormat: format,
      cloudinarySecureUrl: secure_url,
      cloudinaryVersion: version,
      size: bytes,
      duration: duration ? Math.round(duration) : undefined,
      width,
      height,
      mimeType,
      thumbnailUrl,
    });

    return NextResponse.json({ success: true, file }, { status: 201 });
  } catch (error) {
    console.error('Upload complete error:', error);
    return NextResponse.json({ error: 'Failed to save file record' }, { status: 500 });
  }
}

function getMimeType(resourceType: string, format: string): string {
  if (resourceType === 'video') {
    const videoMimes: Record<string, string> = {
      mp4: 'video/mp4',
      webm: 'video/webm',
      mov: 'video/quicktime',
      avi: 'video/x-msvideo',
      mkv: 'video/x-matroska',
    };
    return videoMimes[format] || 'video/mp4';
  }

  if (resourceType === 'image') {
    const imageMimes: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
    };
    return imageMimes[format] || 'image/jpeg';
  }

  return 'application/octet-stream';
}
