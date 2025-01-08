import { NextRequest, NextResponse } from "next/server";

import { generateUserJWT } from "@/lib/auth/jwt";
import { setAuthCookie, setResponseCookie } from "@/lib/auth/server";
import { AuthApiResponse, AppSession } from "@/lib/auth/types";
import { client } from "@/lib/query-client";

export async function POST(
  req: NextRequest,
): Promise<NextResponse<AuthApiResponse<AppSession | null>>> {
  try {
    const { email, password } = await req.json();

    const response = await client.auth.login.mutation({
      body: { email, password },
    });

    if (response.status !== 201) {
      return NextResponse.json({
        body: null,
        status: response.status,
        error: response.body.errors?.[0]?.title || "Invalid credentials",
      });
    }

    setResponseCookie(response.headers);

    const appSession: AppSession = response.body;
    const token = await generateUserJWT(appSession);
    setAuthCookie(token);

    return NextResponse.json({
      body: appSession,
      status: 201,
    });
  } catch (err) {
    return NextResponse.json({
      body: null,
      status: 500,
      error: "An error occurred during sign in",
    });
  }
}
