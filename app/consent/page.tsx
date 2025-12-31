"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const consentHighlights = [
  "Data stays within Morocco’s voting infrastructure.",
  "Only verified biometric signatures can cast ballots.",
  "All actions are logged, encrypted, and auditable.",
];

export default function ConsentPage() {
  const router = useRouter();
  const [hasConsented, setHasConsented] = useState(false);

  const handleConsentChange = (checked: boolean | "indeterminate") => {
    if (typeof checked === "boolean") {
      setHasConsented(checked);
    }
  };

  const handleProceed = async () => {
    if (!hasConsented) {
      alert("You must accept the terms and conditions to proceed.");
      return;
    }
    try {
      const res = await fetch("/api/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consented: true }),
      });
      const data = await res.json();
      if (!data.success) throw new Error("Consent recording failed");
      router.push("/enroll");
    } catch (err) {
      console.error(err);
      alert("Failed to record consent. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-4 py-16 lg:flex-row">
        <section className="flex-1 rounded-3xl bg-gradient-to-br from-primary/80 via-primary/40 to-indigo-700 p-10 shadow-[0_30px_60px_rgba(15,23,42,0.6)]">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/80">
            Consent & Privacy
          </p>
          <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Transparent and accountable governance
          </h1>
          <p className="mt-6 text-lg text-white/80">
            We use your consent to ensure the system respects your rights while
            keeping the vote secure. Everything you accept can be audited and
            rolled back if needed.
          </p>
          <ul className="mt-8 space-y-3 text-sm uppercase tracking-[0.3em] text-white/80">
            {consentHighlights.map((item) => (
              <li key={item} className="flex items-center gap-2 text-base">
                <span className="h-2 w-2 rounded-full bg-white" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <Card className="flex-1 border border-white/10 bg-card/80 p-8 shadow-2xl shadow-primary/30 backdrop-blur">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl">User consent (Moroccan Law 09-08)</CardTitle>
            <CardDescription>Read & agree to the updated terms.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3 rounded-3xl border border-white/5 bg-black/20 p-4 shadow-lg shadow-black/30">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/80">
                <span>Moroccan Law 09-08</span>
                <span>Printable policy</span>
              </div>
              <iframe
                src="/Loi-09-08-relative-a-la-protection-des-personnes-physiques-a-legard-du-traitement-des-donnees-a-caractere-personnel.pdf"
                title="Moroccan Law 09-08"
                className="h-64 w-full rounded-2xl border border-white/10 bg-white/10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="consent"
                checked={hasConsented}
                onCheckedChange={handleConsentChange}
              />
              <label
                htmlFor="consent"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I have read and agree to the terms and conditions.
              </label>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleProceed} disabled={!hasConsented} className="w-full">
              Proceed to Biometric Enrollment
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
