"use client";

import React from "react";

interface AgentItem {
  name: string;
  badge: string;
  color: string;
  iconChar: string;
}

const AGENTS: AgentItem[] = [
  { name: "Claude Code", badge: "Anthropic", color: "#d97706", iconChar: "C" },
  { name: "Cursor", badge: "Anysphere", color: "#3b82f6", iconChar: "⚡" },
  { name: "Antigravity", badge: "Google DeepMind", color: "#10b981", iconChar: "▲" },
  { name: "GitHub Copilot", badge: "Microsoft", color: "#8b5cf6", iconChar: "🐙" },
  { name: "Windsurf", badge: "Codeium", color: "#06b6d4", iconChar: "🌊" },
  { name: "Gemini CLI", badge: "Google", color: "#6366f1", iconChar: "✦" },
  { name: "Cline", badge: "VSCode", color: "#f43f5e", iconChar: "◆" },
  { name: "OpenClaw", badge: "Community", color: "#eab308", iconChar: "🦀" },
  { name: "Zed", badge: "Rust Native", color: "#ec4899", iconChar: "Z" },
];

export function AgentCarousel() {
  const displayList = [...AGENTS, ...AGENTS, ...AGENTS];

  return (
    <div className="relative w-full overflow-hidden py-2 select-none">
      {/* Edge Gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

      <div className="animate-carousel flex items-center gap-3">
        {displayList.map((agent, index) => (
          <div
            key={`${agent.name}-${index}`}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-neutral-900/70 border border-white/10 hover:border-white/30 transition-all hover:bg-neutral-800/80 cursor-default shrink-0 group"
          >
            <div
              className="w-7 h-7 rounded flex items-center justify-center font-bold text-xs font-mono transition-transform group-hover:scale-110"
              style={{ backgroundColor: `${agent.color}22`, color: agent.color }}
            >
              {agent.iconChar}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-neutral-200 font-mono tracking-tight group-hover:text-white">
                {agent.name}
              </span>
              <span className="text-[10px] text-neutral-500 font-mono">
                {agent.badge}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
