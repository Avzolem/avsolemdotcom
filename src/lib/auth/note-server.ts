import { cookies } from 'next/headers';
import { NOTE_COOKIE, NOTE_COOKIE_VALUE } from './note';

export async function isNoteAuthedServer(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(NOTE_COOKIE)?.value === NOTE_COOKIE_VALUE;
}
