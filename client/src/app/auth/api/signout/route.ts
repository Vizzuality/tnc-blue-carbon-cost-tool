import { NextResponse } from "next/server";

import { revokeSession } from "@/lib/auth/server";
import { getCorsHeaders } from "@/lib/auth/server";
import { AuthApiResponse } from "@/lib/auth/types";

export async function POST(): Promise<NextResponse<AuthApiResponse<null>>> {
  await revokeSession();
  const corsHeaders = await getCorsHeaders("POST");

  return NextResponse.json(
    {
      body: null,
      status: 200,
    },
    { headers: corsHeaders },
  );
}
