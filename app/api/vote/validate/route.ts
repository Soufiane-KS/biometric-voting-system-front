import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  // TODO: Validate biometric assertion before allowing vote submission
  console.log("[API] Vote validation payload:", body);
  return NextResponse.json({ success: true, validated: true });
}
