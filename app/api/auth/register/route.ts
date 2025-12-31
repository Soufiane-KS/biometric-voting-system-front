import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  // TODO: Validate full name, email, nationalId, password; check for duplicates; create user; return JWT/session
  console.log("[API] Register payload:", body);
  return NextResponse.json({ success: true, token: "jwt-placeholder" });
}
