"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown, UserPlus, LogIn } from "lucide-react";

import Logo from "../logo/logo";

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => pathname === path;

  // Check if any dropdown child route is active
  const isMoreActive =
    isActive("/services") ||
    isActive("/about-us") ||
    isActive("/contact-us") ||
    isActive("/help");

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
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

              {/* Dropdown Menu Overlay */}
              {isDropdownOpen && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-52 bg-slate-900 border border-white/10 rounded-2xl py-2 z-50 backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-150
                  before:absolute before:-top-3 before:left-0 before:w-full before:h-4 before:content-['']"
                >
                  <Link
                    href="/services"
                    onClick={() => setIsDropdownOpen(false)}
                    className={`block px-4 py-2.5 text-sm transition-colors ${
                      isActive("/services")
                        ? "bg-emerald-500/20 text-emerald-400 font-bold border-l-4 border-emerald-500"
                        : "text-slate-200 hover:bg-slate-800 hover:text-emerald-400"
                    }`}
                  >
                    Services
                  </Link>

                  <Link
                    href="/about-us"
                    onClick={() => setIsDropdownOpen(false)}
                    className={`block px-4 py-2.5 text-sm transition-colors ${
                      isActive("/about-us")
                        ? "bg-emerald-500/20 text-emerald-400 font-bold border-l-4 border-emerald-500"
                        : "text-slate-200 hover:bg-slate-800 hover:text-emerald-400"
                    }`}
                  >
                    About Us
                  </Link>

                  <Link
                    href="/contact-us"
                    onClick={() => setIsDropdownOpen(false)}
                    className={`block px-4 py-2.5 text-sm transition-colors ${
                      isActive("/contact-us")
                        ? "bg-emerald-500/20 text-emerald-400 font-bold border-l-4 border-emerald-500"
                        : "text-slate-200 hover:bg-slate-800 hover:text-emerald-400"
                    }`}
                  >
                    Contact Us
                  </Link>

                  <Link
                    href="/help"
                    onClick={() => setIsDropdownOpen(false)}
                    className={`block px-4 py-2.5 text-sm transition-colors ${
                      isActive("/help")
                        ? "bg-emerald-500/20 text-emerald-400 font-bold border-l-4 border-emerald-500"
                        : "text-slate-200 hover:bg-slate-800 hover:text-emerald-400"
                    }`}
                  >
                    Help & Support
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* 3. Action Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {/* Join as Doctor Button */}
            <Link
              href="/applyDoctor"
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-colors duration-200 border ${
                isActive("/applyDoctor")
                  ? "bg-emerald-500 text-slate-950 border-emerald-400"
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500 hover:text-slate-950 hover:border-emerald-400 active:scale-95"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Join as Doctor</span>
            </Link>

            {/* Sign In Button */}
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
          <Link
            href="/available-today"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block py-2 px-3 rounded-xl text-base font-medium transition-colors ${
              isActive("/available-today")
                ? "bg-emerald-500/20 text-emerald-400 font-bold"
                : "text-slate-200 hover:text-emerald-400"
            }`}
          >
            Available Today
          </Link>
          <Link
            href="/departments"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block py-2 px-3 rounded-xl text-base font-medium transition-colors ${
              isActive("/departments")
                ? "bg-emerald-500/20 text-emerald-400 font-bold"
                : "text-slate-200 hover:text-emerald-400"
            }`}
          >
            Departments
          </Link>
          <Link
            href="/doctors"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block py-2 px-3 rounded-xl text-base font-medium transition-colors ${
              isActive("/doctors")
                ? "bg-emerald-500/20 text-emerald-400 font-bold"
                : "text-slate-200 hover:text-emerald-400"
            }`}
          >
            Doctors
          </Link>
          <Link
            href="/services"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block py-2 px-3 rounded-xl text-base font-medium transition-colors ${
              isActive("/services")
                ? "bg-emerald-500/20 text-emerald-400 font-bold"
                : "text-slate-200 hover:text-emerald-400"
            }`}
          >
            Services
          </Link>
          <Link
            href="/about-us"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block py-2 px-3 rounded-xl text-base font-medium transition-colors ${
              isActive("/about-us")
                ? "bg-emerald-500/20 text-emerald-400 font-bold"
                : "text-slate-200 hover:text-emerald-400"
            }`}
          >
            About Us
          </Link>
          <Link
            href="/contact-us"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block py-2 px-3 rounded-xl text-base font-medium transition-colors ${
              isActive("/contact-us")
                ? "bg-emerald-500/20 text-emerald-400 font-bold"
                : "text-slate-200 hover:text-emerald-400"
            }`}
          >
            Contact Us
          </Link>
          <Link
            href="/help"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block py-2 px-3 rounded-xl text-base font-medium transition-colors ${
              isActive("/help")
                ? "bg-emerald-500/20 text-emerald-400 font-bold"
                : "text-slate-200 hover:text-emerald-400"
            }`}
          >
            Help & Support
          </Link>

          {/* Action Buttons (Mobile Drawer) */}
          <div className="pt-3 flex flex-col gap-2.5">
            <Link
              href="/applyDoctor"
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
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;