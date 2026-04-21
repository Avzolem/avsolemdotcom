import { NextRequest, NextResponse } from 'next/server';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { isDashboardAuthed, unauthorized } from '@/lib/dashboard-auth';
import { R2_BUCKET, getR2Client, isR2Configured } from '@/lib/r2';

const PREFIX = 'videos/';

export async function GET(req: NextRequest) {
  if (!isDashboardAuthed(req)) return unauthorized();
  if (!isR2Configured()) {
    return NextResponse.json({ error: 'R2 not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');
  if (!key || !key.startsWith(PREFIX)) {
    return NextResponse.json({ error: 'invalid key' }, { status: 400 });
  }

  const client = getR2Client();
  const url = await getSignedUrl(
    client,
    new GetObjectCommand({ Bucket: R2_BUCKET, Key: key }),
    { expiresIn: 60 * 10 }
  );

  return NextResponse.json({ url, expiresIn: 600 });
}
