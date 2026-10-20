export interface AgentTopic {
  title: string;
  titleAr: string;
  desc: string;
  descAr: string;
  slug: string;
}

export interface AgentInfo {
  slug: string;
  name: string;
  badge?: string;
  intro: string;
  introAr: string;
  icon: string;
  installCmd: string;
  nativeCmd?: string;
  website: string;
  websiteName: string;
  topics: AgentTopic[];
}

export const ALL_AGENTS: AgentInfo[] = [
  {
    slug: "cursor",
    name: "Cursor",
    badge: "Anysphere",
    intro: "AI-first code editor with deep agent integration. The skills CLI installs SKILL.md files that Cursor agents reference automatically when working on the repo.",
    introAr: "محرر أكواد مدعوم بالذكاء الاصطناعي مع تكامل عميق للوكلاء. يقوم أمر skills بتثبيت ملفات SKILL.md ليستخدمها وكيل Cursor تلقائياً أثناء العمل على المشروع.",
    icon: "/agents/cursor.svg",
    installCmd: "npx skills add <owner>/<repo>",
    nativeCmd: "cursor --install-skill <owner>/<repo>",
    website: "https://cursor.sh",
    websiteName: "cursor.sh",
    topics: [
      {
        title: "Frontend & React skills",
        titleAr: "مهارات الواجهات و React",
        desc: "Performance rules, component patterns, and ecosystem knowledge for production-quality React.",
        descAr: "قواعد الأداء وأنماط المكونات ومعرفة المنظومة البرمجية لتطوير تطبيقات React عالية الجودة.",
        slug: "react",
      },
      {
        title: "Next.js skills",
        titleAr: "مهارات Next.js",
        desc: "App Router, server components, caching APIs, and Vercel deployment patterns kept current.",
        descAr: "أحدث معايير App Router والمكونات السيرفرية وأنماط التخزين المؤقت والنشر.",
        slug: "nextjs",
      },
      {
        title: "Design & UI skills",
        titleAr: "مهارات التصميم والواجهات",
        desc: "Taste and frameworks for polished interfaces — from critique to design tokens.",
        descAr: "أطر عمل ومعايير واجهات المستخدم المصقولة من نقد التصميم إلى رموز التصميم.",
        slug: "design",
      },
    ],
  },
  {
    slug: "claude-code",
    name: "Claude Code",
    badge: "Anthropic",
    intro: "Anthropic's official terminal agent. Skills installed via the skills CLI become available as procedural knowledge across every Claude Code session in the project.",
    introAr: "وكيل سطر الأوامر الرسمي من Anthropic. المهارات المثبتة تصبح متاحة كمعرفة إجرائية عبر جميع جلسات Claude Code في المشروع.",
    icon: "/agents/claude-code.svg",
    installCmd: "npx skills add <owner>/<repo>",
    nativeCmd: "/plugin add <owner>/<repo>",
    website: "https://claude.com/product/claude-code",
    websiteName: "claude.com/product/claude-code",
    topics: [
      {
        title: "Agent workflow skills",
        titleAr: "مهارات سير عمل الوكلاء",
        desc: "How agents should operate — plan, debug, dispatch subagents, and run autonomous loops.",
        descAr: "كيف يجب أن يعمل الوكلاء — التخطيط وتصحيح الأخطاء وإطلاق الوكلاء الفرعيين والعمل الذاتي.",
        slug: "agent-workflows",
      },
      {
        title: "Frontend & React skills",
        titleAr: "مهارات الواجهات و React",
        desc: "Performance rules, component patterns, and ecosystem knowledge for production-quality React.",
        descAr: "قواعد الأداء وأنماط المكونات ومعرفة المنظومة البرمجية لتطبيقات React.",
        slug: "react",
      },
      {
        title: "Next.js skills",
        titleAr: "مهارات Next.js",
        desc: "App Router, server components, caching APIs, and Vercel deployment patterns kept current.",
        descAr: "المكونات السيرفرية وأنماط التخزين المؤقت والنشر لمنظومة Next.js.",
        slug: "nextjs",
      },
    ],
  },
  {
    slug: "antigravity",
    name: "Antigravity",
    badge: "Google DeepMind",
    intro: "Google's developer agent platform. Skills installed via the skills CLI extend Antigravity sessions with procedural workflows, specialized tools, and domain rules.",
    introAr: "منصة وكلاء المطورين المتقدمة من Google. تثبيت المهارات يزود جلسات Antigravity بمسارات عمل إجرائية وأدوات متخصصة وقواعد برمجية دقيقة.",
    icon: "/agents/antigravity.svg",
    installCmd: "npx skills add <owner>/<repo>",
    nativeCmd: "agy install <owner>/<repo>",
    website: "https://antigravity.google/",
    websiteName: "antigravity.google",
    topics: [
      {
        title: "Agent workflow skills",
        titleAr: "مهارات سير عمل الوكلاء",
        desc: "How agents should operate — plan, debug, dispatch subagents, and run autonomous loops.",
        descAr: "أفضل ممارسات إدارة الوكلاء الفرعيين والتخطيط المعماري المستقل.",
        slug: "agent-workflows",
      },
      {
        title: "Architecture & Design",
        titleAr: "الهندسة المعمارية والتصميم",
        desc: "Modular vertical-slice systems, high concurrency models, and resilient APIs.",
        descAr: "الأنظمة المعمارية المجزأة والتعامل مع التزامن العالي وبناء الـ APIs المتينة.",
        slug: "architecture",
      },
      {
        title: "Automated Testing & TDD",
        titleAr: "الاختبارات التلقائية و TDD",
        desc: "End-to-end verification, red-green-refactor loops, and zero-regression suites.",
        descAr: "التحقق الشامل وحلقات التطوير الموجه بالاختبارات وحماية الأنظمة من التراجع.",
        slug: "testing",
      },
    ],
  },
  {
    slug: "windsurf",
    name: "Windsurf",
    badge: "Codeium",
    intro: "Codeium's agentic IDE. Skills give Windsurf project-specific procedural knowledge that persists across Cascade flows, multi-file edits, and command executions.",
    introAr: "بيئة التطوير المبتكرة من Codeium المزودة بوكيل Cascade التلقائي. تمنح المهارات Windsurf معرفة خاصة بالمشروع تدوم عبر الجلسات.",
    icon: "/agents/windsurf.svg",
    installCmd: "npx skills add <owner>/<repo>",
    nativeCmd: "windsurf:install-skill?id=<owner>/<repo>",
    website: "https://codeium.com/windsurf",
    websiteName: "codeium.com/windsurf",
    topics: [
      {
        title: "Fullstack Architecture",
        titleAr: "معمارية الفل ستاك",
        desc: "Clean boundaries between Next.js frontend and high-throughput Node.js microservices.",
        descAr: "حدود نظيفة بين واجهة Next.js وخدمات Node.js المصغرة عالية السرعة.",
        slug: "architecture",
      },
      {
        title: "Frontend & React",
        titleAr: "الواجهات و React",
        desc: "Component libraries, accessible layouts, and high-performance UI state.",
        descAr: "مكتبات المكونات وتصميمات سهلة الوصول وإدارة حالة الواجهة بكفاءة عالية.",
        slug: "react",
      },
    ],
  },
  {
    slug: "github-copilot",
    name: "GitHub Copilot",
    badge: "GitHub / Microsoft",
    intro: "GitHub's AI coding assistant. Skills installed via the skills CLI augment Copilot's project context and workspace indexing across VS Code and JetBrains.",
    introAr: "مساعد البرمجة الذكي من GitHub. تثبيت المهارات يعزز سياق Copilot وفهرسة مساحة العمل عبر محررات VS Code و JetBrains.",
    icon: "/agents/copilot.svg",
    installCmd: "npx skills add <owner>/<repo>",
    nativeCmd: "gh copilot skills install <owner>/<repo>",
    website: "https://github.com/features/copilot",
    websiteName: "github.com/features/copilot",
    topics: [
      {
        title: "Testing & Code Quality",
        titleAr: "جودة الكود والاختبارات",
        desc: "Unit test generation, edge case validation, and linting guidelines.",
        descAr: "توليد اختبارات الوحدة والتحقق من الحالات الحدية ومعايير التدقيق.",
        slug: "testing",
      },
      {
        title: "Design & UI skills",
        titleAr: "مهارات التصميم والواجهات",
        desc: "Modern Tailwind CSS patterns and component hierarchy standards.",
        descAr: "أنماط Tailwind CSS الحديثة ومعايير هيكلية المكونات.",
        slug: "design",
      },
    ],
  },
  {
    slug: "gemini",
    name: "Gemini",
    badge: "Google",
    intro: "Google's Gemini family of agents. Compatible with the skills CLI for repo-scoped skill installation and dynamic reasoning over project instructions.",
    introAr: "عائلة وكلاء Gemini من Google. متوافقة مع أمر skills لتثبيت المعرفة الإجرائية والتحليل المنطقي الدقيق لمتطلبات المشروع.",
    icon: "/agents/gemini.svg",
    installCmd: "npx skills add <owner>/<repo>",
    website: "https://gemini.google.com",
    websiteName: "gemini.google.com",
    topics: [
      {
        title: "Agent workflow skills",
        titleAr: "مهارات سير عمل الوكلاء",
        desc: "Long-horizon planning, multi-step tool calls, and structured outputs.",
        descAr: "التخطيط طويل المدى واستدعاء الأدوات متعدد الخطوات والمخرجات المنظمة.",
        slug: "agent-workflows",
      },
      {
        title: "Databases & SQL",
        titleAr: "قواعد البيانات و SQL",
        desc: "High performance queries, transactional guarantees, and data schemas.",
        descAr: "استعلامات عالية الأداء وضمانات العمليات وتصميم الجداول.",
        slug: "databases",
      },
    ],
  },
  {
    slug: "cline",
    name: "Cline",
    badge: "Autonomous",
    intro: "Open-source autonomous coding agent for VS Code. Reads SKILL.md files installed via the skills CLI to plan multi-step implementations safely.",
    introAr: "وكيل برمجي مستقل ومفتوح المصدر لـ VS Code. يقرأ ملفات SKILL.md لتنفيذ المشاريع البرمجية متعددة الخطوات بأمان.",
    icon: "/agents/cline.svg",
    installCmd: "npx skills add <owner>/<repo>",
    website: "https://github.com/cline/cline",
    websiteName: "github.com/cline/cline",
    topics: [
      {
        title: "Agent workflow skills",
        titleAr: "مهارات سير عمل الوكلاء",
        desc: "Autonomous file modification, terminal safety, and verification rules.",
        descAr: "تعديل الملفات ذاتياً وأمان الطرفية وقواعد التحقق قبل الاعتماد.",
        slug: "agent-workflows",
      },
    ],
  },
  {
    slug: "codex",
    name: "Codex",
    badge: "OpenAI",
    intro: "OpenAI's coding agent. Compatible with the skills CLI for installing reusable procedural knowledge across code synthesis and refactoring tasks.",
    introAr: "وكيل البرمجة من OpenAI. متوافق مع أمر skills لتثبيت المعرفة الإجرائية القابلة لإعادة الاستخدام في مهام البناء وإعادة الهيكلة.",
    icon: "/agents/codex.svg",
    installCmd: "npx skills add <owner>/<repo>",
    website: "https://openai.com",
    websiteName: "openai.com",
    topics: [
      {
        title: "Agent workflow skills",
        titleAr: "مهارات سير عمل الوكلاء",
        desc: "Automated refactoring loops, logic simplification, and test suites.",
        descAr: "حلقات إعادة الهيكلة التلقائية وتبسيط المنطق وكتابة الاختبارات.",
        slug: "agent-workflows",
      },
    ],
  },
  {
    slug: "amp",
    name: "AMP",
    badge: "Research",
    intro: "AMP is an autonomous agent that uses the skills CLI to load procedural knowledge for engineering, design systems, and rapid prototyping.",
    introAr: "وكيل ذكي متقدم يستخدم أمر skills لتحميل المعرفة الإجرائية للهندسة البرمجية وأنظمة التصميم والنماذج الأولية.",
    icon: "/agents/amp.svg",
    installCmd: "npx skills add <owner>/<repo>",
    website: "https://ampcode.com",
    websiteName: "ampcode.com",
    topics: [
      {
        title: "Design & UI skills",
        titleAr: "مهارات التصميم والواجهات",
        desc: "Component systems and production styling.",
        descAr: "أنظمة المكونات وتنسيق الواجهات الإنتاجية.",
        slug: "design",
      },
    ],
  },
  {
    slug: "clawdbot",
    name: "OpenClaw",
    badge: "Open Source",
    intro: "OpenClaw is an open-source personal AI assistant that supports the skills CLI for installing reusable procedural workflows and custom tool integrations.",
    introAr: "مساعد ذكاء اصطناعي مفتوح المصدر يدعم تثبيت مهارات skills CLI لتمكين مسارات العمل التلقائية والتكامل مع الأدوات المخصصة.",
    icon: "/agents/openclaw.svg",
    installCmd: "npx skills add <owner>/<repo>",
    website: "https://openclaw.ai",
    websiteName: "openclaw.ai",
    topics: [
      {
        title: "Agent workflow skills",
        titleAr: "مهارات سير عمل الوكلاء",
        desc: "Autonomous local tools, shell automation, and custom instructions.",
        descAr: "أدوات محلية ذاتية وأتمتة سطر الأوامر والتعليمات المخصصة.",
        slug: "agent-workflows",
      },
    ],
  },
  {
    slug: "droid",
    name: "Droid",
    badge: "Factory",
    intro: "Factory's autonomous engineering agent. Compatible with the skills CLI for installing skills that Droid references during end-to-end task execution.",
    introAr: "وكيل الهندسة الذاتي من Factory. متوافق مع أمر skills لتثبيت المهارات التي يستند إليها Droid أثناء تنفيذ المهام من البداية للنهاية.",
    icon: "/agents/droid.svg",
    installCmd: "npx skills add <owner>/<repo>",
    website: "https://factory.ai",
    websiteName: "factory.ai",
    topics: [
      {
        title: "Agent workflow skills",
        titleAr: "مهارات سير العمل",
        desc: "Multi-agent coordination and deep repo triage.",
        descAr: "التنسيق بين الوكلاء المتعددين والفحص العميق للمستودعات.",
        slug: "agent-workflows",
      },
    ],
  },
  {
    slug: "goose",
    name: "Goose",
    badge: "Block",
    intro: "Block's open-source on-machine agent. Skills installed via the skills CLI extend Goose with reusable developer procedures and machine integrations.",
    introAr: "وكيل مفتوح المصدر يعمل على الجهاز من Block. تمنحه المهارات إجراءات تطوير قابلة لإعادة الاستخدام وتكاملات مباشرة مع النظام.",
    icon: "/agents/goose.svg",
    installCmd: "npx skills add <owner>/<repo>",
    website: "https://block.github.io/goose/",
    websiteName: "block.github.io/goose",
    topics: [
      {
        title: "Developer Workflows",
        titleAr: "مسارات عمل المطورين",
        desc: "On-machine task runner and terminal scripting.",
        descAr: "مشغل المهام على الجهاز وبرمجة نصوص الطرفية.",
        slug: "agent-workflows",
      },
    ],
  },
  {
    slug: "kilo",
    name: "Kilo",
    badge: "Coding Agent",
    intro: "Kilo is an AI coding agent that supports the skills CLI for installing reusable, project-scoped capabilities and code guidelines.",
    introAr: "وكيل برمجة بالذكاء الاصطناعي يدعم أمر skills لتثبيت القدرات البرمجية والمعايير المخصصة لكل مشروع.",
    icon: "/agents/kilo.svg",
    installCmd: "npx skills add <owner>/<repo>",
    website: "https://kilo.ai",
    websiteName: "kilo.ai",
    topics: [
      {
        title: "Code Quality",
        titleAr: "جودة الكود",
        desc: "Guidelines and architecture contracts.",
        descAr: "المعايير والعقود المعمارية للكود.",
        slug: "testing",
      },
    ],
  },
  {
    slug: "kiro-cli",
    name: "Kiro CLI",
    badge: "Terminal",
    intro: "Kiro's terminal agent. Compatible with the skills CLI for installing SKILL.md-based knowledge across interactive CLI sessions.",
    introAr: "وكيل الطرفية من Kiro. متوافق مع أمر skills لتثبيت المعرفة المستندة إلى ملفات SKILL.md عبر جلسات سطر الأوامر التفاعلية.",
    icon: "/agents/kiro-cli.svg",
    installCmd: "npx skills add <owner>/<repo>",
    website: "https://kiro.dev",
    websiteName: "kiro.dev",
    topics: [
      {
        title: "CLI Automation",
        titleAr: "أتمتة الطرفية",
        desc: "Terminal shortcuts and procedural execution.",
        descAr: "اختصارات الطرفية والتنفيذ الإجرائي للأوامر.",
        slug: "agent-workflows",
      },
    ],
  },
  {
    slug: "nous-research",
    name: "Nous Research",
    badge: "Open Research",
    intro: "Nous Research builds and ships open agents. Their tooling supports the skills CLI for installing reusable skills across models and open agent frameworks.",
    introAr: "تبني Nous Research وتطلق نماذج ووكلاء مفتوحة المصدر. تدعم أدواتها أمر skills لتثبيت المهارات عبر النماذج وأطر العمل المفتوحة.",
    icon: "/agents/nous-research.svg",
    installCmd: "npx skills add <owner>/<repo>",
    website: "https://nousresearch.com",
    websiteName: "nousresearch.com",
    topics: [
      {
        title: "Research & Agent Loops",
        titleAr: "الأبحاث وحلقات الوكلاء",
        desc: "Autonomous reasoning and tool synthesis.",
        descAr: "الاستدلال المستقل وبناء الأدوات الذكية.",
        slug: "agent-workflows",
      },
    ],
  },
  {
    slug: "opencode",
    name: "OpenCode",
    badge: "Open Source",
    intro: "OpenCode is an open-source AI coding agent that integrates with the skills CLI for repo-scoped skill installations and custom rules.",
    introAr: "وكيل برمجي مفتوح المصدر يتكامل مع أمر skills لتثبيت المهارات والقواعد المخصصة على مستوى المستودع.",
    icon: "/agents/opencode.svg",
    installCmd: "npx skills add <owner>/<repo>",
    website: "https://opencode.ai",
    websiteName: "opencode.ai",
    topics: [
      {
        title: "Coding Workflows",
        titleAr: "مسارات عمل البرمجة",
        desc: "Open source procedures and language rules.",
        descAr: "الإجراءات البرمجية مفتوحة المصدر وقواعد اللغات.",
        slug: "agent-workflows",
      },
    ],
  },
  {
    slug: "roo",
    name: "Roo Code",
    badge: "VS Code",
    intro: "Roo Code is an autonomous coding agent with skills CLI compatibility for project-scoped guidance, automated refactoring, and code review.",
    introAr: "وكيل برمجي مستقل مع توافق كامل مع أمر skills للحصول على إرشادات المشروع وإعادة الهيكلة التلقائية ومراجعة الكود.",
    icon: "/agents/roo.svg",
    installCmd: "npx skills add <owner>/<repo>",
    website: "https://roocode.com",
    websiteName: "roocode.com",
    topics: [
      {
        title: "Refactoring & TDD",
        titleAr: "إعادة الهيكلة و TDD",
        desc: "Safe code transforms and test loops.",
        descAr: "تحويلات الكود الآمنة وحلقات الاختبار المتتابعة.",
        slug: "testing",
      },
    ],
  },
  {
    slug: "trae",
    name: "Trae",
    badge: "ByteDance",
    intro: "Trae is an adaptive AI coding IDE that supports the skills CLI for installing reusable knowledge across sessions and code generation tasks.",
    introAr: "بيئة تطوير ذكية متكيفة تدعم أمر skills لتثبيت المعرفة الإجرائية القابلة لإعادة الاستخدام عبر الجلسات ومهام توليد الأكواد.",
    icon: "/agents/trae.svg",
    installCmd: "npx skills add <owner>/<repo>",
    website: "https://trae.ai",
    websiteName: "trae.ai",
    topics: [
      {
        title: "Fullstack Skills",
        titleAr: "مهارات الفل ستاك",
        desc: "End-to-end web workflows and component building.",
        descAr: "مسارات عمل الويب المتكاملة وبناء المكونات.",
        slug: "react",
      },
    ],
  },
  {
    slug: "vscode",
    name: "VS Code",
    badge: "Microsoft",
    intro: "Visual Studio Code's GitHub Copilot Chat and agent features support the skills CLI for installing procedural guidelines and prompt rules.",
    introAr: "محرر VS Code مع ميزات Copilot Chat والوكلاء يدعم أمر skills لتثبيت الإرشادات الإجرائية وقواعد التوجيه.",
    icon: "/agents/vscode.svg",
    installCmd: "npx skills add <owner>/<repo>",
    website: "https://code.visualstudio.com",
    websiteName: "code.visualstudio.com",
    topics: [
      {
        title: "Editor Integration",
        titleAr: "تكامل المحرر",
        desc: "Workspace prompt files and task configurations.",
        descAr: "ملفات توجيه مساحة العمل وإعدادات المهام.",
        slug: "agent-workflows",
      },
    ],
  },
  {
    slug: "zed",
    name: "Zed",
    badge: "Rust Native",
    intro: "Rust-based ultra-fast code editor with a built-in agent panel and native parallel agents. The skills CLI installs SKILL.md files that Zed agents leverage directly.",
    introAr: "محرر أكواد فائق السرعة مبني بلغة Rust مع لوحة وكلاء مدمجة ووكلاء متوازيين. يثبت أمر skills ملفات SKILL.md لتستفيد منها وكلاء Zed مباشرة.",
    icon: "/agents/zed.svg",
    installCmd: "npx skills add <owner>/<repo>",
    website: "https://zed.dev",
    websiteName: "zed.dev",
    topics: [
      {
        title: "High Performance Systems",
        titleAr: "الأنظمة عالية الأداء",
        desc: "Rust patterns, concurrent safety, and memory management.",
        descAr: "أنماط Rust وأمان التزامن وإدارة الذاكرة.",
        slug: "architecture",
      },
      {
        title: "Agent Workflows",
        titleAr: "سير عمل الوكلاء",
        desc: "Parallel task execution and subagent control.",
        descAr: "تنفيذ المهام المتوازية والتحكم في الوكلاء الفرعيين.",
        slug: "agent-workflows",
      },
    ],
  },
];

export function getAgentBySlug(slug: string): AgentInfo | undefined {
  const normalized = slug.toLowerCase().trim();
  return ALL_AGENTS.find(
    (a) =>
      a.slug === normalized ||
      a.name.toLowerCase() === normalized ||
      (normalized === "clawdbot" && a.slug === "clawdbot") ||
      (normalized === "openclaw" && a.slug === "clawdbot")
  );
}
