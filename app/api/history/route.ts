import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // TODO: Return authenticated user's voting history (candidate, date, method)
  console.log("[API] Fetch voting history");
  return NextResponse.json([
    {
      id: "record-1",
      candidate: "Aziz Akhannouch",
      party: "National Rally of Independents",
      date: "2025-12-30",
      time: "09:12",
      status: "Completed",
      method: "Fingerprint",
    },
    {
      id: "record-2",
      candidate: "Naima Benyahia",
      party: "Social Democratic Front",
      date: "2025-12-29",
      time: "17:03",
      status: "Completed",
      method: "Face ID",
    },
    {
      id: "record-3",
      candidate: "Hassan Amrani",
      party: "Istiqlal",
      date: "2025-12-28",
      time: "14:28",
      status: "Completed",
      method: "Fingerprint",
    },
  ]);
}
