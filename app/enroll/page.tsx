 "use client";

import type { ComponentType } from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Fingerprint, User } from "lucide-react";

type BiometricMethod = "face" | "fingerprint";

const enrollmentOptions: {
  value: BiometricMethod;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}[] = [
  {
    value: "face",
    title: "Face ID",
    description: "Use the front camera",
    icon: User,
  },
  {
    value: "fingerprint",
    title: "Fingerprint",
    description: "Capture your finger id",
    icon: Fingerprint,
  },
];

export default function BiometricEnrollmentPage() {
  const router = useRouter();
  const [biometricMethod, setBiometricMethod] = useState<BiometricMethod>("face");
  const [progress, setProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [finished, setFinished] = useState(false);
  const progressTimer = useRef<NodeJS.Timeout | null>(null);
  const finishTimer = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (biometricMethod === "face" && !isScanning && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      });
    } else if (biometricMethod !== "face" && streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [biometricMethod, isScanning]);

  useEffect(() => {
    if (isScanning && progress < 100) {
      progressTimer.current = setTimeout(() => {
        setProgress((prev) => Math.min(prev + 10, 100));
      }, 450);
    } else if (progress >= 100 && !finished) {
      setFinished(true);
      finishTimer.current = setTimeout(() => {
        router.push("/vote");
      }, 800);
    }

    return () => {
      if (progressTimer.current) {
        clearTimeout(progressTimer.current);
        progressTimer.current = null;
      }
    };
  }, [isScanning, progress, router, finished]);

  const handleStartScan = async () => {
    if (isScanning) return;
    setFinished(false);
    setProgress(0);
    setIsScanning(true);
    try {
      if (biometricMethod === "face") {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.createElement("video");
        video.srcObject = stream;
        video.play();
        await new Promise((r) => (video.onloadedmetadata = r));
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(video, 0, 0);
        const imageBlob = await new Promise<Blob>((resolve) =>
          canvas.toBlob((blob) => resolve(blob!), "image/jpeg")
        );
        stream.getTracks().forEach((t) => t.stop());
        const formData = new FormData();
        formData.append("image", imageBlob, "face.jpg");
        formData.append("action", "enroll");
        const res = await fetch("/api/biometric/face-id", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!data.success || !data.verified) throw new Error("Face ID enrollment failed");
      } else {
        const res = await fetch("/api/enroll", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ method: biometricMethod }),
        });
        const data = await res.json();
        if (!data.success || !data.enrolled) throw new Error("Enrollment failed");
      }
      // Simulate progress UI
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setFinished(true);
            setTimeout(() => router.push("/vote"), 1500);
            return 100;
          }
          return prev + 12;
        });
      }, 300);
    } catch (err) {
      console.error(err);
      alert("Enrollment failed. Please try again.");
      setIsScanning(false);
    }
  };

  useEffect(() => {
    return () => {
      if (finishTimer.current) {
        clearTimeout(finishTimer.current);
      }
    };
  }, []);

  const Icon =
    enrollmentOptions.find((option) => option.value === biometricMethod)?.icon ??
    User;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-4 py-16 lg:flex-row">
        <section className="flex-1 rounded-3xl bg-gradient-to-br from-primary/80 via-primary/40 to-indigo-700 p-10 shadow-[0_30px_60px_rgba(15,23,42,0.6)]">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/80">Enrollment</p>
          <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Enroll the biometric you trust
          </h1>
          <p className="mt-6 text-lg text-white/80">
            Choose face or fingerprint scanning that best matches your device, and follow
            the guided capture to complete your secure enrollment.
          </p>
          <ul className="mt-8 space-y-3 text-sm uppercase tracking-[0.3em] text-white/80">
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-white" />
              Biometric data stored locally
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-white" />
              Real-time progress & feedback
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-white" />
              Redirects automatically to voting
            </li>
          </ul>
        </section>

        <Card className="flex-1 border border-white/10 bg-card/80 p-8 shadow-2xl shadow-primary/30 backdrop-blur">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl">Biometric Enrollment</CardTitle>
            <CardDescription>Select a method and follow the scan flow.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Enrollment method
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {enrollmentOptions.map((option) => {
                  const OptionIcon = option.icon;
                  return (
                    <Button
                      key={option.value}
                      type="button"
                      variant={biometricMethod === option.value ? "secondary" : "outline"}
                      className="flex w-full flex-col items-start gap-3 rounded-2xl border-white/20 px-4 py-5 text-left shadow-sm transition sm:px-6 min-h-[120px]"
                      onClick={() => {
                        setBiometricMethod(option.value);
                        setFinished(false);
                        setProgress(0);
                      }}
                    >
                      <div className="flex w-full items-center gap-3 text-sm font-semibold">
                        <OptionIcon className="h-5 w-5 text-primary" />
                        {option.title}
                      </div>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 rounded-2xl border border-primary/40 bg-primary/5 p-6 text-center">
              <Icon className="h-12 w-12 text-primary" />
              <p className="text-sm text-muted-foreground">
                {isScanning
                  ? `Scanning your ${biometricMethod === "face" ? "face" : "fingerprint"}...`
                  : finished
                  ? "Enrollment complete! Redirecting..."
                  : `Ready to capture ${biometricMethod === "face" ? "Face ID" : "fingerprint"}`}
              </p>
              {biometricMethod === "face" && !isScanning && (
                <div className="relative w-full aspect-square bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 border-2 border-primary/50 rounded-lg pointer-events-none" />
                </div>
              )}
              {isScanning && <Progress value={progress} className="w-full" />}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleStartScan} disabled={isScanning} className="w-full">
              {isScanning
                ? "Scanning in Progress..."
                : `Start ${biometricMethod === "face" ? "Face ID" : "Fingerprint"} Scan`}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
