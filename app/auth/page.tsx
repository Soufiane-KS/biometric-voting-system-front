"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Fingerprint, Key } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

type AuthMethod = "password" | "fingerprint";

const methodOptions: { value: AuthMethod; title: string; description: string }[] =
  [
    {
      value: "password",
      title: "Password",
      description: "Classic credentials",
    },
    {
      value: "fingerprint",
      title: "Fingerprint",
      description: "Quick biometric login",
    },
  ];

const authStats = [
  { label: "Trusted voters", value: "2,400+" },
  { label: "Secure sessions", value: "99.9% uptime" },
  { label: "Completed votes", value: "184K" },
];

export default function AuthenticationPage() {
  const router = useRouter();
  const [authMethod, setAuthMethod] = useState<AuthMethod>("password");
  const [isScanning, setIsScanning] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const emailValue = form.watch("email");
  const hasEmail = Boolean(emailValue?.trim());

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!data.success) throw new Error("Login failed");
      // TODO: Store JWT/session (e.g., localStorage, cookie, context)
      router.push("/consent");
    } catch (err) {
      console.error(err);
      alert("Authentication failed. Please try again.");
    }
  }

  const handleFingerprintAuth = async () => {
    if (!hasEmail) {
      alert("Start by entering your email so we can recognize you.");
      return;
    }

    setIsScanning(true);
    try {
      const res = await fetch("/api/auth/biometric", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailValue }),
      });
      const data = await res.json();
      if (!data.success) throw new Error("Biometric auth failed");
      // TODO: Store JWT/session (e.g., localStorage, cookie, context)
      router.push("/consent");
    } catch (err) {
      console.error(err);
      alert("Biometric authentication failed. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-4 py-16 lg:flex-row">
        <div className="flex-1 rounded-3xl bg-gradient-to-br from-primary/80 via-primary/40 to-indigo-700 p-10 shadow-[0_30px_60px_rgba(15,23,42,0.6)]">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/80">
            Front-End Vote
          </p>
          <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Secure access to Morocco’s voting platform
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/80">
            Choose how you would like to prove your identity. Every action is
            validated through biometric verification and encrypted sessions so the
            ballot stays personal.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {authStats.map((stat) => (
              <div key={stat.label} className="space-y-1 rounded-2xl bg-black/20 p-4 backdrop-blur">
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <Card className="flex-1 border border-white/10 bg-card/80 p-8 shadow-2xl shadow-primary/30 backdrop-blur">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl">Welcome back</CardTitle>
            <CardDescription>
              Enter your email to unlock voting and pick your preferred authentication
              method.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-4 space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        We will use this address to look up your voting profile.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    How should we authenticate you?
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {methodOptions.map((method) => (
                      <Button
                        key={method.value}
                        type="button"
                        variant={authMethod === method.value ? "secondary" : "outline"}
                        className="flex w-full flex-col items-start gap-3 rounded-2xl border-white/20 px-4 py-5 text-left shadow-sm transition sm:px-6 min-h-[120px]"
                        onClick={() => setAuthMethod(method.value)}
                      >
                        <div className="flex w-full items-center gap-3 text-sm font-semibold leading-tight">
                          {method.value === "fingerprint" ? (
                            <Fingerprint className="h-5 w-5 text-primary" />
                          ) : (
                            <Key className="h-5 w-5 text-primary" />
                          )}
                          <span>{method.title}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{method.description}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {authMethod === "password" ? (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <div className="space-y-3 rounded-2xl border border-primary/40 bg-primary/5 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">Fingerprint ready</p>
                        <p className="text-sm text-muted-foreground">
                          Place your finger on the reader on your device.
                        </p>
                      </div>
                      <Fingerprint className="h-6 w-6 text-primary" />
                    </div>
                    <Button
                      type="button"
                      onClick={handleFingerprintAuth}
                      disabled={isScanning || !hasEmail}
                    >
                      {isScanning ? "Scanning..." : "Authenticate with fingerprint"}
                    </Button>
                  </div>
                )}

                {authMethod === "password" && (
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
