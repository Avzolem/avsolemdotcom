import { GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomBytes } from 'crypto';
import { R2_BUCKET, getR2Client } from '@/lib/r2';

export const NOTE_PREFIX = 'note/';

export function buildNoteKey(filename: string): string {
  const safeName = String(filename).replace(/[^\w.\-]+/g, '_').slice(0, 120);
  const id = randomBytes(8).toString('hex');
  return `${NOTE_PREFIX}${id}-${safeName}`;
}

export function isNoteKey(key: string): boolean {
  return typeof key === 'string' && key.startsWith(NOTE_PREFIX);
}

export async function signNoteUploadUrl(key: string, contentType: string, expiresInSeconds = 60 * 15) {
  const client = getR2Client();
  return getSignedUrl(
    client,
    new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, ContentType: contentType }),
    { expiresIn: expiresInSeconds }
  );
}

export async function signNoteDownloadUrl(key: string, expiresInSeconds = 60 * 60) {
  const client = getR2Client();
  return getSignedUrl(
    client,
    new GetObjectCommand({ Bucket: R2_BUCKET, Key: key }),
    { expiresIn: expiresInSeconds }
  );
}

export async function deleteNoteObject(key: string) {
  const client = getR2Client();
  await client.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key }));
}
