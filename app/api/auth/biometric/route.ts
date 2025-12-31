import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  // TODO: Verify biometric payload (WebAuthn/assertion) and email, return JWT/session
  console.log("[API] Auth biometric payload:", body);
  return NextResponse.json({ success: true, token: "jwt-placeholder" });
}
