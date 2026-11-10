"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ChevronDown, UserPlus, LogIn } from "lucide-react";

import Logo from "../logo/logo";

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-all duration-300">
      <nav className="bg-slate-950/40 backdrop-blur-xl border border-white/15 rounded-full px-6 shadow-2xl shadow-black/40">
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
                  ? "text-emerald-400 font-semibold"
                  : "text-slate-200 hover:text-emerald-400"
              }`}
            >
              Available Today
            </Link>

            <Link
              href="/departments"
              className={`text-sm font-medium transition-all duration-200 ${
                isActive("/departments")
                  ? "text-emerald-400 font-semibold"
                  : "text-slate-200 hover:text-emerald-400"
              }`}
            >
              Departments
            </Link>

            <Link
              href="/doctors"
              className={`text-sm font-medium transition-all duration-200 ${
                isActive("/doctors")
                  ? "text-emerald-400 font-semibold"
                  : "text-slate-200 hover:text-emerald-400"
              }`}
            >
              Doctors
            </Link>

            {/* Dropdown Menu */}
            <div
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button
                type="button"
                className="flex items-center text-sm font-medium text-slate-200 hover:text-emerald-400 py-2 transition-colors duration-200"
              >
                <span>More</span>
                <ChevronDown
                  className={`ml-1 h-4 w-4 transform transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180 text-emerald-400" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu Overlay */}
              {isDropdownOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl py-2 z-50 backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-150">
                  <Link
                    href="/services"
                    className={`block px-4 py-2 text-sm transition-colors ${
                      isActive("/services")
                        ? "bg-emerald-500/10 text-emerald-400 font-semibold"
                        : "text-slate-300 hover:bg-slate-800/80 hover:text-emerald-400"
                    }`}
                  >
                    Services
                  </Link>

                  <Link
                    href="/about-us"
                    className={`block px-4 py-2 text-sm transition-colors ${
                      isActive("/about-us")
                        ? "bg-emerald-500/10 text-emerald-400 font-semibold"
                        : "text-slate-300 hover:bg-slate-800/80 hover:text-emerald-400"
                    }`}
                  >
                    About Us
                  </Link>

                  <Link
                    href="/contact-us"
                    className={`block px-4 py-2 text-sm transition-colors ${
                      isActive("/contact-us")
                        ? "bg-emerald-500/10 text-emerald-400 font-semibold"
                        : "text-slate-300 hover:bg-slate-800/80 hover:text-emerald-400"
                    }`}
                  >
                    Contact Us
                  </Link>

                  <Link
                    href="/help"
                    className={`block px-4 py-2 text-sm transition-colors ${
                      isActive("/help")
                        ? "bg-emerald-500/10 text-emerald-400 font-semibold"
                        : "text-slate-300 hover:bg-slate-800/80 hover:text-emerald-400"
                    }`}
                  >
                    Help & Support
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* 3. Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/apply-doctor"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-emerald-400 hover:text-white border border-emerald-500/40 hover:bg-emerald-600/20 transition-all duration-200"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Join as Doctor</span>
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm px-5 py-2 rounded-full transition-all shadow-lg shadow-emerald-600/30 hover:scale-[1.02] active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-800/60"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="mt-2 md:hidden bg-slate-900/95 border border-white/10 rounded-3xl p-5 space-y-3 backdrop-blur-2xl shadow-2xl">
          <Link
            href="/available-today"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-200 hover:text-emerald-400"
          >
            Available Today
          </Link>
          <Link
            href="/departments"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-200 hover:text-emerald-400"
          >
            Departments
          </Link>
          <Link
            href="/doctors"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-200 hover:text-emerald-400"
          >
            Doctors
          </Link>
          <Link
            href="/services"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-200 hover:text-emerald-400"
          >
            Services
          </Link>
          <Link
            href="/about-us"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-200 hover:text-emerald-400"
          >
            About Us
          </Link>
          <Link
            href="/contact-us"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-200 hover:text-emerald-400"
          >
            Contact Us
          </Link>

          <div className="pt-3 flex flex-col gap-2">
            <Link
              href="/apply-doctor"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-full text-emerald-400 border border-emerald-500/40 text-sm font-semibold"
            >
              Join as Doctor
            </Link>
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-full bg-emerald-600 text-white text-sm font-semibold"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;