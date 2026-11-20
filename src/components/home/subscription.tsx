"use client";

import React, { useState } from "react";
import { CheckCircle2, Loader2, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { subscribeNewsletter } from "@/lib/newsletter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Subscription() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    setLoading(true);
    try {
      await subscribeNewsletter(trimmed);
      setIsSubscribed(true);
      setEmail("");
      toast.success("Subscribed to WellOra newsletter successfully!");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Subscription failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-card to-emerald-500/10 p-6 sm:p-12">
        <div className="mx-auto flex max-w-2xl flex-col items-center space-y-4 text-center">
          <Badge variant="outline" className="gap-1.5 bg-background/80 px-3 py-1">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            WellOra Health Newsletter
          </Badge>

          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Stay Ahead with Doctor-Reviewed Wellness Tips
          </h2>

          <p className="text-sm text-muted-foreground sm:text-base">
            Subscribe to receive weekly medical insights, seasonal care alerts,
            and preventive health guides straight to your inbox.
          </p>

          {isSubscribed ? (
            <div className="flex flex-col items-center gap-2 pt-2">
              <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2.5 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Thank you! You are now subscribed to WellOra.</span>
              </div>
              <button
                type="button"
                onClick={() => setIsSubscribed(false)}
                className="text-xs text-muted-foreground underline hover:text-foreground"
              >
                Subscribe another email
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex w-full max-w-md flex-col gap-2.5 pt-2 sm:flex-row"
            >
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  className="h-10 bg-background pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button type="submit" disabled={loading} className="h-10 px-6">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Subscribe
              </Button>
            </form>
          )}

          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            No spam. Unsubscribe anytime with one click.
          </p>
        </div>
      </div>
    </section>
  );
}