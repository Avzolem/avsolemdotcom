import { cookies } from 'next/headers';
import { noteAuthCookieName } from './note';

/**
 * Returns the auth cookie value for a specific note slug, or undefined.
 * Caller compares this against the note's stored passwordHash.
 */
export async function readNoteAuthCookieValue(slug: string): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(noteAuthCookieName(slug))?.value;
}
