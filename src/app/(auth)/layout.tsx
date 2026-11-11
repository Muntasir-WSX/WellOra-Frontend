import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

import Logo from "@/components/shared/logo/logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-50 selection:bg-emerald-500 selection:text-white">
      {/* Fixed Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="WellOra home" className="flex items-center">
            <Logo lightText={false} showSlogan={false} />
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area - Auto Scrollable & Centered */}
      <main className="flex-1 w-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-6xl my-auto py-4">
          {children}
        </div>
      </main>
    </div>
  );
}