# skill_ps 🇵🇸

> **The Open Agent Skills Directory & Marketplace Frontend**  
> Inspired by [skills.sh](https://www.skills.sh) and [agenticskills.io](https://agenticskills.io). Built with Next.js 15, React 19, Tailwind CSS, and TypeScript.

---

## ✨ Features

- 🇵🇸 **Palestine Flag Brand Identity**: Built with pride featuring the official Flag of Palestine.
- ⚡ **1,409,643+ Skills Live Directory**: Infinite scroll pagination across All-Time, Trending (24h), and Hot leaderboards.
- 🔍 **Instant Live Search**: Global fuzzy search across all 1.4M+ ecosystem skills with `/` keyboard shortcut.
- 🛠️ **Universal Multi-Agent Install Commands**:
  - **Skills CLI**: `npx skills add <source> --skill <id>`
  - **Claude Code**: Single-command plugin add or workspace sync
  - **Cursor**: Download directly to `.cursor/skills/`
  - **Google Antigravity**: Direct install into `~/.gemini/antigravity/skills/`
  - **Windsurf & Copilot**: Ready-to-use rule and skill files
- 📖 **Deep Documentation & Markdown Viewer**: Full `SKILL.md` parser with frontmatter breakdown and security audit badges (Socket, Snyk, Agent Trust Hub).
- 🌐 **Full Bilingual Support**: Instant toggle between Arabic (RTL with Cairo font) and English (LTR).
- ➕ **Dynamic Skill Importer**: Import any skill directly from GitHub (`owner/repo`) or author custom skills dynamically.

---

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Environment Configuration
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://skill-ps-api.apps.taqat.academy
```

### 3. Run Development Server
```bash
npm run dev -p 3004
```
Open [http://localhost:3004](http://localhost:3004) in your browser.

### 4. Production Build
```bash
npm run build
npm start
```

---

## 🔗 Connected Backend API
- Backend Repository: [github.com/bahaajalhoom/skill_ps_back](https://github.com/bahaajalhoom/skill_ps_back)
- Production API URL: `http://skill-ps-api.apps.taqat.academy/`

---

## 📄 License
MIT © [Bahaa Jalhoom](https://github.com/bahaajalhoom)
