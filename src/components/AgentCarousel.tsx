"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ALL_AGENTS, AgentInfo } from "@/data/agents";
import { AgentDetailModal } from "./AgentDetailModal";
import { useLanguage } from "@/context/LanguageContext";

interface AgentCarouselProps {
  onSelectAgent?: (agent: AgentInfo) => void;
}

export function AgentCarousel({ onSelectAgent }: AgentCarouselProps) {
  const { isRtl } = useLanguage();
  const [activeAgent, setActiveAgent] = useState<AgentInfo | null>(null);

  // Triple for seamless continuous infinite scroll
  const displayList = [...ALL_AGENTS, ...ALL_AGENTS, ...ALL_AGENTS];

  const handleAgentClick = (agent: AgentInfo, e: React.MouseEvent) => {
    e.preventDefault();
    if (onSelectAgent) {
      onSelectAgent(agent);
    } else {
      setActiveAgent(agent);
    }
  };

  return (
    <>
      <div className="relative w-full overflow-hidden py-3 select-none group">
        {/* Edge Gradients for smooth fade */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none" />

        <div className="animate-carousel flex items-center gap-3 w-max group-hover:[animation-play-state:paused]">
          {displayList.map((agent, index) => (
            <Link
              key={`${agent.slug}-${index}`}
              href={`/agent/${agent.slug}`}
              onClick={(e) => handleAgentClick(agent, e)}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-emerald-500/40 hover:bg-neutral-800/80 transition-all cursor-pointer shrink-0 group/item shadow-sm hover:shadow-emerald-500/10"
              title={isRtl ? `عرض مهارات ${agent.name} وطريقة التثبيت` : `View skills and installation for ${agent.name}`}
            >
              <div className="w-6 h-6 rounded-lg bg-neutral-950/80 border border-neutral-800 flex items-center justify-center p-1 transition-transform group-hover/item:scale-110 shrink-0">
                <Image
                  src={agent.icon}
                  alt={agent.name}
                  width={18}
                  height={18}
                  className="object-contain"
                />
              </div>

              <div className="flex flex-col">
                <span className="text-xs font-medium text-neutral-200 font-mono tracking-tight group-hover/item:text-white transition-colors">
                  {agent.name}
                </span>
                {agent.badge && (
                  <span className="text-[10px] text-neutral-500 font-mono">
                    {agent.badge}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Interactive Modal when clicked from carousel */}
      {activeAgent && (
        <AgentDetailModal
          agent={activeAgent}
          onClose={() => setActiveAgent(null)}
          onSelectAgent={(newAgent) => setActiveAgent(newAgent)}
        />
      )}
    </>
  );
}
