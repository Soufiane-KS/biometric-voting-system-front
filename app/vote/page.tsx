"use client";

import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Fingerprint, User } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type BiometricMethod = "face" | "fingerprint";

const validationOptions: {
  value: BiometricMethod;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    value: "face",
    title: "Face ID",
    description: "Use the front camera to verify your identity.",
    icon: User,
  },
  {
    value: "fingerprint",
    title: "Fingerprint",
    description: "Use the fingerprint reader on your device.",
    icon: Fingerprint,
  },
];

const candidates = [
  {
    id: "c-aziz",
    name: "Aziz Akhannouch",
    party: "National Rally of Independents",
    region: "Rabat-Salé-Kénitra",
    platform: "Economic growth, tourism revitalization, and sustainable agribusiness.",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "c-naima",
    name: "Naima Benyahia",
    party: "Social Democratic Front",
    region: "Casablanca-Settat",
    platform: "Equitable housing, vocational education, and corruption-free procurement.",
    image:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "c-hassan",
    name: "Hassan Amrani",
    party: "Istiqlal",
    region: "Marrakesh-Safi",
    platform: "Infrastructure upgrades, green transportation, and creative industries.",
    image:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "c-salma",
    name: "Salma El Idrissi",
    party: "Authenticity and Modernity Party",
    region: "Fès-Meknès",
    platform: "Digital literacy, universal health, and resilient public services.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "c-youssef",
    name: "Youssef Marzouk",
    party: "Green Movement",
    region: "Tanger-Tétouan-Al Hoceïma",
    platform: "Solar energy, coastal protection, and park stewardship programs.",
    image:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "c-farida",
    name: "Farida Lahlou",
    party: "Women Equality Front",
    region: "Souss-Massa",
    platform: "Women in leadership, safe mobility, and microfinance boosters.",
    image:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "c-omar",
    name: "Omar Joud",
    party: "Democratic Modernist",
    region: "Béni Mellal-Khénifra",
    platform: "Rural broadband, vocational schools, and water-smart agriculture.",
    image:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "c-ines",
    name: "Inès Saidi",
    party: "Youth Pulse",
    region: "Drâa-Tafilalet",
    platform: "Renewable farming, cultural tourism, and youth entrepreneurship.",
    image:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "c-khalid",
    name: "Khalid El Guerrouj",
    party: "Justice & Progress",
    region: "Meknès",
    platform: "Justice transparency, trackable budgets, and civic technology labs.",
    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "c-dev",
    name: "Yara El Mansouri",
    party: "Innovation Bloc",
    region: "Fès",
    platform: "Smart cities, open data, and tech incubators for young Moroccan founders.",
    image:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "c-adam",
    name: "Adam Ettayeb",
    party: "National Front",
    region: "Tétouan",
    platform: "Border security, logistics corridors, and public safety.",
    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "c-nesrine",
    name: "Nesrine Berrada",
    party: "Civic Alliance",
    region: "Oujda",
    platform: "Cross-border collaboration, green industry, and healthcare pilots.",
    image:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "c-mohamed",
    name: "Mohamed Idrissi",
    party: "Progressive Union",
    region: "Khouribga",
    platform: "Mining-to-manufacturing pipelines and industrial apprenticeships.",
    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "c-dounia",
    name: "Dounia Habbache",
    party: "Coastal Coalition",
    region: "Agadir",
    platform: "Fishing communities, port innovation, and coastal resilience.",
    image:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "c-ili",
    name: "Ilham Saad",
    party: "Nur Alliance",
    region: "Errachidia",
    platform: "Religious tolerance, ethics in governance, and desert agriculture.",
    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "c-ryad",
    name: "Ryad Abbes",
    party: "Economic Renewal",
    region: "Youssoufia",
    platform: "Logistics, financial literacy, and vocational training hubs.",
    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "c-sanaa",
    name: "Sanaa Riahi",
    party: "Sustainable Morocco",
    region: "Al Hoceïma",
    platform: "Blue economy, artisanal clusters, and coastal tourism.",
    image:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "c-yasmina",
    name: "Yasmina Zaz",
    party: "Cultural Vanguard",
    region: "Chefchaouen",
    platform: "Heritage protection, arts funding, and regional exhibitions.",
    image:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "c-hafsa",
    name: "Hafsa Rami",
    party: "Farmers for Tomorrow",
    region: "Essaouira",
    platform: "Regenerative farming, cooperatives, and rural youth scholarships.",
    image:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "c-nabil",
    name: "Nabil Zarrouk",
    party: "Digital Fellowship",
    region: "Rabat",
    platform: "E-government, civic tech, and digital inclusion labs.",
    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=500&q=80",
  },
];

