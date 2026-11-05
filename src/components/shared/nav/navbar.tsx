"use client";

import Link from "next/link";
import { useState } from "react";

import Logo from "../logo/logo";

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* 1. Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" aria-label="WellOra home">
              <Logo />
            </Link>
          </div>

          {/* 2. Main Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/available-today"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Available Today
            </Link>
            
            <Link
              href="/departments"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Departments
            </Link>
            
            <Link
              href="/doctors"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Doctors
            </Link>

            {/* Dropdown for About Us, Services, Contact Us */}
            <div 
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button 
                className="flex items-center text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-200"
              >
                <span>More</span>
                <svg 
                  className={`ml-1 h-4 w-4 transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute left-0 w-48 bg-white border border-gray-100 rounded-lg shadow-lg py-2 z-10 animate-in fade-in slide-in-from-top-2 duration-150">
                  <Link
                    href="/services"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    Services
                  </Link>
                  <Link
                    href="/about-us"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    About Us
                  </Link>
                  <Link
                    href="/contact-us"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    Contact Us
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* 3. Sign In Button */}
          <div className="flex items-center">
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition-all shadow-sm hover:shadow"
            >
              Sign In
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;