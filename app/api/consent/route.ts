import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  // TODO: Record user consent (Moroccan Law 09-08) and timestamp
  console.log("[API] Consent payload:", body);
  return NextResponse.json({ success: true });
}
