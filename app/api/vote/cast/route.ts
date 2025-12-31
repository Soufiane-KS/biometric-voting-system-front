import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  // TODO: Persist final vote (candidate, timestamp, method) and prevent double-vote
  console.log("[API] Cast vote payload:", body);
  return NextResponse.json({ success: true, voteId: "vote-placeholder-id" });
}
