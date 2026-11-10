import React from "react";

interface LogoProps {
  className?: string;
  showSlogan?: boolean;
  lightText?: boolean;
}

export default function Logo({
  className = "",
  showSlogan = true,
  lightText = true, // Default to true for dark/transparent navbar
}: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Modern Minimalist SVG Icon */}
      <svg
        width="38"
        height="38"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 transition-transform duration-300 hover:scale-105 drop-shadow-md"
      >
        <defs>
          <linearGradient
            id="welloraFreshGrad"
            x1="0"
            y1="0"
            x2="100"
            y2="100"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>

        <path
          d="M 50 10 C 25 10, 10 35, 10 60 C 10 80, 25 90, 50 90 C 75 90, 90 75, 90 50 C 90 25, 75 10, 50 10 Z"
          fill="url(#welloraFreshGrad)"
        />

        <g fill="#FFFFFF">
          <rect x="44" y="32" width="12" height="36" rx="6" />
          <rect x="32" y="44" width="36" height="12" rx="6" />
        </g>
      </svg>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center tracking-tight leading-none text-2xl font-black">
          <span className={lightText ? "text-white" : "text-slate-900"}>
            Well
          </span>
          <span className="text-emerald-400">Ora</span>
        </div>

        {showSlogan && (
          <p
            className={`text-[9px] font-bold tracking-[0.15em] uppercase mt-1 ${
              lightText ? "text-slate-300" : "text-slate-500"
            }`}
          >
            Health & Wellness
          </p>
        )}
      </div>
    </div>
  );
}