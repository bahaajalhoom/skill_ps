"use client";

import React from "react";

export function AsciiBanner() {
  const art = `███████╗██╗  ██╗██╗██╗     ██╗     ███████╗
██╔════╝██║ ██╔╝██║██║     ██║     ██╔════╝
███████╗█████╔╝ ██║██║     ██║     ███████╗
╚════██║██╔═██╗ ██║██║     ██║     ╚════██║
███████║██║  ██╗██║███████╗███████╗███████║
╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚══════╝`;

  return (
    <div dir="ltr" className="relative w-full flex items-start justify-center lg:justify-start overflow-hidden select-none">
      <div className="relative max-w-[320px] lg:max-w-[420px] overflow-hidden">
        <pre dir="ltr" className="text-[12px] sm:text-[13px] lg:text-[15px] tracking-[-1px] leading-[125%] font-mono text-white/90 drop-shadow-[0_0_12px_rgba(255,255,255,0.15)] whitespace-pre text-left">
          {art}
        </pre>
      </div>
    </div>
  );
}
