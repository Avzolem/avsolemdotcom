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

// Walk blocks JSON and collect every `note/...` R2 key referenced. Substring
// match works because keys are unique random hex prefixes and BlockNote stores
// media URLs verbatim in its block props.
export function extractNoteKeysFromBlocks(blocks: unknown): string[] {
  const json = JSON.stringify(blocks ?? []);
  const matches = json.match(/note\/[a-f0-9]+-[\w.\-]+/g);
  if (!matches) return [];
  return Array.from(new Set(matches));
}

// Best-effort cleanup: delete each key, swallow individual errors so a single
// missing/already-deleted object doesn't block the rest.
export async function deleteNoteObjectsBulk(keys: string[]): Promise<{ deleted: number; failed: number }> {
  let deleted = 0;
  let failed = 0;
  await Promise.all(
    keys.map(async (key) => {
      try {
        await deleteNoteObject(key);
        deleted += 1;
      } catch (err) {
        failed += 1;
        console.error(`R2 delete failed for ${key}:`, err);
      }
    })
  );
  return { deleted, failed };
}
