import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  // TODO: Store biometric enrollment method (face/fingerprint) for user
  console.log("[API] Enrollment payload:", body);
  return NextResponse.json({ success: true, enrolled: true });
}
