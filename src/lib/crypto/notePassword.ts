import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

const KEY_LEN = 32;

export function hashNotePassword(plaintext: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(plaintext, salt, KEY_LEN);
  return `${salt.toString('hex')}:${hash.toString('hex')}`;
}

export function verifyNotePassword(plaintext: string, stored: string): boolean {
  const [saltHex, hashHex] = stored.split(':');
  if (!saltHex || !hashHex) return false;
  let salt: Buffer;
  let hash: Buffer;
  try {
    salt = Buffer.from(saltHex, 'hex');
    hash = Buffer.from(hashHex, 'hex');
  } catch {
    return false;
  }
  if (hash.length !== KEY_LEN) return false;
  const candidate = scryptSync(plaintext, salt, KEY_LEN);
  return timingSafeEqual(hash, candidate);
}
