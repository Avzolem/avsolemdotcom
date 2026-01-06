import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Legacy browsers that should use /cloud/lite
const LEGACY_BROWSERS = [
  'Nintendo 3DS',
  'Nintendo Browser',
  'PSP',
  'PlayStation Portable',
  'PlayStation Vita',
  'NetFront',
  'PLAYSTATION 3',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';

  // Redirect legacy browsers to /cloud/lite
  if (pathname.startsWith('/cloud') && !pathname.startsWith('/cloud/lite')) {
    const isLegacyBrowser = LEGACY_BROWSERS.some(
      (browser) => userAgent.includes(browser)
    );

    if (isLegacyBrowser) {
      // Map /cloud to /cloud/lite and /cloud/stream/x to /cloud/lite/stream/x
      let litePath = pathname.replace('/cloud', '/cloud/lite');
      if (litePath === '/cloud/lite/lite') litePath = '/cloud/lite';

      return NextResponse.redirect(new URL(litePath, request.url));
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
