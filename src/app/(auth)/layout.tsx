import Link from "next/link";
import type { ReactNode } from "react";

import Logo from "@/components/shared/logo/logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-full flex-col bg-slate-50 overflow-hidden selection:bg-emerald-500 selection:text-white">
      {/* Header */}
      <header className="shrink-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="WellOra home" className="flex items-center">
            <Logo lightText={false} showSlogan={false} />
          </Link>

          <Link
            href="/"
            className="text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main Full Screen Container */}
      <main className="flex-1 w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="w-full max-w-6xl h-full max-h-[750px] flex justify-center items-center">
          {children}
        </div>
      </main>
    </div>
  );
}