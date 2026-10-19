"use client";

import React from "react";

interface PalestineFlagProps {
  className?: string;
  width?: number;
  height?: number;
}

export function PalestineFlag({
  className = "w-6 h-4",
  width = 24,
  height = 16,
}: PalestineFlagProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-sm border border-white/20 shadow-sm shrink-0 ${className}`}
      style={{ width, height }}
      title="فلسطين 🇵🇸 Palestine"
    >
      <svg
        viewBox="0 0 24 16"
        width={width}
        height={height}
        className="w-full h-full block"
      >
        {/* Top Stripe: Black */}
        <rect x="0" y="0" width="24" height="5.33" fill="#000000" />
        {/* Middle Stripe: White */}
        <rect x="0" y="5.33" width="24" height="5.34" fill="#FFFFFF" />
        {/* Bottom Stripe: Green */}
        <rect x="0" y="10.67" width="24" height="5.33" fill="#007A3D" />
        {/* Red Triangle */}
        <polygon points="0,0 10,8 0,16" fill="#E4312B" />
      </svg>
    </div>
  );
}
