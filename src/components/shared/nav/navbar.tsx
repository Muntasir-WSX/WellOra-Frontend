"use client";

import {
  ChevronDown,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  User as UserIcon,
  UserCircle,
  UserPlus,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import Logo from "../logo/logo";

function Navbar() {
  const { user, loading, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => pathname === path;

  const isMoreActive =
    isActive("/services") ||
    isActive("/about-us") ||
    isActive("/contact-us") ||
    isActive("/help");

  // Role-based Dashboard path
  const getDashboardRoute = () => {
    if (!user) return "/patient";
    switch (user.role) {
      case "ADMIN":
      case "SUPER_ADMIN":
        return "/admin";
      case "DOCTOR":
        return "/doctor";
      default:
        return "/patient";
    }
  };

const avatarUrl =
  user?.profilePhoto ||
  user?.patient?.profilePhoto ||
  user?.doctor?.profilePhoto;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-all duration-300">
      <nav className="bg-slate-950/80 backdrop-blur-xl border border-white/15 rounded-full px-6">
        <div className="flex justify-between items-center h-16">
          {/* 1. Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" aria-label="WellOra home" className="flex items-center">
              <Logo showSlogan={false} lightText={true} />
            </Link>
          </div>

          {/* 2. Main Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-7">
            <Link
              href="/available-today"
              className={`text-sm font-medium transition-all duration-200 ${
                isActive("/available-today")
                  ? "text-emerald-400 font-bold"
                  : "text-slate-200 hover:text-emerald-400"
              }`}
            >
              Available Today
            </Link>

            <Link
              href="/departments"
              className={`text-sm font-medium transition-all duration-200 ${
                isActive("/departments")
                  ? "text-emerald-400 font-bold"
                  : "text-slate-200 hover:text-emerald-400"
              }`}
            >
              Departments
            </Link>

            <Link
              href="/doctors"
              className={`text-sm font-medium transition-all duration-200 ${
                isActive("/doctors")
                  ? "text-emerald-400 font-bold"
                  : "text-slate-200 hover:text-emerald-400"
              }`}
            >
              Doctors
            </Link>

            {/* Dropdown Menu (More) */}
            <div
              ref={dropdownRef}
              className="relative py-2"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className={`flex items-center text-sm font-medium transition-colors duration-200 py-1 ${
                  isMoreActive
                    ? "text-emerald-400 font-bold"
                    : "text-slate-200 hover:text-emerald-400"
                }`}
              >
                <span>More</span>
                <ChevronDown
                  className={`ml-1 h-4 w-4 transform transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180 text-emerald-400" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-52 bg-slate-900 border border-white/10 rounded-2xl py-2 z-50 backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-150
                  before:absolute before:-top-3 before:left-0 before:w-full before:h-4 before:content-['']"
                >
                  {[
                    { href: "/services", label: "Services" },
                    { href: "/about-us", label: "About Us" },
                    { href: "/contact-us", label: "Contact Us" },
                    { href: "/help", label: "Help & Support" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsDropdownOpen(false)}
                      className={`block px-4 py-2.5 text-sm transition-colors ${
                        isActive(item.href)
                          ? "bg-emerald-500/20 text-emerald-400 font-bold border-l-4 border-emerald-500"
                          : "text-slate-200 hover:bg-slate-800 hover:text-emerald-400"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 3. Action Buttons / Profile Icon (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-10 h-10 rounded-full bg-slate-800 animate-pulse" />
            ) : user ? (
              <div ref={profileRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  aria-label="User Profile Menu"
                  className="flex items-center gap-2 p-1 pr-2.5 rounded-full bg-slate-900/90 border border-emerald-500/40 hover:border-emerald-400 transition-all"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-emerald-400"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <UserIcon className="w-4 h-4" />
                    </div>
                  )}
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-300 transition-transform ${
                      isProfileOpen ? "rotate-180 text-emerald-400" : ""
                    }`}
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-60 bg-slate-900 border border-white/10 rounded-2xl py-2 z-50 shadow-2xl backdrop-blur-2xl">
                    {/* User Info Header */}
                    <div className="px-4 py-2.5 border-b border-white/10">
                      <p className="text-xs font-bold text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400">
                        {user.role}
                      </span>
                    </div>

                    {/* Profile (/me) */}
                    <Link
                      href="/me"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-800 hover:text-emerald-400 transition-colors"
                    >
                      <UserCircle className="w-4 h-4" />
                      <span>My Profile</span>
                    </Link>

                    {/* Role-based Dashboard */}
                    <Link
                      href={getDashboardRoute()}
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-800 hover:text-emerald-400 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>

                    {/* Sign Out */}
                    <div className="border-t border-white/10 mt-1 pt-1">
                      <button
                        type="button"
                        onClick={async () => {
                          setIsProfileOpen(false);
                          await logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/apply-doctor"
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-colors duration-200 border ${
                    isActive("/apply-doctor")
                      ? "bg-emerald-500 text-slate-950 border-emerald-400"
                      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500 hover:text-slate-950 hover:border-emerald-400 active:scale-95"
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Join as Doctor</span>
                </Link>

                <Link
                  href="/login"
                  className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs sm:text-sm font-bold text-slate-950 transition-colors duration-200 ${
                    isActive("/login")
                      ? "bg-teal-400"
                      : "bg-teal-400 hover:bg-cyan-300 active:scale-95"
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="mt-2 md:hidden bg-slate-900 border border-white/10 rounded-3xl p-5 space-y-2 backdrop-blur-2xl">
          {[
            { href: "/available-today", label: "Available Today" },
            { href: "/departments", label: "Departments" },
            { href: "/doctors", label: "Doctors" },
            { href: "/services", label: "Services" },
            { href: "/about-us", label: "About Us" },
            { href: "/contact-us", label: "Contact Us" },
            { href: "/help", label: "Help & Support" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block py-2 px-3 rounded-xl text-base font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-emerald-500/20 text-emerald-400 font-bold"
                  : "text-slate-200 hover:text-emerald-400"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Action Buttons / User Info (Mobile Drawer) */}
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
            {user ? (
              <>
                <div className="px-3 py-2 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>
                </div>

                <Link
                  href="/me"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full bg-slate-800 text-slate-100 border border-white/10 text-sm font-bold"
                >
                  My Profile
                </Link>

                <Link
                  href={getDashboardRoute()}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full bg-emerald-500 text-slate-950 text-sm font-bold"
                >
                  Dashboard
                </Link>

                <button
                  type="button"
                  onClick={async () => {
                    setIsMobileMenuOpen(false);
                    await logout();
                  }}
                  className="w-full text-center py-2.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 text-sm font-bold"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/apply-doctor"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/40 text-sm font-bold hover:bg-emerald-500 hover:text-slate-950 transition-colors"
                >
                  Join as Doctor
                </Link>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full bg-teal-400 hover:bg-cyan-300 text-slate-950 text-sm font-bold transition-colors"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;