import Link from "next/link";
import type { ReactNode } from "react";

import Logo from "@/components/shared/logo/logo";

const navigation = [
  { href: "/patient", label: "Overview" },
  { href: "/patient/appointments", label: "Appointments" },
  { href: "/patient/profile", label: "Profile" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white lg:flex lg:flex-col">
        <div className="flex h-16 items-center border-b border-gray-200 px-6">
          <Link href="/" aria-label="WellOra home">
            <Logo />
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-4" aria-label="Dashboard navigation">
          {navigation.map((item) => (
            <Link
              className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-gray-200 p-4">
          <Link
            className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            href="/"
          >
            Back to website
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
          <Link className="lg:hidden" href="/" aria-label="WellOra home">
            <Logo />
          </Link>
          <p className="ml-auto text-sm font-medium text-gray-600">
            WellOra Dashboard
          </p>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
