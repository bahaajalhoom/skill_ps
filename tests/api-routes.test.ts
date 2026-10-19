import assert from "node:assert";
import test from "node:test";
import { fetchLiveSkills, searchLiveSkills, fetchSkillDetail } from "../src/lib/ecosystem-client";

test("fetchLiveSkills returns skills array and total count", async () => {
  const result = await fetchLiveSkills("all-time", 0);
  assert.ok(Array.isArray(result.skills), "skills should be an array");
  assert.ok(result.skills.length > 0, "should return at least one skill");
  assert.ok(result.total > 0, "total count should be greater than zero");

  const first = result.skills[0];
  assert.ok(first.name, "skill should have name");
  assert.ok(first.source, "skill should have source");
});

test("searchLiveSkills returns matching skills", async () => {
  const result = await searchLiveSkills("git");
  assert.strictEqual(result.query, "git");
  assert.ok(Array.isArray(result.skills), "skills should be an array");
  assert.ok(result.skills.length > 0, "should find results for git");
});

test("fetchSkillDetail returns rich metadata and commands", async () => {
  const detail = await fetchSkillDetail("vercel-labs", "skills", "find-skills");
  assert.strictEqual(detail.skillId, "find-skills");
  assert.ok(detail.installCommands.cli.includes("npx skills add"));
  assert.ok(detail.installCommands.antigravity.includes("~/.gemini/antigravity/skills"));
  assert.ok(detail.markdownContent && detail.markdownContent.length > 0);
});
