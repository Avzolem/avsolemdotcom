import * as cookie from 'cookie';
import { NextRequest } from 'next/server';

export const NOTE_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export function noteAuthCookieName(slug: string): string {
  return `note_${slug}_auth`;
}

export function readNoteAuthCookie(request: NextRequest | Request, slug: string): string | undefined {
  const header = request.headers && typeof request.headers.get === 'function'
    ? request.headers.get('cookie') || ''
    : '';
  const cookies = cookie.parse(header);
  return cookies[noteAuthCookieName(slug)];
}

export function findAllNoteAuthCookies(cookieHeader: string | null | undefined): Array<{ slug: string; value: string }> {
  const out: Array<{ slug: string; value: string }> = [];
  const cookies = cookie.parse(cookieHeader || '');
  for (const [name, value] of Object.entries(cookies)) {
    const m = name.match(/^note_(.+)_auth$/);
    if (m && value) out.push({ slug: m[1], value });
  }
  return out;
}
