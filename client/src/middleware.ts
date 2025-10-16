import { NextResponse } from "next/server";

import { NextRequestWithAuth, withAuth } from "next-auth/middleware";

import { isPrivatePath } from "@/lib/utils";

export default function middleware(req: NextRequestWithAuth) {
  if (isPrivatePath(req.nextUrl.pathname)) {
    return withAuth(req, {
      pages: {
        signIn: "/auth/signin",
      },
    });
  }

  return NextResponse.next();
}
