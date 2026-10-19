import fs from "node:fs/promises";
import path from "node:path";
import { CustomSkillInput, SkillLeaderboardItem } from "../types/skills";

const DATA_DIR = path.join(process.cwd(), ".data");
const STORE_FILE = path.join(DATA_DIR, "custom-skills.json");

interface StoredCustomSkill extends SkillLeaderboardItem {
  markdownContent: string;
  createdAt: string;
  updatedAt: string;
}

async function ensureStoreExists(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(STORE_FILE);
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
    return JSON.parse(raw);
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
    weeklyInstalls: [1, 2, 3, 5, 8, 12, 18, 25],
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
      createdAt: skills[existingIndex].createdAt,
    };
  } else {
    skills.unshift(newSkill);
  }

  await writeStore(skills);
  return newSkill;
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
