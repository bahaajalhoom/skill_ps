import React from "react";
import Link from "next/link";
import { fetchSkillDetail } from "@/lib/ecosystem-client";
import { InstallCommandCard } from "@/components/InstallCommandCard";
import { SkillMarkdownViewer } from "@/components/SkillMarkdownViewer";
import { ArrowLeft, ShieldCheck, Github, ExternalLink } from "lucide-react";

export default async function SkillPage({
  params,
}: {
  params: Promise<{ owner: string; repo: string; skill: string }>;
}) {
  const { owner, repo, skill } = await params;
  const detail = await fetchSkillDetail(owner, repo, skill);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Breadcrumb Bar */}
      <div className="border-b border-white/10 bg-neutral-950/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs sm:text-sm font-mono text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Leaderboard</span>
          </Link>
          <div className="text-xs font-mono text-neutral-500">
            {detail.source} / {detail.name}
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
        {/* Header Title & Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl sm:text-4xl font-bold font-mono text-white tracking-tight">
              {detail.name}
            </h1>
            {detail.isOfficial && (
              <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Official Skill
              </span>
            )}
          </div>

          <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
            {detail.description}
          </p>

          <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
            <a
              href={detail.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors underline underline-offset-4"
            >
              <Github className="w-4 h-4" />
              <span>{detail.source}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <span>{detail.installs.toLocaleString()} Installs</span>
          </div>
        </div>

        {/* Multi-Agent Install Commands Box */}
        <div className="space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold">
            How to Install on Your AI Agent
          </h2>
          <InstallCommandCard
            commands={detail.installCommands}
            skillName={detail.name}
          />
        </div>

        {/* Security Audits */}
        {detail.securityAudits && (
          <div className="p-4 rounded-xl bg-neutral-900/40 border border-white/10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <span className="text-neutral-400 font-medium uppercase text-[11px]">
              Security Audits:
            </span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Agent Trust Hub: Pass
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Socket: Pass
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Snyk: Pass
              </span>
            </div>
          </div>
        )}

        {/* Instructions / SKILL.md Markdown */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h2 className="text-sm font-mono uppercase tracking-wider text-neutral-300 font-semibold">
            Documentation & Skill Workflows
          </h2>
          <SkillMarkdownViewer content={detail.markdownContent || ""} />
        </div>
      </main>
    </div>
  );
}
