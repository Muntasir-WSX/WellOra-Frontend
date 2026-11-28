"use client";

import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import Footer from "@/components/shared/footer/footer";
import Navbar from "@/components/shared/nav/navbar";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-6 pb-16 pt-32">
        <section className="w-full max-w-xl rounded-3xl border border-rose-100 bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-1 ring-rose-100">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-rose-600">
            Something Went Wrong
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Unexpected System Error
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            We encountered an unexpected issue while loading this page. Please
            try again or return to the WellOra home page.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-rose-700"
            >
              <RotateCcw className="h-4 w-4" /> Try Again
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <Home className="h-4 w-4" /> Go to Home
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
