"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "ar";

interface LanguageContextType {
  lang: Language;
  dir: "ltr" | "rtl";
  isRtl: boolean;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    siteTitle: "Skills",
    ecosystemTitle: "The Open Agent Skills Ecosystem",
    heroDesc:
      "Skills are reusable procedural capabilities for AI agents. Install them with a single command to enhance your agents with domain knowledge, testing loops, and tools.",
    tryItNow: "Try it now",
    availableForAgents: "Available for these agents",
    skillsLeaderboard: "Skills Leaderboard",
    searchPlaceholder: "Search skills... (Press '/' to focus)",
    allTime: "All Time",
    trending: "Trending (24h)",
    hot: "Hot",
    customSkills: "My Custom Skills",
    skillCol: "Skill",
    activityCol: "8W Activity",
    installsCol: "Installs",
    rankCol: "#",
    copyCommand: "Copy Command",
    copied: "Copied to clipboard!",
    addSkill: "Add / Import Skill",
    whatThisSkillDoes: "What this skill does",
    installInstructions: "How to Install",
    securityAudit: "Security Audit",
    verified: "Verified Official Skill",
    customBadge: "Custom Skill",
    loadMore: "Loading more skills...",
    noSkillsFound: "No skills matched your search.",
    mySkillsDesc: "Manage and install your personal and imported agent skills.",
    importFromGithub: "Import from GitHub",
    createCustom: "Write Custom Skill",
    saveSkill: "Save Skill",
    cancel: "Cancel",
    skillName: "Skill Name",
    repoSource: "GitHub Repository (owner/repo)",
    skillDescription: "Short Description",
    markdownBody: "SKILL.md Markdown Content",
    totalSkillsCount: "1,409,643+ skills available",
    close: "Close",
    adminTitle: "Custom Skills Telemetry & Admin",
    adminDesc: "Real-time location, IP network, timestamp, and environment intelligence for custom skills.",
    adminLiveTelemetry: "Live Telemetry Feed",
    adminTotalInstalls: "Total Custom Installs",
    adminUniqueVisitors: "Unique Network IPs",
    adminCountries: "Countries Reached",
    adminTopSkill: "Top Custom Skill",
    adminIp: "Network / IP",
    adminLocation: "Location / City",
    adminTime: "Time & Date",
    adminAgent: "Target Agent",
    adminEnvironment: "Client & OS",
    adminInspect: "Inspect Details",
    adminSearchPlaceholder: "Filter by IP, Country, City, Skill, Agent, OS...",
    adminRefresh: "Refresh",
    adminAutoRefresh: "Auto-refresh",
    adminClearLogs: "Clear Logs",
    adminExportCsv: "Export CSV",
    adminNoLogs: "No custom skill installs recorded yet.",
    adminNoLogsHint: "Click Copy or Install on any custom skill to see real-time location, IP, and time telemetry stream in here.",
    adminBackToDirectory: "Back to Skills Directory",
  },
  ar: {
    siteTitle: "Skills",
    ecosystemTitle: "المنظومة العالمية لسكلات الذكاء الاصطناعي",
    heroDesc:
      "السكلات (Skills) هي قدرات إجرائية قابلة لإعادة الاستخدام لوكلاء الذكاء الاصطناعي. ثبّتها بأمر واحد لتمكين وكلائك بالمعرفة المتخصصة ودورات العمل المتقدمة.",
    tryItNow: "جربها الآن",
    availableForAgents: "مدعومة على بيئات الوكلاء التالية",
    skillsLeaderboard: "لوحة صدارة السكلات",
    searchPlaceholder: "ابحث في أكثر من 1.4 مليون سكل... (اضغط '/')",
    allTime: "كل الأوقات",
    trending: "شائع (24 ساعة)",
    hot: "الأنشط (Hot)",
    customSkills: "سكلاتي المخصصة",
    skillCol: "المهارة",
    activityCol: "نشاط 8 أسابيع",
    installsCol: "التنزيلات",
    rankCol: "#",
    copyCommand: "نسخ الأمر",
    copied: "تم النسخ بنجاح!",
    addSkill: "إضافة / استيراد سكل",
    whatThisSkillDoes: "ماذا تفعل هذه المهارة",
    installInstructions: "طريقة التثبيت",
    securityAudit: "فحص الأمان",
    verified: "سكل معتمد ورسمي",
    customBadge: "مخصص",
    loadMore: "تحميل المزيد من السكلات...",
    noSkillsFound: "لم يتم العثور على سكلات مطابقة لبحثك.",
    mySkillsDesc: "إدارة وتثبيت سكلاتك الشخصية والمستوردة للوكلاء.",
    importFromGithub: "استيراد من GitHub",
    createCustom: "كتابة سكل جديد",
    saveSkill: "حفظ السكل",
    cancel: "إلغاء",
    skillName: "اسم السكل",
    repoSource: "مستودع GitHub (owner/repo)",
    skillDescription: "الوصف المختصر",
    markdownBody: "محتوى ملف SKILL.md",
    totalSkillsCount: "أكثر من 1,409,643 سكل متوفرة",
    close: "إغلاق",
    adminTitle: "لوحة تتبع ومراقبة السكلات المخصصة",
    adminDesc: "تحديد الموقع الجغرافي، الـ IP، والوقت بالساعة والدقيقة والبيانات التقنية لمن حمل سكلاتك.",
    adminLiveTelemetry: "البث الحي لعمليات التثبيت",
    adminTotalInstalls: "إجمالي التنزيلات المخصصة",
    adminUniqueVisitors: "عناوين IP الفريدة",
    adminCountries: "الدول المكتشفة",
    adminTopSkill: "أكثر سكل تحميلاً",
    adminIp: "الـ IP والشبكة",
    adminLocation: "الموقع والمدينة",
    adminTime: "الوقت والتاريخ",
    adminAgent: "الوكيل المستهدف",
    adminEnvironment: "المتصفح والنظام",
    adminInspect: "فحص تقني كامل",
    adminSearchPlaceholder: "تصفية حسب الـ IP، الدولة، المدينة، السكل، الوكيل...",
    adminRefresh: "تحديث",
    adminAutoRefresh: "تحديث تلقائي",
    adminClearLogs: "مسح السجلات",
    adminExportCsv: "تصدير CSV",
    adminNoLogs: "لا توجد عمليات تثبيت مسجلة للسكلات المخصصة حتى الآن.",
    adminNoLogsHint: "انسخ أو ثبّت أي سكل مخصص لتبدأ بيانات الـ IP والموقع الجغرافي والوقت بالظهور فوراً.",
    adminBackToDirectory: "العودة إلى الدليل العام",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  dir: "ltr",
  isRtl: false,
  toggleLanguage: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("en");

  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "ar" : "en"));
  };

  const dir = lang === "ar" ? "rtl" : "ltr";
  const isRtl = dir === "rtl";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, dir, isRtl, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
