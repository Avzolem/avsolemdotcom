import { NextRequest, NextResponse } from 'next/server';
import * as cookie from 'cookie';

const COOKIE_NAME = 'dashboard_auth';

export function isDashboardAuthed(req: NextRequest): boolean {
  const cookies = cookie.parse(req.headers.get('cookie') || '');
  return cookies[COOKIE_NAME] === 'authenticated';
}

export function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
