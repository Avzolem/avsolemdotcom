import { NextRequest, NextResponse } from 'next/server';
import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { isDashboardAuthed, unauthorized } from '@/lib/dashboard-auth';
import { R2_BUCKET, getR2Client, isR2Configured } from '@/lib/r2';
import { randomBytes } from 'crypto';

const PREFIX = 'videos/';

export async function GET(req: NextRequest) {
  if (!isDashboardAuthed(req)) return unauthorized();
  if (!isR2Configured()) {
    return NextResponse.json({ error: 'R2 not configured' }, { status: 500 });
  }

  const client = getR2Client();
  const out = await client.send(
    new ListObjectsV2Command({ Bucket: R2_BUCKET, Prefix: PREFIX })
  );
  const items = (out.Contents || [])
    .filter((o) => o.Key && o.Key !== PREFIX)
    .map((o) => ({
      key: o.Key!,
      size: o.Size || 0,
      lastModified: o.LastModified?.toISOString() || null,
    }))
    .sort((a, b) => (b.lastModified || '').localeCompare(a.lastModified || ''));

  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  if (!isDashboardAuthed(req)) return unauthorized();
  if (!isR2Configured()) {
    return NextResponse.json({ error: 'R2 not configured' }, { status: 500 });
  }

  const { filename, contentType, size } = await req.json();
  if (!filename || !contentType) {
    return NextResponse.json({ error: 'filename and contentType required' }, { status: 400 });
  }
  if (typeof size === 'number' && size > 5 * 1024 * 1024 * 1024) {
    return NextResponse.json({ error: 'Max 5 GB' }, { status: 400 });
  }

  const safeName = String(filename).replace(/[^\w.\-]+/g, '_').slice(0, 120);
  const id = randomBytes(8).toString('hex');
  const key = `${PREFIX}${id}-${safeName}`;

  const client = getR2Client();
  const uploadUrl = await getSignedUrl(
    client,
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: 60 * 15 }
  );

  return NextResponse.json({ key, uploadUrl });
}

export async function DELETE(req: NextRequest) {
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
  await client.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key }));
  return NextResponse.json({ success: true });
}
