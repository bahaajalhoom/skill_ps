import { MultiAgentInstallCommands } from "../types/skills";

export function generateInstallCommands(
  source: string,
  skillId: string,
  repoUrl?: string
): MultiAgentInstallCommands {
  const cleanSource = source.replace(/^https?:\/\/github\.com\//, "").replace(/\/$/, "");
  const targetRepo = repoUrl || `https://github.com/${cleanSource}`;
  
  // RAW GitHub base URL
  const rawBase = `https://raw.githubusercontent.com/${cleanSource}/main`;
  const rawSkillUrl = `${rawBase}/skills/${skillId}/SKILL.md`;

  return {
    cli: `npx skills add ${targetRepo} --skill ${skillId}`,
    claudeCode: `# Add to Claude Code:\nnpx skills add ${targetRepo} --skill ${skillId}\n# Or manually copy to: ~/.claude/skills/${skillId}/SKILL.md`,
    cursor: `# Add to Cursor project rules:\nmkdir -p .cursor/skills\ncurl -fsSL ${rawSkillUrl} -o .cursor/skills/${skillId}.md`,
    antigravity: `# Add to Google Antigravity / Gemini CLI:\nmkdir -p ~/.gemini/antigravity/skills/${skillId}\ncurl -fsSL ${rawSkillUrl} -o ~/.gemini/antigravity/skills/${skillId}/SKILL.md`,
    windsurf: `# Add to Windsurf cascade:\nmkdir -p .windsurf/skills\ncurl -fsSL ${rawSkillUrl} -o .windsurf/skills/${skillId}.md`,
    copilot: `# Add to GitHub Copilot:\nmkdir -p .copilot/skills\ncurl -fsSL ${rawSkillUrl} -o .copilot/skills/${skillId}.md`,
  };
}
