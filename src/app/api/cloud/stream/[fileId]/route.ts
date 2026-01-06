import { NextRequest, NextResponse } from 'next/server';
import * as cookie from 'cookie';
import { getFileById, updateLastAccessed } from '@/lib/mongodb/models/CloudFile';
import { generateSignedStreamUrl, generateHlsStreamUrl } from '@/lib/cloudinary/config';

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
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format') || 'mp4';

    const file = await getFileById(fileId, CLOUD_USER_ID);
    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    if (file.cloudinaryResourceType !== 'video') {
      return NextResponse.json({ error: 'File is not a video' }, { status: 400 });
    }

    const expiresIn = 900; // 15 minutes
    let url: string;

    if (format === 'm3u8' || format === 'hls') {
      url = generateHlsStreamUrl(file.cloudinaryPublicId, expiresIn);
    } else {
      url = generateSignedStreamUrl(file.cloudinaryPublicId, {
        resourceType: 'video',
        format: file.cloudinaryFormat || 'mp4',
        expiresIn,
      });
    }

    await updateLastAccessed(fileId);

    const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

    return NextResponse.json({
      url,
      format,
      expiresAt,
      file: {
        name: file.name,
        duration: file.duration,
        width: file.width,
        height: file.height,
      },
    });
  } catch (error) {
    console.error('Stream API error:', error);
    return NextResponse.json({ error: 'Failed to generate stream URL' }, { status: 500 });
  }
}
