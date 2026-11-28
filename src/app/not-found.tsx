import { ArrowLeft, Home, SearchX } from "lucide-react";
import Link from "next/link";

import Footer from "@/components/shared/footer/footer";
import Navbar from "@/components/shared/nav/navbar";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-6 pb-16 pt-32">
        <section className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
            <SearchX className="h-8 w-8" />
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            WellOra Healthcare
          </p>
          <h1 className="mt-2 text-7xl font-extrabold tracking-tight text-slate-900">
            404
          </h1>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">
            Page Not Found
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            The page or medical resource you are looking for does not exist or
            has been moved.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              <Home className="h-4 w-4" /> Back to Home
            </Link>
            <Link
              href="/doctors"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" /> Find a Doctor
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
