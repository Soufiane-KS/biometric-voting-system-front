import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  // TODO: Validate email/password, verify credentials, return JWT/session
  console.log("[API] Auth login payload:", body);
  return NextResponse.json({ success: true, token: "jwt-placeholder" });
}
