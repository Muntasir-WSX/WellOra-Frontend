import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import Logo from "../logo/logo";

function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800/80 relative overflow-hidden">
      {/* Background Subtle Gradient Overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-emerald-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Upper Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 mb-12">
          
          {/* 1. Logo & Short Bio */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="inline-block">
              <Logo />
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Your trusted partner for effortless online doctor appointments, 20-minute consultation slot management, and instant digital e-prescriptions.
            </p>
          </div>

          {/* 2. Quick Links */}
          <div className="md:col-span-2">
            <h3 className="text-white text-sm font-bold tracking-wider uppercase mb-4 text-emerald-400">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/available-today" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Available Today
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Find Doctors
                </Link>
              </li>
              <li>
                <Link href="/departments" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Departments
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Services
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Company & Support */}
          <div className="md:col-span-2">
            <h3 className="text-white text-sm font-bold tracking-wider uppercase mb-4 text-emerald-400">
              Company
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/about-us" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. Contact & Emergency */}
          <div className="md:col-span-4">
            <h3 className="text-white text-sm font-bold tracking-wider uppercase mb-4 text-emerald-400">
              Get in Touch
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-center space-x-3 text-slate-300">
                <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Chattogram, Bangladesh</span>
              </li>
              <li className="flex items-center space-x-3 text-slate-300">
                <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Hotline: +880 1700-000000</span>
              </li>
              <li className="flex items-center space-x-3 text-slate-300">
                <Mail className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>
                  Support:{" "}
                  <a
                    href="mailto:info@wellora.com"
                    className="hover:text-emerald-400 transition-colors"
                  >
                    info@wellora.com
                  </a>
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Divider */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} WellOra Healthcare System. All rights reserved.</p>

          <div className="flex space-x-6">
            <Link href="/privacy-policy" className="hover:text-emerald-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-emerald-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-emerald-400 transition-colors">
              Cookies Policy
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;