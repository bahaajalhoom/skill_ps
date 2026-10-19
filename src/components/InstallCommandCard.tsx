"use client";

import React, { useState } from "react";
import { MultiAgentInstallCommands } from "@/types/skills";
import { Copy, Check, Terminal, ExternalLink } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface InstallCommandCardProps {
  commands: MultiAgentInstallCommands;
  skillName: string;
}

type AgentTab = "cli" | "claudeCode" | "cursor" | "antigravity" | "windsurf" | "copilot";

export function InstallCommandCard({ commands, skillName }: InstallCommandCardProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<AgentTab>("cli");
  const [isCopied, setIsCopied] = useState(false);

  const tabs: { id: AgentTab; label: string; agentName: string }[] = [
    { id: "cli", label: "Skills CLI", agentName: "CLI" },
    { id: "claudeCode", label: "Claude Code", agentName: "Claude" },
    { id: "cursor", label: "Cursor", agentName: "Cursor" },
    { id: "antigravity", label: "Antigravity", agentName: "Gemini / AGY" },
    { id: "windsurf", label: "Windsurf", agentName: "Windsurf" },
    { id: "copilot", label: "GitHub Copilot", agentName: "Copilot" },
  ];

  const currentCommand = commands[activeTab] || commands.cli;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCommand);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-xl bg-neutral-950 border border-white/10 overflow-hidden shadow-xl">
      {/* Tab Switcher */}
      <div className="flex items-center gap-1 p-1.5 border-b border-white/10 bg-neutral-900/50 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setIsCopied(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-white text-black font-semibold shadow-sm"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Code Display Area */}
      <div className="relative p-4 bg-black/60 font-mono text-xs sm:text-sm text-neutral-200">
        <pre className="overflow-x-auto whitespace-pre-wrap leading-relaxed text-emerald-400 select-all pr-12">
          {currentCommand}
        </pre>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className={`absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all ${
            isCopied
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              : "bg-neutral-900 border border-white/10 text-neutral-300 hover:text-white hover:border-white/25"
          }`}
        >
          {isCopied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>{t("copied")}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>{t("copyCommand")}</span>
            </>
          )}
        </button>
      </div>

      {/* Bottom Hint */}
      <div className="px-4 py-2 border-t border-white/5 bg-neutral-900/30 flex items-center justify-between text-[11px] font-mono text-neutral-500">
        <span>Runs in your project root or workspace</span>
        <span className="text-neutral-400">Target: {tabs.find((t) => t.id === activeTab)?.agentName}</span>
      </div>
    </div>
  );
}
