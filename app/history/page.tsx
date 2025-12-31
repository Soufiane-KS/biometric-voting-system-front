"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock } from "lucide-react";

type HistoryRecord = {
  id: string;
  candidate: string;
  party: string;
  date: string;
  time: string;
  status: string;
  method: string;
};

export default function VotingHistoryPage() {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/history");
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Invalid data");
        setRecords(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load voting history.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div className="p-8 text-center text-white">Loading…</div>;
  if (error) return <div className="p-8 text-center text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-4 py-16">
        <header className="rounded-3xl bg-gradient-to-br from-primary/80 via-primary/30 to-indigo-700 p-10 shadow-[0_30px_60px_rgba(15,23,42,0.6)]">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/80">
            Voting history
          </p>
          <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Your previous votes
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/80">
            This timeline records every confirmed vote you cast after successful
            biometric verification. Each entry shows the candidate, party, method,
            and timestamp for your reference.
          </p>
        </header>

        <Card className="border border-white/10 bg-card/80 p-8 shadow-2xl shadow-primary/30 backdrop-blur">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl">Activity log</CardTitle>
            <CardDescription>Track your secured votes with crystal-clear detail.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-background/80 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-base font-semibold text-foreground">{record.candidate}</p>
                    <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                      {record.party}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary" />
                    {record.date} · {record.time}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    {record.method}
                  </div>
                  <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    {record.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                History captures only confirmed votes; incomplete flows are not listed here.
              </p>
              <Button variant="ghost" className="text-xs uppercase tracking-[0.35em]">
                Export log
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
