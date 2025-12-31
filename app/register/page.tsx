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
import { User, Mail, Lock, IdCard } from "lucide-react";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  nationalId: z.string().min(8, { message: "National ID must be at least 8 characters." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

export default function RegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      nationalId: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Registration failed");
      // TODO: Store JWT/session (e.g., localStorage, cookie, context)
      router.push("/consent");
    } catch (err) {
      console.error(err);
      alert("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-4 py-16 lg:flex-row">
        <section className="flex-1 rounded-3xl bg-gradient-to-br from-primary/80 via-primary/40 to-indigo-700 p-10 shadow-[0_30px_60px_rgba(15,23,42,0.6)]">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/80">
            Register
          </p>
          <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Create your voting account
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/80">
            Provide your identity details and choose a secure password. Your information
            is encrypted and stored according to Moroccan Law 09‑08.
          </p>
          <ul className="mt-8 space-y-3 text-sm uppercase tracking-[0.3em] text-white/80">
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-white" />
              Verified identity required
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-white" />
              One vote per person
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-white" />
              Secure biometric enrollment next
            </li>
          </ul>
        </section>

        <Card className="flex-1 border border-white/10 bg-card/80 p-8 shadow-2xl shadow-primary/30 backdrop-blur">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl">Sign up</CardTitle>
            <CardDescription>Enter your details to register.</CardDescription>
          </CardHeader>
          <CardContent className="mt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <FormField
                  control={form.control}
                  name="nationalId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>National ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Your national ID number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Required to verify your identity and prevent duplicate votes.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Creating account…" : "Create account"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
