"use client";

// ============================================================================
// 1. IMPORTS
// ============================================================================
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  Copy,
  Check,
  Search,
  RefreshCw,
  Globe,
  MapPin,
  Clock,
  Laptop,
  Terminal,
  Shield,
  Trash2,
  Download,
  ExternalLink,
  ChevronRight,
  Filter,
  Radio,
  Server,
  Layers,
  Info,
  X,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { PalestineFlag } from "@/components/PalestineFlag";
import { InstallLog, TelemetryStats, AdminTelemetryResponse } from "@/types/skills";
import { getCountryFlag } from "@/lib/geo-utils";
import { apiFetch } from "@/lib/api-config";

// ============================================================================
// 2. CONFIGURATION & CONSTANTS (EASY EDIT ZONE)
// ============================================================================
const REFRESH_INTERVALS = [
  { label: "Off", value: 0 },
  { label: "5s", value: 5000 },
  { label: "10s", value: 10000 },
  { label: "30s", value: 30000 },
];

const AGENT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  cursor: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  claudeCode: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
  antigravity: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  windsurf: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20" },
  copilot: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
  cli: { bg: "bg-neutral-800", text: "text-neutral-300", border: "border-neutral-700" },
};

const AGENT_NAMES: Record<string, string> = {
  cursor: "Cursor",
  claudeCode: "Claude Code",
  antigravity: "Antigravity",
  windsurf: "Windsurf",
  copilot: "Copilot",
  cli: "Skills CLI",
};

// ============================================================================
// 3. TYPES & INTERFACES
// ============================================================================
interface FilterState {
  searchQuery: string;
  selectedAgent: string;
  selectedCountry: string;
}

// ============================================================================
// 4. HELPER FUNCTIONS & CUSTOM HOOKS
// ============================================================================
function formatTimeExact(isoString: string, lang: "ar" | "en"): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleTimeString(lang === "ar" ? "ar-EG" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  } catch {
    return "—";
  }
}

function formatDateExact(isoString: string, lang: "ar" | "en"): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

function formatTimeRelative(isoString: string, lang: "ar" | "en"): string {
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (lang === "ar") {
      if (diffSec < 45) return "الآن";
      if (diffMin < 60) return `منذ ${diffMin} دقيقة`;
      if (diffHours < 24) return `منذ ${diffHours} ساعة`;
      return `منذ ${diffDays} يوم`;
    }

    if (diffSec < 45) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  } catch {
    return "—";
  }
}

// ============================================================================
// 5. SUB-COMPONENTS
// ============================================================================

