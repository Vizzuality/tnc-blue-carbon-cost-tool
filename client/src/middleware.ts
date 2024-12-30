import { NextRequest, NextResponse } from "next/server";

import { signOut } from "@/lib/auth/api";
import { SIGNIN_PATH } from "@/lib/auth/constants";
import { getServerSession } from "@/lib/auth/server";

import { isPrivatePath } from "@/lib/utils";

export async function middleware(req: NextRequest) {
  if (PRIVATE_PAGES.test(req.nextUrl.pathname)) {
    const session = await getServerSession();

    if (!session) {
      await signOut();
      return NextResponse.redirect(new URL(SIGNIN_PATH, req.url));
    }
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
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
