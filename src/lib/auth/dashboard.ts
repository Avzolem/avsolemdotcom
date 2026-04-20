import * as cookie from 'cookie';
import { NextRequest } from 'next/server';

export function isDashboardAuthenticated(request: NextRequest): boolean {
  const cookies = cookie.parse(request.headers.get('cookie') || '');
  return cookies.dashboard_auth === 'authenticated';
}
