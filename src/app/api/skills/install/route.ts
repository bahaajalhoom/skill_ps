import { NextRequest, NextResponse } from "next/server";
import { incrementCustomSkillInstalls, getCustomSkillById } from "@/lib/custom-skills-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = body.id || body.skillId || body.name;

    if (!id) {
      return NextResponse.json({ error: "Skill ID is required" }, { status: 400 });
    }

    const updated = await incrementCustomSkillInstalls(id);
    if (updated) {
      return NextResponse.json({
        success: true,
        id: updated.id,
        installs: updated.installs,
        weeklyInstalls: updated.weeklyInstalls,
      });
    }

    // If not a custom skill, return success with simulated increment
    return NextResponse.json({
      success: true,
      id,
      installs: (body.currentInstalls || 0) + 1,
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message || "Failed to record install" },
      { status: 500 }
    );
  }
}
