"use client";

import React, { useEffect, useState, useCallback } from "react";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import { Navbar } from "@/components/Navbar";
import { AsciiBanner } from "@/components/AsciiBanner";
import { AgentCarousel } from "@/components/AgentCarousel";
import { TabSelector } from "@/components/TabSelector";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { SearchDialog } from "@/components/SearchDialog";
import { SkillDetailModal } from "@/components/SkillDetailModal";
import { AddSkillModal } from "@/components/AddSkillModal";
import { LeaderboardView, SkillLeaderboardItem } from "@/types/skills";
import { Copy, Check, Terminal, Search } from "lucide-react";

import { apiFetch } from "@/lib/api-config";

function HomePageContent() {
  const { t } = useLanguage();

  const [currentView, setCurrentView] = useState<LeaderboardView>("all-time");
  const [skills, setSkills] = useState<SkillLeaderboardItem[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [cacheByView, setCacheByView] = useState<
    Record<string, { skills: SkillLeaderboardItem[]; page: number; hasMore: boolean }>
  >({});

  // Fixed global ecosystem total matching skills.sh
  const totalSkills = currentView === "custom" ? skills.length : 1409643;

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<SkillLeaderboardItem | null>(null);

  // Try it now quick copy
  const [copiedTryCommand, setCopiedTryCommand] = useState(false);
  const tryCommand = "npx skills add vercel-labs/skills/find-skills";

  const fetchSkillsForView = useCallback(
    async (view: LeaderboardView, pageNum: number, append = false) => {
      setIsLoading(true);
      try {
        const res = await apiFetch(`/api/skills?view=${view}&page=${pageNum}`);
        if (res.ok) {
          const data = await res.json();
          let newSkills: SkillLeaderboardItem[] = Array.isArray(data.skills) ? data.skills : [];

          // For custom view: merge server skills with browser-persisted custom skills
          if (view === "custom" && typeof window !== "undefined") {
            try {
              const localRaw = localStorage.getItem("skillps_user_skills");
              if (localRaw) {
                const localList = JSON.parse(localRaw);
                if (Array.isArray(localList)) {
                  const map = new Map<string, SkillLeaderboardItem>();
                  for (const s of localList) {
                    // Only keep legitimate custom skills, never store or override official ones
                    if (s && s.id && s.isCustom && s.source !== "vercel-labs/skills") {
                      map.set(s.id, s);
                    }
                  }
                  for (const s of newSkills) {
                    if (s && s.id) map.set(s.id, s);
                  }
                  newSkills = Array.from(map.values());
                }
              }
            } catch {}
          }
          
          setSkills((prev) => {
            const updated = append ? [...prev, ...newSkills] : newSkills;
            // Update cache
            setCacheByView((c) => ({
              ...c,
              [view]: { skills: updated, page: pageNum, hasMore: data.hasMore ?? true },
            }));
            return updated;
          });
          setHasMore(data.hasMore ?? true);
        }
      } catch (err) {
        console.error("Failed to fetch skills:", err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Switch tabs with instantaneous cache or immediate skeleton loading
  const handleSelectView = (newView: LeaderboardView) => {
    if (newView === currentView) return;
    setCurrentView(newView);

    if (cacheByView[newView]) {
      // Instant switch from cache
      setSkills(cacheByView[newView].skills);
      setPage(cacheByView[newView].page);
      setHasMore(cacheByView[newView].hasMore);
      setIsLoading(false);
    } else {
      // Immediately clear and show skeleton loader
      setSkills([]);
      setPage(0);
      setIsLoading(true);
      fetchSkillsForView(newView, 0, false);
    }
  };

  useEffect(() => {
    // Initial fetch on mount
    fetchSkillsForView("all-time", 0, false);
  }, [fetchSkillsForView]);

  const handleLoadMore = () => {
    if (isLoading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchSkillsForView(currentView, nextPage, true);
  };

  const handleCopyTryCommand = () => {
    navigator.clipboard.writeText(tryCommand);
    setCopiedTryCommand(true);
    setTimeout(() => setCopiedTryCommand(false), 2000);
  };

  const handleSkillInstall = useCallback(
    async (skillId: string) => {
      // 1. HARD GUARD: ONLY allow incrementing custom skills!
      const targetSkill = skills.find(
        (s) => s.isCustom && (s.id === skillId || s.skillId === skillId)
      );
      if (!targetSkill) {
        return;
      }

      // 2. Optimistically increment count in UI immediately for this custom skill only
      setSkills((prev) =>
        prev.map((s) => {
          if (s.isCustom && (s.id === skillId || s.skillId === skillId)) {
            const nextInstalls = (s.installs || 0) + 1;
            const weekly =
              Array.isArray(s.weeklyInstalls) && s.weeklyInstalls.length > 0
                ? [...s.weeklyInstalls]
                : [0, 0, 0, 0, 0, 0, 0, 0];
            weekly[weekly.length - 1] = (weekly[weekly.length - 1] || 0) + 1;
            return {
              ...s,
              installs: nextInstalls,
              weeklyInstalls: weekly,
            };
          }
          return s;
        })
      );

      // 3. Persist to API
      try {
        const res = await apiFetch("/api/skills/install", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: skillId }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && typeof data.installs === "number" && data.installs > 0) {
            setSkills((prev) =>
              prev.map((s) => {
                if (s.isCustom && (s.id === skillId || s.skillId === skillId)) {
                  return {
                    ...s,
                    installs: data.installs,
                    weeklyInstalls: data.weeklyInstalls || s.weeklyInstalls,
                  };
                }
                return s;
              })
            );
          }
        }
      } catch (err) {
        console.error("Failed to record skill install:", err);
      }
    },
    [skills]
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAddModal={() => setIsAddOpen(true)}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12">
        {/* HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 lg:gap-14 items-start">
          {/* Left: ASCII Art & Tagline */}
          <div className="flex flex-col gap-2">
            <AsciiBanner />
            <p className="text-sm lg:text-base tracking-tight text-emerald-400 font-mono font-medium uppercase mt-2">
              {t("ecosystemTitle")}
            </p>
          </div>

          {/* Right: Description & Try it now */}
          <div className="space-y-6">
            <p className="text-neutral-400 text-lg sm:text-2xl lg:text-2xl leading-relaxed tracking-tight">
              {t("heroDesc")}
            </p>

            {/* Try It Now Box */}
            <div className="space-y-2">
              <h2 className="text-xs font-mono font-medium tracking-normal text-white uppercase">
                {t("tryItNow")}
              </h2>
              <div
                onClick={handleCopyTryCommand}
                className="bg-neutral-900/90 hover:bg-neutral-900 border border-white/10 hover:border-white/25 rounded-lg px-4 py-3 font-mono text-xs sm:text-sm text-white flex items-center justify-between gap-4 max-w-md cursor-pointer transition-all group"
              >
                <div className="truncate flex items-center gap-2">
                  <span className="text-neutral-500">$</span>
                  <span className="text-neutral-200">npx skills add</span>
                  <span className="text-emerald-400 truncate">&lt;owner/repo&gt;</span>
                </div>
                <button
                  className="p-1.5 rounded text-neutral-400 group-hover:text-white transition-colors"
                  title="Copy command"
                >
                  {copiedTryCommand ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Agent Carousel Area */}
            <div className="space-y-2 pt-2">
              <h2 className="text-xs font-mono font-medium tracking-normal text-neutral-400 uppercase">
                {t("availableForAgents")}
              </h2>
              <AgentCarousel />
            </div>
          </div>
        </section>

        {/* LEADERBOARD & DIRECTORY SECTION */}
        <section className="space-y-6 pt-4 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-mono font-semibold tracking-tight text-white uppercase flex items-center gap-2">
                <span>{t("skillsLeaderboard")}</span>
                <span className="text-xs font-normal text-neutral-500 lowercase">
                  ({totalSkills.toLocaleString()} skills)
                </span>
              </h2>
            </div>

            {/* Search Input Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white hover:border-white/30 text-xs font-mono transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{t("searchPlaceholder")}</span>
            </button>
          </div>

          {/* View Selector Tabs */}
          <TabSelector
            currentView={currentView}
            onSelectView={(view) => handleSelectView(view)}
            totalCount={totalSkills}
          />

          {/* Leaderboard Table with Infinite Scroll */}
          <LeaderboardTable
            skills={skills}
            isLoading={isLoading}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            onSelectSkill={(skill) => setSelectedSkill(skill)}
            onSkillInstall={handleSkillInstall}
          />
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-8 bg-neutral-950 mt-16 text-xs font-mono text-neutral-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span>Powered by the open agent skills ecosystem standard.</span>
          </div>
          <div className="flex items-center gap-4 text-neutral-400">
            <button onClick={() => setIsAddOpen(true)} className="hover:text-white">
              + {t("addSkill")}
            </button>
            <a
              href="https://github.com/vercel-labs/skills"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              GitHub Source
            </a>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <SearchDialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectSkill={(skill) => setSelectedSkill(skill)}
      />

      <SkillDetailModal
        skill={selectedSkill}
        onClose={() => setSelectedSkill(null)}
        onSkillInstall={handleSkillInstall}
      />

      <AddSkillModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSkillAdded={() => fetchSkillsForView(currentView, 0, false)}
      />
    </div>
  );
}

export default function HomePage() {
  return <HomePageContent />;
}
