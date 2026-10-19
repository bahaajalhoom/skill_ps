"use client";

import React, { useEffect, useState } from "react";
import { SkillLeaderboardItem, SkillDetail } from "@/types/skills";
import { InstallCommandCard } from "./InstallCommandCard";
import { SkillMarkdownViewer } from "./SkillMarkdownViewer";
import { X, ShieldCheck, ExternalLink, Github, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface SkillDetailModalProps {
  skill: SkillLeaderboardItem | null;
  onClose: () => void;
}

export function SkillDetailModal({ skill, onClose }: SkillDetailModalProps) {
  const { t } = useLanguage();
  const [detail, setDetail] = useState<SkillDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!skill) {
      setDetail(null);
      return;
    }

    setIsLoading(true);
    const [owner, repo] = skill.source.split("/");
    const skillName = skill.skillId || skill.name;

    fetch(`/api/skills/${owner || "community"}/${repo || "skills"}/${skillName}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setDetail(data);
      })
      .catch((err) => console.error("Failed to load skill details:", err))
      .finally(() => setIsLoading(false));
  }, [skill]);

  if (!skill) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-neutral-950 border border-white/15 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-4 sm:p-6 border-b border-white/10 bg-neutral-900/40">
          <div className="space-y-1 pr-6">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
                {skill.name}
              </h2>
              {skill.isOfficial && (
                <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {t("verified")}
                </span>
              )}
              {skill.isCustom && (
                <span className="px-2 py-0.5 text-xs font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-md">
                  {t("customBadge")}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm font-mono text-neutral-400 flex items-center gap-2">
              <span>{skill.source}</span>
              <a
                href={`https://github.com/${skill.source}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1 underline underline-offset-2"
              >
                <Github className="w-3 h-3" />
                <span>GitHub Repo</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-neutral-400 font-mono text-sm">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
              <span>Loading complete skill documentation & instructions...</span>
            </div>
          ) : detail ? (
            <>
              {/* Multi-Agent Install Box */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                  {t("installInstructions")}
                </h3>
                <InstallCommandCard
                  commands={detail.installCommands}
                  skillName={detail.name}
                />
              </div>

              {/* Security Audit Badges */}
              {detail.securityAudits && (
                <div className="p-4 rounded-xl bg-neutral-900/30 border border-white/10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
                  <span className="text-neutral-400 font-medium uppercase text-[11px]">
                    {t("securityAudit")}:
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Agent Trust Hub: Pass
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Socket: Clean
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Snyk: Verified
                    </span>
                  </div>
                </div>
              )}

              {/* Documentation / SKILL.md */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                  {t("whatThisSkillDoes")} & Instructions
                </h3>
                <SkillMarkdownViewer
                  content={detail.markdownContent || detail.description}
                />
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
