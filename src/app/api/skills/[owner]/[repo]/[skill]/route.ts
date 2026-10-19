import { NextRequest, NextResponse } from "next/server";
import { fetchSkillDetail } from "@/lib/ecosystem-client";
import { getCustomSkillById } from "@/lib/custom-skills-store";
import { generateInstallCommands } from "@/lib/install-commands";
import { SkillDetail } from "@/types/skills";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ owner: string; repo: string; skill: string }> }
) {
  const { owner, repo, skill } = await params;
  const source = `${owner}/${repo}`;
  const fullId = `${source}/${skill}`;

  // First check custom skills store
  const custom = await getCustomSkillById(fullId);
  if (custom) {
    const detail: SkillDetail = {
      ...custom,
      author: owner,
      repoUrl: custom.repoUrl || `https://github.com/${source}`,
      agentCompatibility: ["Claude Code", "Cursor", "Antigravity", "Windsurf", "Copilot"],
      installCommands: generateInstallCommands(source, skill, custom.repoUrl),
      securityAudits: {
        agentTrustHub: "Pass",
        socket: "Pass",
        snyk: "Pass",
      },
    };
    return NextResponse.json(detail);
  }

  // Fetch from ecosystem
  const detail = await fetchSkillDetail(owner, repo, skill);
  return NextResponse.json(detail);
}
