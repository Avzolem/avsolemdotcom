import { NextRequest, NextResponse } from 'next/server';
import * as cookie from 'cookie';
import { generateSignedUploadParams } from '@/lib/cloudinary/config';

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
    const { folder } = body;

    const uploadFolder = folder
      ? `${process.env.CLOUDINARY_FOLDER}/${folder}`
      : process.env.CLOUDINARY_FOLDER || 'cloud_storage';

    const params = generateSignedUploadParams(uploadFolder);

    return NextResponse.json(params);
  } catch (error) {
    console.error('Upload signature error:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload signature' },
      { status: 500 }
    );
  }
}
