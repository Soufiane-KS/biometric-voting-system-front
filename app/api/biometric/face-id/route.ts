import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  // TODO: Handle WebAuthn/Face ID assertion or enrollment payload
  // Expected fields: { email?, action: "enroll" | "auth", credential: WebAuthnCredential }
  console.log("[API] Face ID payload:", body);
  return NextResponse.json({ success: true, verified: true, credentialId: "face-id-placeholder" });
}
