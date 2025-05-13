// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Clone the request headers
  const requestHeaders = new Headers(request.headers);
  
  // Set caching headers for static assets
  if (request.nextUrl.pathname.startsWith('/_next/static')) {
    requestHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  // You can add more middleware logic here
  // For example:
  // - Redirects
  // - Authentication checks
  // - Path rewrites
  // - Locale handling
  // - etc.

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};