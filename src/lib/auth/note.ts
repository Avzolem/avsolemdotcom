import * as cookie from 'cookie';
import { NextRequest } from 'next/server';

export const NOTE_COOKIE = 'noteAuthToken';
export const NOTE_COOKIE_VALUE = 'authenticated';
export const NOTE_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export function isNoteAuthenticated(request: NextRequest | Request): boolean {
  const header = (request.headers && typeof request.headers.get === 'function')
    ? request.headers.get('cookie') || ''
    : '';
  const cookies = cookie.parse(header);
  return cookies[NOTE_COOKIE] === NOTE_COOKIE_VALUE;
}

export function isNoteAuthenticatedFromCookieHeader(cookieHeader: string | null | undefined): boolean {
  const cookies = cookie.parse(cookieHeader || '');
  return cookies[NOTE_COOKIE] === NOTE_COOKIE_VALUE;
}
