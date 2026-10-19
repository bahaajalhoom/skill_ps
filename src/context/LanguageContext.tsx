"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "ar";

interface LanguageContextType {
  lang: Language;
  dir: "ltr" | "rtl";
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
  },
  ar: {
    siteTitle: "سكلات",
    ecosystemTitle: "منظومة مهارات وكلاء الذكاء الاصطناعي العالمية",
    heroDesc:
      "السكلات (Skills) هي قدرات إجرائية قابلة لإعادة الاستخدام لوكلاء الذكاء الاصطناعي. قم بتثبيتها بأمر واحد لتمكين وكلائك بالمعرفة المتخصصة، دورات الاختبار، والأدوات الاحترافية.",
    tryItNow: "جربها الآن",
    availableForAgents: "مدعومة على بيئات الوكلاء التالية",
    skillsLeaderboard: "لوحة صدارة السكلات الأكثر استخداماً",
    searchPlaceholder: "ابحث في أكثر من 1.4 مليون سكل... (اضغط '/' للبحث)",
    allTime: "الكل عبر التاريخ",
    trending: "الأكثر نمواً (24 ساعة)",
    hot: "شائع الآن (Hot)",
    customSkills: "سكلاتي المخصصة",
    skillCol: "المهارة (Skill)",
    activityCol: "نشاط 8 أسابيع",
    installsCol: "التنزيلات",
    rankCol: "#",
    copyCommand: "نسخ الأمر",
    copied: "تم النسخ للحافظة!",
    addSkill: "إضافة / استيراد سكل",
    whatThisSkillDoes: "ماذا تفعل هذه المهارة",
    installInstructions: "طريقة التثبيت",
    securityAudit: "فحص الأمان",
    verified: "سكل معتمد ورسمي",
    customBadge: "سكل مخصص",
    loadMore: "جاري جلب المزيد من السكلات...",
    noSkillsFound: "لم يتم العثور على سكلات مطابقة لبحثك.",
    mySkillsDesc: "إدارة وتثبيت سكلاتك الشخصية والمستوردة للوكلاء.",
    importFromGithub: "استيراد من GitHub",
    createCustom: "كتابة سكل مخصص",
    saveSkill: "حفظ السكل",
    cancel: "إلغاء",
    skillName: "اسم السكل",
    repoSource: "مستودع GitHub (owner/repo)",
    skillDescription: "الوصف المختصر",
    markdownBody: "محتوى ملف SKILL.md",
    totalSkillsCount: "أكثر من 1,409,643+ سكل متوفرة",
    close: "إغلاق",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  dir: "ltr",
  toggleLanguage: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("en");

  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "ar" : "en"));
  };

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, dir, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