/** Metric Stat Card */
function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  badge,
  colorClass = "text-white",
}: {
  title: string;
  value: string | number;
  subtext?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  colorClass?: string;
}) {
  return (
    <div className="relative p-4 sm:p-5 rounded-xl bg-neutral-950/70 border border-white/10 overflow-hidden flex flex-col justify-between hover:border-white/20 transition-all shadow-lg">
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-medium">
          {title}
        </span>
        <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-neutral-300">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3">
        <div className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight ${colorClass}`}>
          {value}
        </div>
        {subtext && (
          <p className="text-xs font-mono text-neutral-500 mt-1 truncate">
            {subtext}
          </p>
        )}
      </div>

      {badge && (
        <div className="absolute top-2 right-2">
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {badge}
          </span>
        </div>
      )}
    </div>
  );
}

/** Detail Inspection Modal */
function TelemetryInspectionModal({
  log,
  onClose,
}: {
  log: InstallLog | null;
  onClose: () => void;
}) {
  const { lang, t } = useLanguage();
  const [copiedRaw, setCopiedRaw] = useState(false);

  if (!log) return null;

  const flag = getCountryFlag(log.countryCode);
  const mapsUrl = log.latitude && log.longitude
    ? `https://www.google.com/maps?q=${log.latitude},${log.longitude}`
    : undefined;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(log, null, 2));
    setCopiedRaw(true);
    setTimeout(() => setCopiedRaw(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-neutral-950 border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-neutral-900/50">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">{flag}</span>
            <div>
              <h3 className="font-mono text-base font-bold text-white flex items-center gap-2">
                <span>{log.skillName}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-normal">
                  Custom Skill
                </span>
              </h3>
              <p className="text-xs font-mono text-neutral-400">
                Event ID: <span className="text-neutral-300">{log.id}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Key Facts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            {/* Location */}
            <div className="p-3 rounded-lg bg-neutral-900/40 border border-white/5 space-y-1">
              <span className="text-neutral-500 uppercase tracking-wider text-[10px]">
                {lang === "ar" ? "الموقع الجغرافي" : "Geo Location"}
              </span>
              <p className="font-semibold text-white flex items-center gap-1.5">
                <span>{flag}</span>
                <span>{log.country}</span>
                {log.city && <span className="text-neutral-400">({log.city})</span>}
              </p>
              {log.region && (
                <p className="text-[11px] text-neutral-500">Region: {log.region}</p>
              )}
              {mapsUrl && (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-400 hover:underline pt-1"
                >
                  <MapPin className="w-3 h-3" />
                  <span>View on Map ({log.latitude?.toFixed(2)}, {log.longitude?.toFixed(2)})</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>

            {/* Network IP */}
            <div className="p-3 rounded-lg bg-neutral-900/40 border border-white/5 space-y-1">
              <span className="text-neutral-500 uppercase tracking-wider text-[10px]">
                {lang === "ar" ? "عنوان الشبكة (IP)" : "Network IP & ISP"}
              </span>
              <p className="font-semibold text-emerald-400 font-mono text-sm">
                {log.ip}
              </p>
              <p className="text-[11px] text-neutral-400 truncate">
                ISP: {log.isp || "Network Provider"}
              </p>
            </div>

            {/* Device User / يوزر الجهاز */}
            <div className="p-3 rounded-lg bg-neutral-900/40 border border-white/5 space-y-1">
              <span className="text-neutral-500 uppercase tracking-wider text-[10px]">
                {lang === "ar" ? "يوزر الجهاز" : "Device User / Hostname"}
              </span>
              <p className="font-semibold text-purple-400 font-mono text-sm flex items-center gap-1.5 truncate">
                <Laptop className="w-3.5 h-3.5 shrink-0" />
                <span>{log.deviceUser || "unknown"}</span>
              </p>
              <p className="text-[11px] text-neutral-400 truncate">
                Client / Machine identity
              </p>
            </div>

            {/* Timestamp */}
            <div className="p-3 rounded-lg bg-neutral-900/40 border border-white/5 space-y-1">
              <span className="text-neutral-500 uppercase tracking-wider text-[10px]">
                {lang === "ar" ? "الوقت والتاريخ" : "Timestamp (Exact)"}
              </span>
              <p className="font-semibold text-white">
                {formatTimeExact(log.createdAt, lang)}
              </p>
              <p className="text-[11px] text-neutral-400">
                {formatDateExact(log.createdAt, lang)} ({formatTimeRelative(log.createdAt, lang)})
              </p>
            </div>

            {/* Agent Target */}
            <div className="p-3 rounded-lg bg-neutral-900/40 border border-white/5 space-y-1">
              <span className="text-neutral-500 uppercase tracking-wider text-[10px]">
                {lang === "ar" ? "الوكيل المستهدف" : "Target AI Agent"}
              </span>
              <p className="font-semibold text-white flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-purple-400" />
                <span>{AGENT_NAMES[log.agentTarget] || log.agentTarget || "CLI"}</span>
              </p>
              <p className="text-[11px] text-neutral-400">
                {log.os} • {log.browser} • {log.device}
              </p>
            </div>
          </div>

          {/* User-Agent String */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider font-semibold">
              Raw User-Agent Header:
            </span>
            <pre className="p-3 rounded-lg bg-black border border-white/10 font-mono text-xs text-neutral-300 break-all whitespace-pre-wrap">
              {log.userAgent || "No User-Agent provided"}
            </pre>
          </div>

          {/* Raw JSON inspection */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider font-semibold">
                Telemetry Event Payload:
              </span>
              <button
                onClick={handleCopyJson}
                className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 hover:text-emerald-300"
              >
                {copiedRaw ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedRaw ? t("copied") : "Copy JSON"}</span>
              </button>
            </div>
            <pre className="p-3 rounded-lg bg-black border border-white/10 font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-40">
              {JSON.stringify(log, null, 2)}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-neutral-900/30 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-xs transition-colors"
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 6. MAIN COMPONENT (ADMIN PAGE)
// ============================================================================
export default function AdminPage() {
  const { lang, toggleLanguage, t } = useLanguage();

  // State
  const [logs, setLogs] = useState<InstallLog[]>([]);
  const [stats, setStats] = useState<TelemetryStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inspectedLog, setInspectedLog] = useState<InstallLog | null>(null);

  // Filters & Controls
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("all");
  const [refreshInterval, setRefreshInterval] = useState(10000); // 10s default
  const [copiedIp, setCopiedIp] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  // Fetch telemetry from API
  const fetchTelemetry = useCallback(async (showLoading = false) => {
    if (showLoading) setIsLoading(true);
    setError(null);
    try {
      const res = await apiFetch("/api/admin/installs?limit=100");
      if (!res.ok) {
        throw new Error(`Failed to load telemetry (HTTP ${res.status})`);
      }
      const data: AdminTelemetryResponse = await res.json();
      if (data && data.success) {
        setLogs(data.logs || []);
        setStats(data.stats || null);
      }
    } catch (err: any) {
      console.error("Telemetry fetch error:", err);
      setError(err.message || "Failed to load telemetry");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchTelemetry(true);
  }, [fetchTelemetry]);

  // Auto-refresh interval
  useEffect(() => {
    if (refreshInterval <= 0) return;
    const interval = setInterval(() => {
      fetchTelemetry(false);
    }, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, fetchTelemetry]);

  // Derived filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // 1. Agent filter
      if (selectedAgent !== "all" && log.agentTarget !== selectedAgent) {
        return false;
      }
      // 2. Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        log.skillName.toLowerCase().includes(q) ||
        log.source.toLowerCase().includes(q) ||
        log.ip.toLowerCase().includes(q) ||
        (log.deviceUser && log.deviceUser.toLowerCase().includes(q)) ||
        log.country.toLowerCase().includes(q) ||
        log.city.toLowerCase().includes(q) ||
        log.browser.toLowerCase().includes(q) ||
        log.os.toLowerCase().includes(q) ||
        log.agentTarget.toLowerCase().includes(q)
      );
    });
  }, [logs, selectedAgent, searchQuery]);

  // Copy IP handler
  const handleCopyIp = (ip: string) => {
    navigator.clipboard.writeText(ip);
    setCopiedIp(ip);
    setTimeout(() => setCopiedIp(null), 2000);
  };

  // Clear logs handler
  const handleClearLogs = async () => {
    const confirmed = window.confirm(
      lang === "ar"
        ? "هل أنت متأكد من مسح جميع سجلات التتبع السابقة؟"
        : "Are you sure you want to clear all telemetry install logs?"
    );
    if (!confirmed) return;

    setIsClearing(true);
    try {
      await apiFetch("/api/admin/installs", { method: "DELETE" });
      await fetchTelemetry(true);
    } catch (err) {
      console.error("Failed to clear logs:", err);
    } finally {
      setIsClearing(false);
    }
  };

  // Export to CSV handler
  const handleExportCsv = () => {
    if (logs.length === 0) return;
    const headers = [
      "ID",
      "Skill Name",
      "Source",
      "IP",
      "Device User",
      "Country",
      "City",
      "Timestamp",
      "Target Agent",
      "OS",
      "Browser",
      "ISP",
    ];
    const rows = logs.map((l) => [
      l.id,
      `"${l.skillName}"`,
      `"${l.source}"`,
      l.ip,
      `"${l.deviceUser || ""}"`,
      `"${l.country}"`,
      `"${l.city}"`,
      l.createdAt,
      l.agentTarget,
      l.os,
      l.browser,
      `"${l.isp || ""}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `skill_ps_telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Top custom skill name for stat card
  const topSkillName = stats?.topCustomSkills?.[0]?.name || "—";
  const topSkillCount = stats?.topCustomSkills?.[0]?.installs ? `${stats.topCustomSkills[0].installs} installs` : undefined;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-purple-500/30 selection:text-white">
      {/* Top Header & Breadcrumbs */}
      <header className="sticky top-0 z-40 w-full bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto h-14 px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-xs sm:text-sm font-mono text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{t("adminBackToDirectory")}</span>
              <span className="sm:hidden">Back</span>
            </Link>

            <span className="text-neutral-600 font-mono">/</span>

            <div className="flex items-center gap-2">
              <PalestineFlag width={22} height={14} />
              <h1 className="font-mono font-bold text-sm sm:text-base text-white tracking-tight flex items-center gap-2">
                <span>{t("adminTitle")}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Custom Only
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Live Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 font-mono text-[11px] text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>{t("adminLiveTelemetry")}</span>
            </div>

            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 rounded-md border border-white/10 hover:border-white/20 text-xs font-mono text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-neutral-400" />
              <span>{lang === "en" ? "العربية" : "English"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Hero Title & Explanation */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Activity className="w-4 h-4" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-white">
              {t("adminTitle")}
            </h2>
          </div>
          <p className="text-sm sm:text-base text-neutral-400 max-w-3xl leading-relaxed">
            {t("adminDesc")}
          </p>
        </div>

        {/* 1. METRICS OVERVIEW CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title={t("adminTotalInstalls")}
            value={stats?.totalInstalls ?? logs.length}
            subtext={lang === "ar" ? "عمليات تثبيت لسكلاتك" : "Custom skill copies/installs"}
            icon={Layers}
            colorClass="text-purple-400"
            badge="Live"
          />
          <StatCard
            title={t("adminUniqueVisitors")}
            value={stats?.uniqueIps ?? new Set(logs.map((l) => l.ip)).size}
            subtext={lang === "ar" ? "مستخدمون فريدون (IP)" : "Unique client IP addresses"}
            icon={Server}
            colorClass="text-emerald-400"
          />
          <StatCard
            title={t("adminCountries")}
            value={stats?.countriesCount ?? 1}
            subtext={lang === "ar" ? "توزيع جغرافي عالمي" : "Global locations identified"}
            icon={MapPin}
            colorClass="text-blue-400"
          />
          <StatCard
            title={t("adminTopSkill")}
            value={topSkillName}
            subtext={topSkillCount || (lang === "ar" ? "الأكثر طلباً" : "Most installed")}
            icon={Shield}
            colorClass="text-amber-400"
          />
        </div>

        {/* 2. FILTER & ACTION TOOLBAR */}
        <div className="p-4 rounded-xl bg-neutral-950 border border-white/10 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-3 shadow-md">
          {/* Left: Search input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("adminSearchPlaceholder")}
              className="w-full bg-neutral-900 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs sm:text-sm font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Agent filter dropdown */}
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="bg-neutral-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono text-neutral-300 focus:outline-none hover:border-white/20"
            >
              <option value="all">{lang === "ar" ? "كل الوكلاء" : "All Agents"}</option>
              <option value="cli">Skills CLI</option>
              <option value="cursor">Cursor</option>
              <option value="claudeCode">Claude Code</option>
              <option value="antigravity">Antigravity</option>
              <option value="windsurf">Windsurf</option>
              <option value="copilot">GitHub Copilot</option>
            </select>

            {/* Auto refresh dropdown */}
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className="bg-neutral-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono text-neutral-300 focus:outline-none hover:border-white/20"
              title="Auto-refresh rate"
            >
              {REFRESH_INTERVALS.map((item) => (
                <option key={item.value} value={item.value}>
                  ↻ {item.label}
                </option>
              ))}
            </select>

            {/* Manual Refresh button */}
            <button
              onClick={() => fetchTelemetry(true)}
              disabled={isLoading}
              className="p-2 rounded-lg bg-neutral-900 border border-white/10 text-neutral-300 hover:text-white hover:border-white/25 transition-all disabled:opacity-50"
              title={t("adminRefresh")}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-purple-400" : ""}`} />
            </button>

            {/* Export CSV */}
            <button
              onClick={handleExportCsv}
              disabled={logs.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-white/10 hover:border-white/25 text-neutral-300 hover:text-white text-xs font-mono transition-all disabled:opacity-40"
              title={t("adminExportCsv")}
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t("adminExportCsv")}</span>
            </button>

            {/* Clear logs */}
            <button
              onClick={handleClearLogs}
              disabled={isClearing || logs.length === 0}
              className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-30"
              title={t("adminClearLogs")}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3. TELEMETRY EVENT LOG TABLE */}
        <div className="rounded-xl bg-neutral-950 border border-white/10 overflow-hidden shadow-2xl">
          {/* Table Header */}
          <div className="hidden lg:grid grid-cols-12 gap-2.5 p-3.5 border-b border-white/10 bg-neutral-900/60 font-mono text-xs font-semibold text-neutral-400 uppercase tracking-wider items-center">
            <div className="col-span-2">{t("adminLocation")}</div>
            <div className="col-span-2">{t("adminIp")}</div>
            <div className="col-span-2 flex items-center gap-1.5 text-purple-400">
              <Laptop className="w-3.5 h-3.5" />
              <span>{t("adminDeviceUser")}</span>
            </div>
            <div className="col-span-2">{t("adminTime")}</div>
            <div className="col-span-2">{lang === "ar" ? "السكل المخصص" : "Custom Skill"}</div>
            <div className="col-span-1">{t("adminAgent")}</div>
            <div className="col-span-1 text-right">{t("adminInspect")}</div>
          </div>

          {/* Table Body or Loading/Empty States */}
          {isLoading && logs.length === 0 ? (
            <div className="py-20 text-center space-y-3 font-mono text-xs text-neutral-500">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-purple-400" />
              <p>Loading real-time telemetry stream...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="py-20 text-center space-y-3 p-6 font-mono">
              <div className="w-12 h-12 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center mx-auto text-neutral-500">
                <Radio className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-white font-semibold text-base">{t("adminNoLogs")}</h3>
              <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                {t("adminNoLogsHint")}
              </p>
              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-black text-xs font-mono font-medium hover:bg-neutral-200 transition-colors"
                >
                  <span>{t("adminBackToDirectory")}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-white/5 font-mono text-xs">
              {filteredLogs.map((log) => {
                const flag = getCountryFlag(log.countryCode);
                const isIpCopied = copiedIp === log.ip;
                const agentColor = AGENT_COLORS[log.agentTarget] || AGENT_COLORS.cli;
                const agentLabel = AGENT_NAMES[log.agentTarget] || log.agentTarget || "CLI";

                return (
                  <div
                    key={log.id}
                    onClick={() => setInspectedLog(log)}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-2.5 p-3.5 hover:bg-neutral-900/60 transition-colors cursor-pointer items-center group"
                  >
                    {/* Location & City (col-span-2) */}
                    <div className="col-span-2 flex items-center gap-2 min-w-0">
                      <span className="text-base shrink-0">{flag}</span>
                      <div className="min-w-0">
                        <div className="font-semibold text-white group-hover:text-purple-300 transition-colors truncate flex items-center gap-1">
                          <span className="truncate">{log.country}</span>
                          {log.countryCode && (
                            <span className="text-[10px] text-neutral-500 shrink-0">[{log.countryCode}]</span>
                          )}
                        </div>
                        <div className="text-[11px] text-neutral-400 truncate flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-neutral-500 shrink-0" />
                          <span className="truncate">{log.city || "Unknown City"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Network / IP with Copy (col-span-2) */}
                    <div className="col-span-2 flex items-center justify-between lg:justify-start gap-1.5">
                      <span className="font-mono text-emerald-400 font-medium tracking-tight text-xs truncate">
                        {log.ip}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyIp(log.ip);
                        }}
                        title={isIpCopied ? t("copied") : "Copy IP"}
                        className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors shrink-0"
                      >
                        {isIpCopied ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>

                    {/* Device User / يوزر الجهاز (col-span-2) */}
                    <div className="col-span-2 flex items-center gap-1.5 min-w-0">
                      <span className="p-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
                        <Laptop className="w-3.5 h-3.5" />
                      </span>
                      <span
                        className="font-mono text-purple-300 font-semibold tracking-tight text-xs truncate"
                        title={log.deviceUser || "unknown"}
                      >
                        {log.deviceUser || "unknown"}
                      </span>
                    </div>

                    {/* Timestamp: Exact hour:min:sec and relative (col-span-2) */}
                    <div className="col-span-2 space-y-0.5">
                      <div className="text-white font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 text-neutral-500 shrink-0" />
                        <span>{formatTimeExact(log.createdAt, lang)}</span>
                      </div>
                      <div className="text-[11px] text-neutral-500 flex items-center gap-1.5">
                        <span>{formatDateExact(log.createdAt, lang)}</span>
                        <span>•</span>
                        <span className="text-purple-400">{formatTimeRelative(log.createdAt, lang)}</span>
                      </div>
                    </div>

                    {/* Skill Info (col-span-2) */}
                    <div className="col-span-2 min-w-0">
                      <div className="font-semibold text-white truncate flex items-center gap-1">
                        <span className="text-purple-400 shrink-0">✦</span>
                        <span className="truncate">{log.skillName}</span>
                      </div>
                      <div className="text-[11px] text-neutral-500 truncate">
                        {log.source}
                      </div>
                    </div>

                    {/* Target Agent Badge (col-span-1) */}
                    <div className="col-span-1">
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] border font-medium ${agentColor.bg} ${agentColor.text} ${agentColor.border}`}
                      >
                        <Terminal className="w-3 h-3 shrink-0" />
                        <span className="truncate">{agentLabel}</span>
                      </span>
                    </div>

                    {/* Action Inspector Button (col-span-1) */}
                    <div className="col-span-1 flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectedLog(log);
                        }}
                        className="p-1.5 rounded-lg bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white hover:border-white/30 transition-all text-[11px] flex items-center gap-1 group-hover:border-purple-500/40"
                      >
                        <Info className="w-3.5 h-3.5 text-purple-400" />
                        <span className="hidden xl:inline">{t("adminInspect")}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Table Footer */}
          <div className="p-3 border-t border-white/10 bg-neutral-950 flex items-center justify-between text-xs font-mono text-neutral-500">
            <span>
              Showing {filteredLogs.length} of {logs.length} recorded events
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Real-time SQLite / Storage Stream</span>
            </div>
          </div>
        </div>

        {/* 4. COUNTRY DISTRIBUTION BREAKDOWN */}
        {stats?.countryBreakdown && stats.countryBreakdown.length > 0 && (
          <div className="p-5 rounded-xl bg-neutral-950 border border-white/10 space-y-4">
            <h3 className="font-mono text-xs uppercase tracking-wider text-neutral-400 font-semibold flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>{lang === "ar" ? "التوزيع الجغرافي للمحملين حسب الدولة" : "Geographic Breakdown by Country"}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {stats.countryBreakdown.map((item) => {
                const flag = getCountryFlag(item.countryCode);
                const pct = stats.totalInstalls > 0 ? Math.round((item.count / stats.totalInstalls) * 100) : 0;

                return (
                  <div
                    key={item.countryCode || item.country}
                    className="p-3 rounded-lg bg-neutral-900/50 border border-white/5 space-y-1 font-mono text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base">{flag}</span>
                      <span className="font-bold text-white">{item.count}</span>
                    </div>
                    <p className="font-medium text-neutral-300 truncate">{item.country}</p>
                    <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-purple-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(pct, 5)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-neutral-500">{pct}% of installs</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* 5. INSPECTION MODAL */}
      <TelemetryInspectionModal
        log={inspectedLog}
        onClose={() => setInspectedLog(null)}
      />
    </div>
  );
}
