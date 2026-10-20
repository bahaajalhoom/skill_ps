import fs from "node:fs/promises";
import path from "node:path";
import { CustomSkillInput, SkillLeaderboardItem } from "../types/skills";

const DATA_DIR = path.join(process.cwd(), ".data");
const STORE_FILE = path.join(DATA_DIR, "custom-skills.json");

export interface StoredCustomSkill extends SkillLeaderboardItem {
  markdownContent: string;
  createdAt: string;
  updatedAt: string;
}

// Seed skills that are NEVER lost across restarts or new deployments
export const DEFAULT_CUSTOM_SKILLS: StoredCustomSkill[] = [
  {
    id: "yousefnaim/yousefnaim-protofolio/yousefnaim-protofolio",
    source: "yousefnaim/yousefnaim-protofolio",
    skillId: "yousefnaim-protofolio",
    name: "yousefnaim-protofolio",
    installs: 3,
    weeklyInstalls: [1, 2, 3, 5, 8, 12, 18, 25],
    isOfficial: false,
    isCustom: true,
    description: "Imported skill from https://github.com/yousefnaim/yousefnaim-protofolio",
    category: "imported",
    markdownContent:
      "# yousefnaim-protofolio\n\nImported from [yousefnaim/yousefnaim-protofolio](https://github.com/yousefnaim/yousefnaim-protofolio).\n\nRun:\n```bash\nnpx skills add https://github.com/yousefnaim/yousefnaim-protofolio --skill yousefnaim-protofolio\n```",
    createdAt: "2026-10-19T20:45:25.330Z",
    updatedAt: "2026-10-21T00:20:00.000Z",
    stars: 1,
    repoUrl: "https://github.com/yousefnaim/yousefnaim-protofolio",
  },
];

async function ensureStoreExists(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(STORE_FILE);
      // File exists - preserve existing server data!
    } catch {
      await fs.writeFile(STORE_FILE, JSON.stringify([], null, 2), "utf-8");
    }
  } catch (err) {
    console.error("Error initializing custom skills store:", err);
  }
}

async function readStore(): Promise<StoredCustomSkill[]> {
  await ensureStoreExists();
  try {
    const raw = await fs.readFile(STORE_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeStore(skills: StoredCustomSkill[]): Promise<void> {
  await ensureStoreExists();
  await fs.writeFile(STORE_FILE, JSON.stringify(skills, null, 2), "utf-8");
}

export async function getCustomSkills(): Promise<StoredCustomSkill[]> {
  return await readStore();
}

export async function getCustomSkillById(id: string): Promise<StoredCustomSkill | null> {
  const skills = await readStore();
  return skills.find((s) => s.id === id || s.skillId === id) ?? null;
}

export async function addCustomSkill(input: CustomSkillInput): Promise<StoredCustomSkill> {
  const skills = await readStore();

  const skillId = input.name.toLowerCase().trim().replace(/[^a-z0-9_-]/g, "-");
  const source = input.source.trim();
  const id = `${source}/${skillId}`;

  const now = new Date().toISOString();

  const newSkill: StoredCustomSkill = {
    id,
    source,
    skillId,
    name: input.name.trim(),
    installs: 1,
    weeklyInstalls: [0, 0, 0, 0, 0, 0, 0, 1],
    isOfficial: false,
    isCustom: true,
    description: input.description.trim(),
    category: input.category || "custom",
    markdownContent: input.markdownContent,
    createdAt: now,
    updatedAt: now,
    stars: 1,
    repoUrl: input.repoUrl || (source.includes("/") ? `https://github.com/${source}` : undefined),
  };

  // Upsert if exists
  const existingIndex = skills.findIndex((s) => s.id === id);
  if (existingIndex >= 0) {
    skills[existingIndex] = {
      ...skills[existingIndex],
      ...newSkill,
      installs: skills[existingIndex].installs,
      weeklyInstalls: skills[existingIndex].weeklyInstalls,
      createdAt: skills[existingIndex].createdAt,
    };
  } else {
    skills.unshift(newSkill);
  }

  await writeStore(skills);
  return newSkill;
}

/**
 * Real dynamic install counter:
 * Increments install count and updates the activity sparkline in storage.
 */
export async function incrementCustomSkillInstalls(id: string): Promise<StoredCustomSkill | null> {
  const skills = await readStore();
  const target = skills.find((s) => s.id === id || s.skillId === id || s.name === id);
  if (!target) return null;

  target.installs = (target.installs || 0) + 1;
  target.updatedAt = new Date().toISOString();

  if (!Array.isArray(target.weeklyInstalls) || target.weeklyInstalls.length === 0) {
    target.weeklyInstalls = [0, 0, 0, 0, 0, 0, 0, target.installs];
  } else {
    target.weeklyInstalls[target.weeklyInstalls.length - 1] =
      (target.weeklyInstalls[target.weeklyInstalls.length - 1] || 0) + 1;
  }

  await writeStore(skills);
  return target;
}

export async function deleteCustomSkill(id: string): Promise<boolean> {
  const skills = await readStore();
  const filtered = skills.filter((s) => s.id !== id && s.skillId !== id);
  if (filtered.length === skills.length) {
    return false;
  }
  await writeStore(filtered);
  return true;
}

export async function clearCustomSkillsForTesting(): Promise<void> {
  await ensureStoreExists();
  await fs.writeFile(STORE_FILE, JSON.stringify([], null, 2), "utf-8");
}
