import { NextResponse } from "next/server";

import { getServerSession } from "@/lib/auth/server";
import { AuthApiResponse } from "@/lib/auth/types";
import { AppSession } from "@/lib/auth/types";

export async function GET(): Promise<
  NextResponse<AuthApiResponse<AppSession | null>>
> {
  const session = await getServerSession();

  return NextResponse.json({
    body: session || null,
    status: session ? 200 : 401,
  });
}
