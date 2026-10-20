"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AgentInfo, ALL_AGENTS } from "@/data/agents";
import { useLanguage } from "@/context/LanguageContext";
import { X, Copy, Check, ExternalLink, Terminal, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";

interface AgentDetailModalProps {
  agent: AgentInfo | null;
  onClose: () => void;
  onSelectAgent?: (agent: AgentInfo) => void;
}

export function AgentDetailModal({ agent, onClose, onSelectAgent }: AgentDetailModalProps) {
  const { isRtl } = useLanguage();
  const [copied, setCopied] = useState<string | null>(null);

  if (!agent) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const otherAgents = ALL_AGENTS.filter((a) => a.slug !== agent.slug);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col gap-6 text-neutral-100"
        onClick={(e) => e.stopPropagation()}
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 end-4 p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header: Icon + Name + Badge */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center p-3 shrink-0 shadow-inner">
            <Image
              src={agent.icon}
              alt={agent.name}
              width={40}
              height={40}
              className="object-contain"
            />
          </div>

          <div className="flex flex-col gap-1 pr-8">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                {isRtl ? `مهارات ${agent.name}` : `Skills for ${agent.name}`}
              </h2>
              {agent.badge && (
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {agent.badge}
                </span>
              )}
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              {isRtl ? agent.introAr : agent.intro}
            </p>
          </div>
        </div>

        {/* Section: Install skills on Agent */}
        <div className="flex flex-col gap-3 pt-2 border-t border-neutral-800/80">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              {isRtl ? `تثبيت المهارات في ${agent.name}` : `Install skills on ${agent.name}`}
            </h3>
            <span className="text-[11px] text-neutral-500 font-mono">
              CLI Tool
            </span>
          </div>

          <p className="text-xs text-neutral-400">
            {isRtl
              ? `يقوم أمر skills بتثبيت ملفات SKILL.md في مستودعك ليعتمد عليها ${agent.name} عبر كافة الجلسات:`
              : `The skills CLI installs SKILL.md files into your repository so ${agent.name} can reference them across sessions:`}
          </p>

          {/* Primary Command Card */}
          <div className="flex items-center justify-between gap-3 p-3.5 bg-black border border-neutral-800 rounded-xl font-mono text-xs text-neutral-200 group hover:border-neutral-700 transition-colors">
            <div className="flex items-center gap-2 overflow-x-auto select-all">
              <span className="text-emerald-500 select-none">$</span>
              <span className="text-white font-medium">{agent.installCmd}</span>
            </div>
            <button
              onClick={() => handleCopy(agent.installCmd, "main")}
              className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 flex items-center gap-1.5 transition-all shrink-0"
            >
              {copied === "main" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 text-xs font-sans">{isRtl ? "تم النسخ" : "Copied"}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="text-xs font-sans">{isRtl ? "نسخ" : "Copy"}</span>
                </>
              )}
            </button>
          </div>

          {/* Agent Native Command if available */}
          {agent.nativeCmd && (
            <div className="flex items-center justify-between gap-3 p-3 bg-neutral-900/60 border border-neutral-800/80 rounded-xl font-mono text-xs text-neutral-300">
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-neutral-500 text-[10px] uppercase select-none">{isRtl ? "أمر مباشر" : "Direct"}:</span>
                <span className="text-neutral-200">{agent.nativeCmd}</span>
              </div>
              <button
                onClick={() => handleCopy(agent.nativeCmd!, "native")}
                className="px-2.5 py-1 rounded bg-neutral-800 text-neutral-400 hover:text-white transition-colors shrink-0"
              >
                {copied === "native" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>

        {/* Section: Frequently used skills / topics */}
        {agent.topics && agent.topics.length > 0 && (
          <div className="flex flex-col gap-3 pt-2 border-t border-neutral-800/80">
            <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              {isRtl ? `المهارات الأكثر استخداماً مع ${agent.name}` : `Skills frequently used with ${agent.name}`}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {agent.topics.map((t, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-neutral-900/40 border border-neutral-800/80 hover:border-neutral-700 transition-colors flex flex-col gap-1"
                >
                  <span className="text-xs font-semibold text-white">
                    {isRtl ? t.titleAr || t.title : t.title}
                  </span>
                  <span className="text-[11px] text-neutral-400 leading-snug">
                    {isRtl ? t.descAr || t.desc : t.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section: Official Website & Direct Page Link */}
        <div className="flex items-center justify-between gap-4 pt-3 border-t border-neutral-800/80 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>{isRtl ? `الموقع الرسمي لـ ${agent.name}:` : `Visit ${agent.name}:`}</span>
            <a
              href={agent.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline font-medium inline-flex items-center gap-1"
            >
              {agent.websiteName}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <Link
            href={`/agent/${agent.slug}`}
            className="text-xs font-mono px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition-colors inline-flex items-center gap-1.5"
          >
            <span>{isRtl ? "صفحة الوكيل الكاملة" : "Full Agent Page"}</span>
            {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </Link>
        </div>

        {/* Section: Other Agents Carousel / Switcher */}
        <div className="flex flex-col gap-2 pt-3 border-t border-neutral-800/80">
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
            {isRtl ? "وكلاء آخرون" : "Other agents"}
          </span>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {otherAgents.map((other) => (
              <button
                key={other.slug}
                onClick={() => onSelectAgent ? onSelectAgent(other) : null}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-all shrink-0 text-xs font-mono"
              >
                <Image
                  src={other.icon}
                  alt={other.name}
                  width={14}
                  height={14}
                  className="object-contain"
                />
                <span>{other.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
