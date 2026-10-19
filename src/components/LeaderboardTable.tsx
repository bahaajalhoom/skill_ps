"use client";

import React, { useState } from "react";
import { SkillLeaderboardItem } from "@/types/skills";
import { Sparkline } from "./Sparkline";
import { Copy, Check, ShieldCheck, UserCheck, Terminal, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface LeaderboardTableProps {
  skills: SkillLeaderboardItem[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onSelectSkill: (skill: SkillLeaderboardItem) => void;
}

export function LeaderboardTable({
  skills,
  isLoading,
  hasMore,
  onLoadMore,
  onSelectSkill,
}: LeaderboardTableProps) {
  const { t } = useLanguage();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCommand = (e: React.MouseEvent, skill: SkillLeaderboardItem) => {
    e.stopPropagation();
    const cmd = `npx skills add https://github.com/${skill.source} --skill ${skill.skillId}`;
    navigator.clipboard.writeText(cmd);
    setCopiedId(skill.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatInstalls = (num: number): string => {
    if (!num) return "1.2K";
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="w-full">
      {/* Table Header */}
      <div className="hidden sm:grid grid-cols-12 gap-4 border-b border-white/10 py-3 text-xs font-mono font-medium uppercase text-neutral-500">
        <div className="col-span-1 text-center">{t("rankCol")}</div>
        <div className="col-span-6">{t("skillCol")}</div>
        <div className="col-span-3 text-right">{t("activityCol")}</div>
        <div className="col-span-2 text-right">{t("installsCol")}</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/5">
        {skills.map((skill, index) => {
          const rank = index + 1;
          const isCopied = copiedId === skill.id;

          return (
            <div
              key={skill.id || `${skill.source}-${skill.skillId}-${index}`}
              onClick={() => onSelectSkill(skill)}
              className="group grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4 py-3 sm:py-3.5 hover:bg-neutral-900/50 transition-colors cursor-pointer px-2 sm:px-3 rounded-lg"
            >
              {/* Rank */}
              <div className="hidden sm:flex col-span-1 items-center justify-center font-mono text-sm text-neutral-500 group-hover:text-neutral-300">
                {rank}
              </div>

              {/* Skill details */}
              <div className="col-span-6 min-w-0 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="sm:hidden font-mono text-xs text-neutral-500">
                    #{rank}
                  </span>
                  <h3 className="font-semibold text-white font-mono text-sm sm:text-base group-hover:text-emerald-400 transition-colors truncate">
                    {skill.name}
                  </h3>
                  {skill.isOfficial && (
                    <span
                      title="Verified Official Skill"
                      className="inline-flex text-blue-400 shrink-0"
                    >
                      <ShieldCheck className="w-4 h-4" />
                    </span>
                  )}
                  {skill.isCustom && (
                    <span className="px-1.5 py-0.5 text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded">
                      custom
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-500 font-mono truncate">
                  {skill.source}
                </p>
                {skill.description && (
                  <p className="sm:hidden text-xs text-neutral-400 line-clamp-1 mt-0.5">
                    {skill.description}
                  </p>
                )}
              </div>

              {/* Sparkline Graph */}
              <div className="col-span-3 hidden sm:flex items-center justify-end">
                <Sparkline data={skill.weeklyInstalls} />
              </div>

              {/* Installs & Copy Action */}
              <div className="col-span-2 flex items-center justify-between sm:justify-end gap-3 font-mono text-xs sm:text-sm text-neutral-300">
                <span className="font-medium text-white">
                  {formatInstalls(skill.installs)}
                </span>

                <button
                  onClick={(e) => handleCopyCommand(e, skill)}
                  title={isCopied ? t("copied") : t("copyCommand")}
                  className={`p-1.5 rounded border transition-all ${
                    isCopied
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                      : "bg-neutral-900 border-white/10 text-neutral-400 hover:text-white hover:border-white/30"
                  }`}
                >
                  {isCopied ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Infinite Scroll / Load More trigger */}
      <div className="py-8 text-center">
        {hasMore ? (
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="px-6 py-2 rounded-md bg-neutral-900 border border-white/10 hover:border-white/30 text-white font-mono text-xs transition-all hover:bg-neutral-800 disabled:opacity-50"
          >
            {isLoading ? t("loadMore") : "Load More Skills ↓"}
          </button>
        ) : skills.length > 0 ? (
          <p className="text-xs font-mono text-neutral-600">
            — End of catalog —
          </p>
        ) : null}
      </div>
    </div>
  );
}
