import assert from "node:assert";
import test from "node:test";
import { generateInstallCommands } from "../src/lib/install-commands";

test("generateInstallCommands generates valid shell commands for all target agents", () => {
  const commands = generateInstallCommands("vercel-labs/skills", "find-skills");

  assert.ok(commands.cli.includes("npx skills add"));
  assert.ok(commands.cli.includes("vercel-labs/skills"));
  assert.ok(commands.cli.includes("--skill find-skills"));

  assert.ok(commands.claudeCode.includes("claude"));
  assert.ok(commands.claudeCode.includes("find-skills"));

  assert.ok(commands.cursor.includes(".cursor/skills/find-skills.md"));

  assert.ok(commands.antigravity.includes("~/.gemini/antigravity/skills/find-skills/SKILL.md"));

  assert.ok(commands.windsurf.includes("windsurf") || commands.windsurf.includes("skills add"));
  assert.ok(commands.copilot.includes("copilot") || commands.copilot.includes("skills add"));
});

test("generateInstallCommands handles custom repo urls and simple identifiers", () => {
  const commands = generateInstallCommands("mattpocock/skills", "grill-me", "https://github.com/mattpocock/skills");

  assert.ok(commands.cli.includes("https://github.com/mattpocock/skills"));
  assert.ok(commands.cli.includes("--skill grill-me"));
  assert.ok(commands.cursor.includes("grill-me.md"));
  assert.ok(commands.antigravity.includes("grill-me/SKILL.md"));
});
