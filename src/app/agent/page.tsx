import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ALL_AGENTS } from "@/data/agents";
import { Navbar } from "@/components/Navbar";
import { ChevronRight, Terminal, ArrowRight, Bot } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Agents | skill_ps",
  description: "Every AI coding agent that supports the open skills CLI and ecosystem.",
};

export default function AgentsDirectoryPage() {
  return (
    <div className="min-h-screen bg-black text-neutral-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col gap-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-neutral-500">
          <Link href="/" className="hover:text-neutral-300 transition-colors">
            skills
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
          <span className="text-neutral-300 font-medium">agents</span>
        </nav>

        {/* Header */}
        <header className="flex flex-col gap-2 pb-6 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Bot className="w-6 h-6" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
              Agents
            </h1>
          </div>
          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl">
            Every AI coding agent that supports the open <code className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono text-xs">skills</code> CLI. Install once, use across every session.
          </p>
        </header>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALL_AGENTS.map((agent) => (
            <Link
              key={agent.slug}
              href={`/agent/${agent.slug}`}
              className="flex flex-col justify-between p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 hover:border-emerald-500/40 hover:bg-neutral-800/50 transition-all group shadow-sm hover:shadow-emerald-500/5"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center p-2.5 transition-transform group-hover:scale-105 shrink-0">
                    <Image
                      src={agent.icon}
                      alt={agent.name}
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </div>
                  {agent.badge && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-900 text-neutral-400 border border-neutral-800">
                      {agent.badge}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <h2 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors font-mono">
                    {agent.name}
                  </h2>
                  <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                    {agent.intro}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-neutral-800/60 text-xs font-mono text-neutral-500 group-hover:text-neutral-300 transition-colors">
                <span className="text-[11px] truncate max-w-[200px]">
                  {agent.websiteName}
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                  <span>View</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
