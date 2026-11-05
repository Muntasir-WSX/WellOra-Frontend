import React from "react";

interface LogoProps {
  className?: string;
  showSlogan?: boolean;
}

export default function Logo({ className = "", showSlogan = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Accurate Leaf & Cross SVG */}
      <svg
        width="44"
        height="44"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 drop-shadow-sm"
      >
        <defs>
          {/* Top-Right Light Leaf Gradient */}
          <linearGradient
            id="leafTopGradient"
            x1="30"
            y1="10"
            x2="85"
            y2="60"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#4ADE80" /> {/* Vibrant Light Mint */}
            <stop offset="100%" stopColor="#16A34A" /> {/* Emerald Green */}
          </linearGradient>

          {/* Bottom-Left Dark Leaf Gradient */}
          <linearGradient
            id="leafBottomGradient"
            x1="15"
            y1="40"
            x2="70"
            y2="85"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#16A34A" />
            <stop offset="100%" stopColor="#15803D" /> {/* Forest Deep Green */}
          </linearGradient>
        </defs>

        {/* Outer Organic Leaf Geometry */}
        {/* Top-Right Wing */}
        <path
          d="M 18 78 C 30 35, 62 12, 88 12 C 88 12, 88 48, 18 78 Z"
          fill="url(#leafTopGradient)"
        />

        {/* Bottom-Left Wing */}
        <path
          d="M 18 78 C 12 55, 22 25, 48 12 C 28 35, 14 58, 18 78 Z"
          fill="url(#leafBottomGradient)"
        />

        {/* Embedded Solid Medical Cross (White) */}
        <g fill="#FFFFFF">
          {/* Vertical Bar */}
          <rect x="42" y="30" width="16" height="40" rx="4" />
          {/* Horizontal Bar */}
          <rect x="30" y="42" width="40" height="16" rx="4" />
        </g>

        {/* Diagonal Negative Space Cut Through Leaf & Cross */}
        <line
          x1="12"
          y1="84"
          x2="64"
          y2="24"
          stroke="#FFFFFF"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>

      {/* Brand Name & Slogan */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center tracking-tight leading-none">
          <span className="text-2xl font-extrabold text-[#0F172A]">
            Well
          </span>
          <span className="text-2xl font-extrabold text-[#16A34A]">
            Ora
          </span>
        </div>
        
        {showSlogan && (
          <p className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase mt-1">
            Your health is our priority
          </p>
        )}
      </div>
    </div>
  );
}