"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Building2,
  UserCheck,
  CalendarClock,
  FileText,
  CalendarCheck2,
  CreditCard,
  User,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import Logo from "@/components/shared/logo/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth, type IAuthUser } from "@/context/AuthContext";

type DashboardRole = IAuthUser["role"];

type NavigationItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const adminNavigation: NavigationItem[] = [
  { href: "/admin", label: "Overview & Analytics", icon: LayoutDashboard },
  { href: "/admin/departments", label: "Departments", icon: Building2 },
  {
    href: "/admin/doctor-applications",
    label: "Doctor Applications",
    icon: UserCheck,
  },
  { href: "/admin/schedeules", label: "Schedules", icon: CalendarClock },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/appointments", label: "Appointments", icon: CalendarCheck2 },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
];

const doctorNavigation: NavigationItem[] = [
  { href: "/doctor", label: "Overview & Analytics", icon: LayoutDashboard },
];

const patientNavigation: NavigationItem[] = [
  { href: "/patient", label: "Overview", icon: LayoutDashboard },
  { href: "/patient/appointments", label: "Appointments", icon: CalendarCheck2 },
];

const profileNavigation: NavigationItem = {
  href: "/me",
  label: "My Profile",
  icon: User,
};

const getNavigationForRole = (role: DashboardRole | undefined) => {
  if (role === "ADMIN" || role === "SUPER_ADMIN") return adminNavigation;
  if (role === "DOCTOR") return doctorNavigation;
  return patientNavigation;
};

const getDashboardTitle = (role: DashboardRole | undefined) => {
  if (role === "ADMIN" || role === "SUPER_ADMIN") return "Admin Control Panel";
  if (role === "DOCTOR") return "Doctor Workspace";
  return "Patient Portal";
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, router, user]);

  const navigation = [...getNavigationForRole(user?.role), profileNavigation];
  const dashboardTitle = getDashboardTitle(user?.role);
  const avatarUrl =
    user?.profilePhoto ||
    user?.patient?.profilePhoto ||
    user?.doctor?.profilePhoto ||
    "";

  const checkIsActive = (href: string) =>
    href === "/admin" || href === "/doctor" || href === "/patient"
      ? pathname === href
      : pathname.startsWith(href);

  if (loading || !user) return null;

  return (
    <div className="flex min-h-screen bg-slate-50/70">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <div className="flex h-16 items-center border-b border-slate-200 px-6">
          <Link href="/" aria-label="WellOra home">
            <Logo lightText={false} />
          </Link>
        </div>

        <nav className="flex-1 space-y-1 p-4" aria-label="Dashboard navigation">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = checkIsActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20"
                    : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <Link
            href="/me"
            className="mb-3 flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition-colors hover:border-emerald-200 hover:bg-emerald-50"
          >
            <Avatar className="h-9 w-9 border border-slate-200">
              <AvatarImage src={avatarUrl} alt={user.name} />
              <AvatarFallback className="bg-emerald-100 text-xs font-bold text-emerald-700">
                {user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">{user.name}</p>
              <p className="truncate text-xs text-slate-500">{user.email}</p>
            </div>
          </Link>
          <Button
            asChild
            variant="ghost"
            className="w-full justify-start gap-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-semibold"
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to website</span>
            </Link>
          </Button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-10 flex w-64 flex-col bg-white shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
              <Logo lightText={false} />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(false)}
                className="text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="flex-1 space-y-1 p-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = checkIsActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-emerald-600 text-white"
                        : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-slate-200 p-4">
              <Button
                asChild
                variant="ghost"
                className="w-full justify-start gap-2.5 rounded-xl text-slate-600 font-semibold"
              >
                <Link href="/" onClick={() => setMobileOpen(false)}>
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to website</span>
                </Link>
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 lg:hidden">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/" aria-label="WellOra home">
              <Logo lightText={false} />
            </Link>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Badge
              variant="outline"
              className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold px-3 py-1"
            >
              {dashboardTitle}
            </Badge>
            <Link
              href="/me"
              aria-label="Open my profile"
              className="rounded-full ring-offset-2 transition-shadow hover:ring-2 hover:ring-emerald-300"
            >
              <Avatar className="h-9 w-9 border border-slate-200">
                <AvatarImage src={avatarUrl} alt={user.name} />
                <AvatarFallback className="bg-emerald-100 text-xs font-bold text-emerald-700">
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}