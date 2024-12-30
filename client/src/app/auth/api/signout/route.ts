import { NextResponse } from "next/server";

import { revokeSession } from "@/lib/auth/server";

export async function POST() {
  await revokeSession();

  return NextResponse.json({ message: "Logged out" });
}
