"use client";

import React from "react";
import { LeaderboardView } from "@/types/skills";
import { useLanguage } from "@/context/LanguageContext";
import { Sparkles, TrendingUp, Flame, UserCheck } from "lucide-react";

interface TabSelectorProps {
  currentView: LeaderboardView;
  onSelectView: (view: LeaderboardView) => void;
  totalCount?: number;
}

export function TabSelector({
  currentView,
  onSelectView,
  totalCount = 1409643,
}: TabSelectorProps) {
  const { t } = useLanguage();

  const tabs: { id: LeaderboardView; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: "all-time",
      label: t("allTime"),
      badge: `(${totalCount.toLocaleString()})`,
      icon: <Sparkles className="w-3.5 h-3.5" />,
    },
    {
      id: "trending",
      label: t("trending"),
      icon: <TrendingUp className="w-3.5 h-3.5" />,
    },
    {
      id: "hot",
      label: t("hot"),
      icon: <Flame className="w-3.5 h-3.5" />,
    },
    {
      id: "custom",
      label: t("customSkills"),
      icon: <UserCheck className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div className="flex items-center gap-2 sm:gap-6 border-b border-white/10 pb-2 overflow-x-auto select-none no-scrollbar">
      {tabs.map((tab) => {
        const isActive = currentView === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectView(tab.id)}
            className={`flex items-center gap-1.5 pb-2 font-mono text-xs sm:text-sm whitespace-nowrap transition-colors relative ${
              isActive
                ? "text-white font-medium"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <span className={isActive ? "text-emerald-400" : "text-neutral-600"}>
              {tab.icon}
            </span>
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="text-[11px] text-neutral-500">{tab.badge}</span>
            )}
            {isActive && (
              <span className="absolute bottom-[-9px] left-0 right-0 h-[2px] bg-white rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}
