import Link from "next/link";

import Logo from "../logo/logo";
import { Mail } from "lucide-react";


function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Upper Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* 1. Logo & Short Bio */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <Logo />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your trusted partner for effortless online doctor appointments, healthcare schedules, and instant medical support.
            </p>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h3 className="text-white text-base font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="/available-today" className="hover:text-blue-400 transition-colors">Available Today</a>
              </li>
              <li>
                <a href="/doctors" className="hover:text-blue-400 transition-colors">Find Doctors</a>
              </li>
              <li>
                <a href="/departments" className="hover:text-blue-400 transition-colors">Departments</a>
              </li>
              <li>
                <a href="/services" className="hover:text-blue-400 transition-colors">Services</a>
              </li>
            </ul>
          </div>

          {/* 3. Company & Support */}
          <div>
            <h3 className="text-white text-base font-semibold mb-4">Company</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="/about-us" className="hover:text-blue-400 transition-colors">About Us</a>
              </li>
              <li>
                <a href="/contact-us" className="hover:text-blue-400 transition-colors">Contact Us</a>
              </li>
              <li>
                <a href="/privacy-policy" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</a>
              </li>
            </ul>
          </div>

          {/* 4. Contact & Emergency */}
          <div>
            <h3 className="text-white text-base font-semibold mb-4">Get in Touch</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center space-x-2">
                <span> Chattogram, Bangladesh</span>
              </li>
              <li className="flex items-center space-x-2">
                <span> Hotline: +880 1700-000000</span>
              </li>
              <li className="flex items-center space-x-2.5 text-sm text-slate-300">
  <Mail className="h-4 w-4 text-emerald-400 shrink-0" />
  <span>Support: <a href="mailto:info@wellora.com" className="hover:text-emerald-400 transition-colors">info@wellora.com</a></span>
</li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {new Date().getFullYear()} WellOra Healthcare System. All rights reserved.</p>

          <div className="flex space-x-6 justify-center mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookies Policy</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;