export default function VotePage() {
  const [selectedMethod, setSelectedMethod] = useState<BiometricMethod>("face");
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasValidated, setHasValidated] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isScanning && progress < 100) {
      timer = setTimeout(() => {
        setProgress((prev) => Math.min(prev + 12, 100));
      }, 300);
    } else if (progress >= 100 && isScanning) {
      setIsScanning(false);
      setHasValidated(true);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isScanning, progress]);

  const startValidation = async () => {
    if (!selectedCandidate) {
      alert("Select a candidate before validation.");
      return;
    }
    setIsScanning(true);
    setProgress(0);
    setHasValidated(false);
    try {
      const res = await fetch("/api/vote/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidate: selectedCandidate, method: selectedMethod }),
      });
      const data = await res.json();
      if (!data.success || !data.validated) throw new Error("Validation failed");
      // Simulate progress UI
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsScanning(false);
            setHasValidated(true);
            return 100;
          }
          return prev + 12;
        });
      }, 300);
    } catch (err) {
      console.error(err);
      alert("Biometric validation failed. Please try again.");
      setIsScanning(false);
    }
  };

  const handleVoteConfirmation = async () => {
    try {
      const res = await fetch("/api/vote/cast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidate: selectedCandidate, method: selectedMethod }),
      });
      const data = await res.json();
      if (!data.success) throw new Error("Vote casting failed");
      alert(
        `Your vote for ${
          candidates.find((candidate) => candidate.id === selectedCandidate)?.name ?? "N/A"
        } has been cast successfully!`
      );
      // Optionally navigate to history or confirmation page
    } catch (err) {
      console.error(err);
      alert("Failed to cast vote. Please try again.");
    }
  };

  const SelectedIcon =
    validationOptions.find((option) => option.value === selectedMethod)?.icon ?? User;

  const selectedCandidateDetails = candidates.find(
    (candidate) => candidate.id === selectedCandidate
  );

  const handleCandidateSelect = (id: string) => {
    setSelectedCandidate(id);
    setHasValidated(false);
    setIsScanning(false);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-4 py-16">
        <Card className="border border-white/10 bg-card/80 p-8 shadow-2xl shadow-primary/30 backdrop-blur">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl">Moroccan Candidates</CardTitle>
            <CardDescription>
              Review the range of leaders and secure your selection with biometrics.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-10">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Vote for one of the leaders
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {candidates.map((candidate) => {
                  const isSelected = selectedCandidate === candidate.id;
                  return (
                    <div
                      key={candidate.id}
                      className={`flex flex-col rounded-2xl border bg-background shadow-sm transition ${
                        isSelected
                          ? "border-primary/70 ring-2 ring-primary/20"
                          : "border-white/10"
                      }`}
                    >
                      <div className="h-40 w-full overflow-hidden rounded-t-2xl bg-slate-900">
                        <img
                          src={candidate.image}
                          alt={candidate.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-base font-semibold text-foreground">{candidate.name}</h3>
                        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                          {candidate.party}
                        </p>
                        <p className="text-sm text-muted-foreground">{candidate.region}</p>
                        <p className="mt-2 text-sm text-muted-foreground">{candidate.platform}</p>
                      </div>
                      <div className="px-4 pb-4">
                        <Button
                          className="w-full"
                          variant={isSelected ? "secondary" : "outline"}
                          onClick={() => handleCandidateSelect(candidate.id)}
                        >
                          {isSelected ? "Selected" : "Vote for this candidate"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Verification & confirmation
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {validationOptions.map((option) => {
                  const OptionIcon = option.icon;
                  return (
                    <Button
                      key={option.value}
                      type="button"
                      variant={selectedMethod === option.value ? "secondary" : "outline"}
                      className="flex w-full flex-col items-start gap-3 rounded-2xl border-white/20 px-4 py-5 text-left shadow-sm transition sm:px-6 min-h-[120px]"
                      onClick={() => setSelectedMethod(option.value)}
                    >
                      <div className="flex w-full items-center gap-3 text-sm font-semibold leading-none">
                        <OptionIcon className="h-5 w-5" />
                        {option.title}
                      </div>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </Button>
                  );
                })}
              </div>
              <div className="rounded-2xl border border-primary/40 bg-primary/5 p-5 text-center shadow-inner">
                <SelectedIcon className="mx-auto h-10 w-10 text-primary" />
                <p className="mt-3 text-sm text-muted-foreground">
                  {selectedCandidate
                    ? isScanning
                      ? `Validating ${selectedMethod === "face" ? "Face ID" : "Fingerprint"}...`
                      : hasValidated
                      ? "Validation complete. You can now cast your vote."
                      : "Start validation to confirm it’s you."
                    : "Select a candidate to begin validation."}
                </p>
                {isScanning && <Progress value={progress} className="mt-3 w-full" />}
                <Button
                  type="button"
                  onClick={startValidation}
                  disabled={isScanning || !selectedCandidate}
                  className="mt-3 w-full"
                >
                  {isScanning ? "Scanning..." : "Start validation"}
                </Button>
              </div>
              {selectedCandidate && selectedCandidateDetails && (
                <Card className="rounded-2xl bg-background/80 p-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-muted-foreground">You are voting for:</p>
                    <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      {selectedCandidateDetails.party}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {selectedCandidateDetails.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{selectedCandidateDetails.platform}</p>
                </Card>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button disabled={!hasValidated || !selectedCandidate} className="w-full">
                  Confirm Vote
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently cast your vote for
                    {selectedCandidateDetails?.name}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleVoteConfirmation}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
