"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Search, Plus, Globe, Terminal, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import { PalestineFlag } from "./PalestineFlag";

interface NavbarProps {
  onOpenSearch?: () => void;
  onOpenAddModal?: () => void;
}

export function Navbar({ onOpenSearch, onOpenAddModal }: NavbarProps) {
  const { lang, toggleLanguage, t } = useLanguage();

  // Listen for '/' key shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        onOpenSearch?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpenSearch]);

  return (
    <header className="sticky top-0 z-40 w-full bg-black/85 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto h-14 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <PalestineFlag width={26} height={17} className="transition-transform group-hover:scale-105" />
            <span className="text-neutral-500 font-mono text-sm">/</span>
            <span className="font-semibold tracking-tight text-white font-mono text-base group-hover:text-neutral-300 transition-colors">
              {t("siteTitle")}
            </span>
          </Link>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {lang === "ar" ? "المنظومة الحية" : "Live Ecosystem"}
          </span>
          <Link
            href="/agent"
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono text-neutral-400 hover:text-white hover:bg-neutral-900/80 border border-transparent hover:border-neutral-800 transition-colors"
          >
            <span className="text-emerald-400">🤖</span>
            <span>{lang === "ar" ? "الوكلاء" : "Agents"}</span>
          </Link>
        </div>

        {/* Global Search Bar (Trigger) */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-md bg-neutral-900/80 border border-white/10 hover:border-white/25 text-neutral-400 text-xs font-mono transition-all group"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white transition-colors" />
              <span className="group-hover:text-neutral-300">
                {t("searchPlaceholder")}
              </span>
            </span>
            <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-white/10 text-[10px] text-neutral-400">
              /
            </kbd>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSearch}
            aria-label="Search"
            className="md:hidden p-2 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-900 border border-white/10"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white text-black hover:bg-neutral-200 text-xs font-mono font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t("addSkill")}</span>
          </button>

          <button
            onClick={toggleLanguage}
            title="Toggle Language (العربية / English)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-white/10 hover:border-white/25 text-neutral-300 hover:text-white text-xs font-mono transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-neutral-400" />
            <span>{lang === "en" ? "العربية" : "English"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
