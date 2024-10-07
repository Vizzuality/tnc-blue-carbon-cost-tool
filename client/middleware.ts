import { NextResponse } from "next/server";

import { NextRequestWithAuth, withAuth } from "next-auth/middleware";

const PRIVATE_PAGES = /^(\/profile)/;

export default function middleware(req: NextRequestWithAuth) {
  if (PRIVATE_PAGES.test(req.nextUrl.pathname)) {
    return withAuth(req, {
      pages: {
        signIn: "/auth/signin",
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - health (health check endpoint)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|health).*)",
  ],
};
