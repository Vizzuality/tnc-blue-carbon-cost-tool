import { NextRequest, NextResponse } from "next/server";

import { generateUserJWT } from "@/lib/auth/jwt";
import { setAuthCookie, setResponseCookie } from "@/lib/auth/server";
import { AppSession } from "@/lib/auth/types";
import { client } from "@/lib/query-client";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const response = await client.auth.login.mutation({
      body: { email, password },
    });

    if (response.status !== 201) {
      return NextResponse.json(
        { error: response.body.errors?.[0]?.title || "Invalid credentials" },
        { status: response.status },
      );
    }

    setResponseCookie(response.headers);

    const appSession: AppSession = response.body;
    const token = await generateUserJWT(appSession);
    setAuthCookie(token);

    return NextResponse.json(appSession);
  } catch (err) {
    return NextResponse.json(
      { error: "An error occurred during sign in" },
      { status: 500 },
    );
  }
}
