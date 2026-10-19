import { NextRequest, NextResponse } from "next/server";
import { addCustomSkill, getCustomSkills, deleteCustomSkill } from "@/lib/custom-skills-store";
import { CustomSkillInput } from "@/types/skills";

export async function GET() {
  const skills = await getCustomSkills();
  return NextResponse.json({ skills, count: skills.length });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CustomSkillInput;

    if (!body.name || !body.source) {
      return NextResponse.json(
        { error: "Skill name and repository source are required" },
        { status: 400 }
      );
    }

    const created = await addCustomSkill({
      name: body.name,
      source: body.source,
      description: body.description || `Custom skill ${body.name}`,
      category: body.category || "custom",
      markdownContent: body.markdownContent || `# ${body.name}\n\nCustom agent skill workflow.`,
      repoUrl: body.repoUrl,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message || "Failed to create skill" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Skill ID is required" }, { status: 400 });
  }

  const success = await deleteCustomSkill(id);
  return NextResponse.json({ success });
}
