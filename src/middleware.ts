import { NextRequestWithAuth, withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|[\\w-]+\\.\\w+).*)',
  ],
};

export default withAuth(
  async function middleware(request: NextRequestWithAuth) {
    const url = request.nextUrl;
    // Get the pathname of the request (e.g. /, /about, /blog/first-post)
    const path = url.pathname;

    if (path === '/dashboard') {
      if (!request.nextauth.token) {
        url.pathname = '/';
      } else {
        const user = request.nextauth.token?.user;

        if (user.isTenantAdmin) {
          url.pathname = '/dashboard/tenants';
        } else {
          url.pathname = '/';
        }
      }

      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  },
);
