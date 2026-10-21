export type LeaderboardView = "all-time" | "trending" | "hot" | "custom";

export interface SkillLeaderboardItem {
  id: string;               // e.g. "vercel-labs/skills/find-skills"
  source: string;           // e.g. "vercel-labs/skills"
  skillId: string;          // e.g. "find-skills"
  name: string;             // e.g. "find-skills"
  installs: number;         // e.g. 3936802
  weeklyInstalls?: number[];// Array of 8 weekly numbers
  isOfficial?: boolean;     // Verified badge
  isCustom?: boolean;       // User created/imported
  description?: string;     // Short summary
  category?: string;        // e.g. "workflow", "coding", "testing"
  stars?: number;
  authorAvatar?: string;
  repoUrl?: string;
}

export interface MultiAgentInstallCommands {
  cli: string;
  claudeCode: string;
  cursor: string;
  antigravity: string;
  windsurf: string;
  copilot: string;
}

export interface SkillSecurityAudits {
  agentTrustHub?: "Pass" | "Warn" | "Fail";
  socket?: "Pass" | "Warn" | "Fail";
  snyk?: "Pass" | "Warn" | "Fail";
}

export interface SkillDetail extends SkillLeaderboardItem {
  author: string;
  repoUrl: string;
  rawSkillUrl?: string;
  markdownContent?: string;
  description: string;
  agentCompatibility: string[];
  installCommands: MultiAgentInstallCommands;
  securityAudits?: SkillSecurityAudits;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomSkillInput {
  name: string;
  source: string;
  description: string;
  category?: string;
  markdownContent: string;
  repoUrl?: string;
}

export interface EcosystemPageResponse {
  skills: SkillLeaderboardItem[];
  page: number;
  total: number;
  hasMore: boolean;
  view?: string;
}

export interface SearchResponse {
  query: string;
  skills: SkillLeaderboardItem[];
  count: number;
}

export interface InstallLog {
  id: string;
  skillId: string;
  skillName: string;
  source: string;
  ip: string;
  deviceUser: string;
  country: string;
  countryCode: string;
  city: string;
  region: string;
  latitude?: number;
  longitude?: number;
  isp?: string;
  userAgent: string;
  browser: string;
  os: string;
  device: string;
  agentTarget: string;
  createdAt: string;
}

export interface TelemetryStats {
  totalInstalls: number;
  uniqueIps: number;
  countriesCount: number;
  topCustomSkills: { name: string; source: string; installs: number }[];
  countryBreakdown: { country: string; countryCode: string; count: number }[];
  agentBreakdown: { agent: string; count: number }[];
}

export interface AdminTelemetryResponse {
  success: boolean;
  stats: TelemetryStats;
  logs: InstallLog[];
  total: number;
  page: number;
  limit: number;
}
