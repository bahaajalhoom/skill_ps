import assert from "node:assert";
import test from "node:test";
import {
  addCustomSkill,
  getCustomSkills,
  getCustomSkillById,
  deleteCustomSkill,
  clearCustomSkillsForTesting,
} from "../src/lib/custom-skills-store";

test("custom skills store creates, lists, finds, and deletes skills", async () => {
  await clearCustomSkillsForTesting();

  const initialList = await getCustomSkills();
  assert.strictEqual(initialList.length, 0, "Initial store should be empty");

  const created = await addCustomSkill({
    name: "my-custom-scraper",
    source: "jalhoom/my-skills",
    description: "An automated web scraping agent skill",
    category: "automation",
    markdownContent: "# My Scraper\n\nAutomates browser operations.",
  });

  assert.ok(created.id, "Skill should have an ID");
  assert.strictEqual(created.name, "my-custom-scraper");
  assert.strictEqual(created.source, "jalhoom/my-skills");
  assert.strictEqual(created.isCustom, true);

  const listAfterAdd = await getCustomSkills();
  assert.strictEqual(listAfterAdd.length, 1);
  assert.strictEqual(listAfterAdd[0].name, "my-custom-scraper");

  const fetched = await getCustomSkillById(created.id);
  assert.ok(fetched, "Skill should be found by ID");
  assert.strictEqual(fetched?.name, "my-custom-scraper");

  const deleted = await deleteCustomSkill(created.id);
  assert.strictEqual(deleted, true, "Delete should succeed");

  const listAfterDelete = await getCustomSkills();
  assert.strictEqual(listAfterDelete.length, 0, "Store should be empty after deletion");
});
