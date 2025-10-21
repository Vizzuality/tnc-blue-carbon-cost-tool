import { NextRequest, NextResponse } from "next/server";

import { NextRequestWithAuth, withAuth } from "next-auth/middleware";

import { isPrivatePath } from "@/lib/utils";

export default function middleware(req: NextRequestWithAuth) {
  // HTTP Basic Auth logic
  function isAuthenticated(req: NextRequest) {
    // Skip auth if disabled via environment config
    const isBasicAuthEnabled =
      (process.env.BASIC_AUTH_ENABLED ?? "").toLowerCase() === "true";
    if (!isBasicAuthEnabled) return true;

    const authHeader =
      req.headers.get("authorization") || req.headers.get("Authorization");
    if (!authHeader?.startsWith("Basic ")) return false;

    const [user, pass] = Buffer.from(authHeader.split(" ")[1], "base64")
      .toString()
      .split(":");

    return (
      user === process.env.BASIC_AUTH_USER &&
      pass === process.env.BASIC_AUTH_PASSWORD
    );
  }

  const PUBLIC_FILE = /\.(.*)$/;
  const BASIC_AUTH_EXCLUDED_PATHS = [/^\/health\/?$/];

  if (
    PUBLIC_FILE.test(req.nextUrl.pathname) ||
    BASIC_AUTH_EXCLUDED_PATHS.some((pattern) =>
      pattern.test(req.nextUrl.pathname),
    )
  ) {
    return NextResponse.next();
  }

  if (!isAuthenticated(req)) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": "Basic" },
    });
  }

  if (isPrivatePath(req.nextUrl.pathname)) {
    return withAuth(req, {
      pages: {
        signIn: "/auth/signin",
      },
    });
  }

  return NextResponse.next();
}
