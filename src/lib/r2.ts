import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

export const R2_BUCKET = process.env.R2_BUCKET || '';

let cached: S3Client | null = null;

export function getR2Client(): S3Client {
  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error('R2 not configured: missing R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY');
  }
  if (!cached) {
    cached = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  return cached;
}

export function isR2Configured(): boolean {
  return Boolean(accountId && accessKeyId && secretAccessKey && R2_BUCKET);
}

export async function getR2BucketUsage(): Promise<{ bytes: number; objects: number }> {
  const client = getR2Client();
  let bytes = 0;
  let objects = 0;
  let token: string | undefined;
  do {
    const res = await client.send(
      new ListObjectsV2Command({ Bucket: R2_BUCKET, ContinuationToken: token })
    );
    for (const obj of res.Contents ?? []) {
      bytes += obj.Size ?? 0;
      objects += 1;
    }
    token = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (token);
  return { bytes, objects };
}
