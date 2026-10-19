# Dynamic Agent Skills Store (skills.sh Clone & Hub) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-grade, dynamic Next.js 15 Agent Skills Store that connects to the live ecosystem of 1,400,000+ skills with real-time search, infinite-scroll leaderboards, multi-agent installation command generation (Skills CLI, Claude Code, Cursor, Antigravity, Copilot, Windsurf), markdown documentation viewer, custom skill authoring/importing, and bilingual (EN/AR) dark-mode UI.

**Architecture:** Next.js 15 App Router with TypeScript and Tailwind CSS. A resilient server-side proxy layer connects directly to live upstream ecosystem endpoints (`/api/skills/*` and `/api/search`) with intelligent caching and local fallbacks. Client-side features virtualized / infinite-scroll leaderboards, reactive search palette, multi-agent install switchers, and local custom skill persistence.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Lucide Icons, Node.js FS/SQLite local persistence, React Markdown.

**Spec:** [docs/superpowers/specs/2026-10-19-agent-skills-store-design.md](file:///Users/jalhoom/Desktop/skillps/docs/superpowers/specs/2026-10-19-agent-skills-store-design.md)

## Global Constraints

- Must run smoothly on Node.js 18+ with zero mandatory external database configuration (`npm run dev`).
- Dark-mode aesthetic adhering to Vercel/skills.sh palette (`#000000` deep black, `--ds-gray-*` tokens, monospace fonts).
- 100% real data connectivity: connects to live 1.4M+ ecosystem endpoints with instant failover to embedded cache.
- Multi-agent install command accuracy: every skill must output valid commands for Skills CLI, Claude Code, Cursor, Antigravity, and Windsurf/Copilot.
- Full bilingual Arabic (RTL) and English (LTR) toggle without broken layouts.

## Review Focus

1. Upstream network timeouts or rate limits when fetching `/api/skills/{view}/{page}` → graceful fallback to local cache without crashing.
2. Malformed or missing `weeklyInstalls` array in skills → sparkline component must render a clean flat or zero-safe SVG curve without NaN errors.
3. Complex multi-part skill repo URLs (e.g. `owner/repo/skills/sub-skill`) → command generator must correctly parse source and skillId.
4. Mobile / small screens → table must horizontally scroll or switch to compact cards without overflowing viewport.
5. Search query rapid typing → debouncing must avoid duplicate in-flight requests and race conditions.

---

### Task 1: Project Scaffolding & Design System Setup

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `tailwind.config.ts`
- Create: `postcss.config.mjs`
- Create: `src/app/globals.css`
- Create: `src/app/layout.tsx`

**Interfaces:**
- Produces: Base Next.js 15 project structure with Tailwind dark theme tokens, Geist/Fira fonts, and standard metadata.

- [ ] **Step 1: Create `package.json` with Next.js 15, React 19, Tailwind CSS, and Lucide Icons**
- [ ] **Step 2: Create `tsconfig.json` with strict TypeScript configuration and `@/*` path alias**
- [ ] **Step 3: Create `tailwind.config.ts` and `postcss.config.mjs` configuring dark mode and custom colors**
- [ ] **Step 4: Create `src/app/globals.css` with Vercel design system variables (`--ds-gray-*`) and RTL support**
- [ ] **Step 5: Create `src/app/layout.tsx` with font imports, metadata, and dark background wrapper**
- [ ] **Step 6: Run `npm install` and verify build initialization**
  Run: `npm install`
  Expected: Dependencies resolved and installed successfully.
- [ ] **Step 7: Commit**
  ```bash
  git add package.json tsconfig.json next.config.ts tailwind.config.ts postcss.config.mjs src/
  git commit -m "chore: scaffold Next.js 15 project with tailwind design system"
  ```

---

### Task 2: Core Data Types, Seed Fallbacks & Persistence Layer

**Files:**
- Create: `src/types/skills.ts`
- Create: `src/data/seed-skills.ts`
- Create: `src/lib/custom-skills-store.ts`
- Create: `tests/skills-store.test.ts`

**Interfaces:**
- Produces: `SkillLeaderboardItem`, `SkillDetail`, `CustomSkillInput`, `CustomSkillsStore` helper functions.
- Consumes: Node.js file system for JSON persistence in `.data/custom-skills.json`.

- [ ] **Step 1: Write unit tests in `tests/skills-store.test.ts` for custom skills store (add, list, find)**
- [ ] **Step 2: Run test to verify it fails**
  Run: `npx tsx tests/skills-store.test.ts`
  Expected: FAIL (module not found)
- [ ] **Step 3: Implement `src/types/skills.ts` defining all skill data structures, leaderboard models, and agent platforms**
- [ ] **Step 4: Implement `src/data/seed-skills.ts` containing 60+ verified top skills (find-skills, grill-me, agent-browser, etc.)**
- [ ] **Step 5: Implement `src/lib/custom-skills-store.ts` with file-backed JSON CRUD operations and deduplication**
- [ ] **Step 6: Run test to verify it passes**
  Run: `npx tsx tests/skills-store.test.ts`
  Expected: PASS
- [ ] **Step 7: Commit**
  ```bash
  git add src/types/ src/data/ src/lib/ tests/
  git commit -m "feat: add skill types, seed fallbacks, and custom skills persistence"
  ```

---

### Task 3: Multi-Agent Install Command Generator & Ingestion Engine

**Files:**
- Create: `src/lib/install-commands.ts`
- Create: `src/lib/ecosystem-client.ts`
- Create: `tests/install-commands.test.ts`

**Interfaces:**
- Produces: `generateInstallCommands(source: string, skillId: string, repoUrl?: string)` returning commands for CLI, Claude Code, Cursor, Antigravity, Windsurf, Copilot.
- Produces: `fetchLiveSkills(view, page)`, `searchLiveSkills(query)`, and `fetchSkillMarkdown(source, skillId)`.

- [ ] **Step 1: Write unit test in `tests/install-commands.test.ts` verifying commands for various repository patterns**
- [ ] **Step 2: Run test to verify it fails**
  Run: `npx tsx tests/install-commands.test.ts`
  Expected: FAIL
- [ ] **Step 3: Implement `src/lib/install-commands.ts` with accurate multi-agent syntax and copy templates**
- [ ] **Step 4: Implement `src/lib/ecosystem-client.ts` with live upstream fetching, timeouts, and seed fallbacks**
- [ ] **Step 5: Run tests to verify it passes**
  Run: `npx tsx tests/install-commands.test.ts`
  Expected: PASS
- [ ] **Step 6: Commit**
  ```bash
  git add src/lib/ tests/
  git commit -m "feat: implement multi-agent install command generator and ecosystem client"
  ```

---

### Task 4: Ecosystem & Custom Skills API Endpoints

**Files:**
- Create: `src/app/api/skills/route.ts`
- Create: `src/app/api/skills/search/route.ts`
- Create: `src/app/api/skills/[owner]/[repo]/[skill]/route.ts`
- Create: `src/app/api/custom-skills/route.ts`
- Create: `tests/api-routes.test.ts`

**Interfaces:**
- Produces: REST endpoints for live leaderboard pagination, live search, skill detail resolution, and custom skills submission.

- [ ] **Step 1: Write integration tests in `tests/api-routes.test.ts` verifying API response payloads**
- [ ] **Step 2: Implement `src/app/api/skills/route.ts` handling `?view=all-time&page=0` with live upstream and seed fallback**
- [ ] **Step 3: Implement `src/app/api/skills/search/route.ts` handling `?q=...` with debouncing support and search results**
- [ ] **Step 4: Implement `src/app/api/skills/[owner]/[repo]/[skill]/route.ts` returning full detail, commands, and markdown**
- [ ] **Step 5: Implement `src/app/api/custom-skills/route.ts` handling GET and POST for custom skills**
- [ ] **Step 6: Run tests and verify all routes return valid status and data**
  Run: `npx tsx tests/api-routes.test.ts`
  Expected: PASS
- [ ] **Step 7: Commit**
  ```bash
  git add src/app/api/ tests/
  git commit -m "feat: implement ecosystem and custom skills API routes"
  ```

---

### Task 5: UI Components: ASCII Banner, Agent Carousel, Sparkline & Navbar

**Files:**
- Create: `src/components/AsciiBanner.tsx`
- Create: `src/components/AgentCarousel.tsx`
- Create: `src/components/Sparkline.tsx`
- Create: `src/components/Navbar.tsx`
- Create: `src/components/SearchDialog.tsx`
- Create: `src/context/LanguageContext.tsx`

**Interfaces:**
- Produces: Visual building blocks matching skills.sh aesthetic, bilingual language context (EN/AR), and search modal.

- [ ] **Step 1: Implement `src/context/LanguageContext.tsx` with English/Arabic dictionaries and RTL document direction switcher**
- [ ] **Step 2: Implement `src/components/AsciiBanner.tsx` rendering the skills.sh terminal ASCII emblem**
- [ ] **Step 3: Implement `src/components/AgentCarousel.tsx` with animated logos for all supported agents**
- [ ] **Step 4: Implement `src/components/Sparkline.tsx` drawing clean SVG weekly install activity curves**
- [ ] **Step 5: Implement `src/components/Navbar.tsx` with brand logo, search trigger (`/`), language switch, and custom skills link**
- [ ] **Step 6: Implement `src/components/SearchDialog.tsx` modal for real-time ecosystem search with keyboard navigation**
- [ ] **Step 7: Commit**
  ```bash
  git add src/components/ src/context/
  git commit -m "feat: add ASCII banner, agent carousel, sparkline, and navigation components"
  ```

---

### Task 6: Leaderboard Table & Infinite-Scroll Explorer

**Files:**
- Create: `src/components/LeaderboardTable.tsx`
- Create: `src/components/TabSelector.tsx`
- Create: `src/app/page.tsx`

**Interfaces:**
- Consumes: `/api/skills` and `/api/custom-skills`.
- Produces: The primary interactive leaderboard supporting All-Time, Trending, Hot, and Custom Skills with infinite pagination.

- [ ] **Step 1: Implement `src/components/TabSelector.tsx` for switching views (All Time, Trending 24h, Hot, Custom)**
- [ ] **Step 2: Implement `src/components/LeaderboardTable.tsx` with rank numbers, verified badges, sparklines, install counters, and quick copy**
- [ ] **Step 3: Implement infinite scrolling logic using IntersectionObserver to load subsequent pages dynamically**
- [ ] **Step 4: Implement `src/app/page.tsx` integrating Navbar, Hero section, Counter (`1,409,643+`), and Leaderboard**
- [ ] **Step 5: Commit**
  ```bash
  git add src/components/LeaderboardTable.tsx src/components/TabSelector.tsx src/app/page.tsx
  git commit -m "feat: implement interactive infinite-scroll leaderboard page"
  ```

---

### Task 7: Skill Detail Page, Multi-Agent Install Drawer & Markdown Viewer

**Files:**
- Create: `src/components/InstallCommandCard.tsx`
- Create: `src/components/SkillMarkdownViewer.tsx`
- Create: `src/components/SkillDetailModal.tsx`
- Create: `src/app/[owner]/[repo]/[skill]/page.tsx`

**Interfaces:**
- Consumes: `/api/skills/[owner]/[repo]/[skill]`.
- Produces: Dedicated skill detail page and quick-preview modal drawer with multi-agent tabs and rendered documentation.

- [ ] **Step 1: Implement `src/components/InstallCommandCard.tsx` with tabs for CLI, Claude, Cursor, Antigravity, Windsurf, Copilot, and 1-click copy**
- [ ] **Step 2: Implement `src/components/SkillMarkdownViewer.tsx` rendering markdown instructions with frontmatter info cards**
- [ ] **Step 3: Implement `src/components/SkillDetailModal.tsx` for quick inline viewing directly from the leaderboard**
- [ ] **Step 4: Implement `src/app/[owner]/[repo]/[skill]/page.tsx` for direct URL access to any skill in the ecosystem**
- [ ] **Step 5: Commit**
  ```bash
  git add src/components/ src/app/
  git commit -m "feat: implement skill detail pages with multi-agent install commands and markdown viewer"
  ```

---

### Task 8: Dynamic Skill Creator / GitHub Importer & Verification

**Files:**
- Create: `src/components/AddSkillModal.tsx`
- Create: `src/app/custom/page.tsx`

**Interfaces:**
- Consumes: `POST /api/custom-skills`.
- Produces: Interactive modal and dedicated page for importing GitHub skills or writing custom skills with immediate persistence.

- [ ] **Step 1: Implement `src/components/AddSkillModal.tsx` with GitHub repo URL parser and manual markdown editor**
- [ ] **Step 2: Implement `src/app/custom/page.tsx` displaying user's personal skills repository with management options**
- [ ] **Step 3: Run comprehensive verification: test live search, pagination, install command generation, and custom additions**
- [ ] **Step 4: Run production build `npm run build` to verify strict TypeScript, linting, and Next.js optimization pass**
- [ ] **Step 5: Final commit**
  ```bash
  git add .
  git commit -m "feat: complete dynamic agent skills store with full ecosystem integration"
  ```
