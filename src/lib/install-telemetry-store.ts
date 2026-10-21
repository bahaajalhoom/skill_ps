import fs from "node:fs/promises";
import path from "node:path";
import { InstallLog, TelemetryStats } from "../types/skills";

const DATA_DIR = path.join(process.cwd(), ".data");
const TELEMETRY_FILE = path.join(DATA_DIR, "install-logs.json");

async function ensureFileExists(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(TELEMETRY_FILE);
    } catch {
      await fs.writeFile(TELEMETRY_FILE, JSON.stringify([], null, 2), "utf-8");
    }
  } catch (err) {
    console.error("Error creating telemetry directory:", err);
  }
}

async function readLogs(): Promise<InstallLog[]> {
  await ensureFileExists();
  try {
    const raw = await fs.readFile(TELEMETRY_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeLogs(logs: InstallLog[]): Promise<void> {
  await ensureFileExists();
  // Keep last 1,000 logs locally
  const trimmed = logs.slice(0, 1000);
  await fs.writeFile(TELEMETRY_FILE, JSON.stringify(trimmed, null, 2), "utf-8");
}

export async function recordLocalInstallLog(log: InstallLog): Promise<void> {
  const logs = await readLogs();
  logs.unshift(log);
  await writeLogs(logs);
}

export async function getLocalInstallLogs(
  limit = 100,
  offset = 0,
  search?: string
): Promise<{ logs: InstallLog[]; total: number }> {
  let logs = await readLogs();

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    logs = logs.filter(
      (l) =>
        l.skillName.toLowerCase().includes(q) ||
        l.ip.toLowerCase().includes(q) ||
        l.country.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.browser.toLowerCase().includes(q) ||
        l.agentTarget.toLowerCase().includes(q)
    );
  }

  const total = logs.length;
  const sliced = logs.slice(offset, offset + limit);
  return { logs: sliced, total };
}

export async function getLocalTelemetryStats(): Promise<TelemetryStats> {
  const logs = await readLogs();

  const totalInstalls = logs.length;
  const uniqueIps = new Set(logs.map((l) => l.ip)).size;

  const countryCountMap = new Map<string, { country: string; countryCode: string; count: number }>();
  for (const l of logs) {
    const key = l.countryCode || "UN";
    const existing = countryCountMap.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      countryCountMap.set(key, { country: l.country, countryCode: l.countryCode, count: 1 });
    }
  }

  const countryBreakdown = Array.from(countryCountMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const skillCountMap = new Map<string, { name: string; source: string; installs: number }>();
  for (const l of logs) {
    const key = l.skillId;
    const existing = skillCountMap.get(key);
    if (existing) {
      existing.installs += 1;
    } else {
      skillCountMap.set(key, { name: l.skillName, source: l.source, installs: 1 });
    }
  }

  const topCustomSkills = Array.from(skillCountMap.values())
    .sort((a, b) => b.installs - a.installs)
    .slice(0, 5);

  const agentCountMap = new Map<string, number>();
  for (const l of logs) {
    const a = l.agentTarget || "cli";
    agentCountMap.set(a, (agentCountMap.get(a) || 0) + 1);
  }

  const agentBreakdown = Array.from(agentCountMap.entries())
    .map(([agent, count]) => ({ agent, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalInstalls,
    uniqueIps,
    countriesCount: countryCountMap.size,
    topCustomSkills,
    countryBreakdown,
    agentBreakdown,
  };
}

export async function clearLocalInstallLogs(): Promise<boolean> {
  await ensureFileExists();
  await fs.writeFile(TELEMETRY_FILE, JSON.stringify([], null, 2), "utf-8");
  return true;
}
