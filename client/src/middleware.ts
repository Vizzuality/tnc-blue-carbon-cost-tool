import { NextResponse } from "next/server";

import { NextRequestWithAuth, withAuth } from "next-auth/middleware";

const PRIVATE_PAGES = /^(\/profile|\/my-projects)/;

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
