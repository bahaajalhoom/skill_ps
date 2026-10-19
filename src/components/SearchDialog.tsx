"use client";

import React, { useEffect, useState, useRef } from "react";
import { Search, X, Terminal, ArrowUpRight, Check, Loader2 } from "lucide-react";
import { SkillLeaderboardItem } from "@/types/skills";
import { useLanguage } from "@/context/LanguageContext";

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSkill: (skill: SkillLeaderboardItem) => void;
}

export function SearchDialog({ isOpen, onClose, onSelectSkill }: SearchDialogProps) {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SkillLeaderboardItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const handler = setTimeout(async () => {
      try {
        const res = await fetch(`/api/skills/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.skills || []);
        }
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(handler);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl bg-neutral-950 border border-white/15 rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-neutral-900/40">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-neutral-500 focus:outline-none font-mono"
          />
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-neutral-400 animate-spin shrink-0" />
          ) : query ? (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-[11px] font-mono text-neutral-400 bg-neutral-800 border border-white/10 rounded">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto divide-y divide-white/5 p-2">
          {isLoading && results.length === 0 ? (
            <div className="py-12 text-center text-sm font-mono text-neutral-500">
              {t("loadMore")}
            </div>
          ) : results.length > 0 ? (
            results.map((skill) => (
              <div
                key={skill.id}
                onClick={() => {
                  onSelectSkill(skill);
                  onClose();
                }}
                className="group flex items-center justify-between p-3 rounded-lg hover:bg-neutral-900 transition-colors cursor-pointer"
              >
                <div className="min-w-0 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors truncate">
                      {skill.name}
                    </span>
                    <span className="text-xs font-mono text-neutral-500 truncate">
                      {skill.source}
                    </span>
                    {skill.isOfficial && (
                      <span className="px-1.5 py-0.5 text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">
                        verified
                      </span>
                    )}
                  </div>
                  {skill.description && (
                    <p className="text-xs text-neutral-400 truncate mt-1">
                      {skill.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-mono text-neutral-400">
                    {skill.installs > 0 ? skill.installs.toLocaleString() : "1.2K"} installs
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors" />
                </div>
              </div>
            ))
          ) : query ? (
            <div className="py-12 text-center text-sm font-mono text-neutral-500">
              {t("noSkillsFound")}
            </div>
          ) : (
            <div className="py-8 text-center text-xs font-mono text-neutral-500">
              Type any skill name (e.g. <span className="text-neutral-300">find-skills</span>, <span className="text-neutral-300">grill-me</span>, <span className="text-neutral-300">react</span>, <span className="text-neutral-300">browser</span>)...
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-white/5 bg-neutral-950 text-[11px] font-mono text-neutral-500">
          <span>{t("totalSkillsCount")}</span>
          <button onClick={onClose} className="hover:text-white">
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
}
