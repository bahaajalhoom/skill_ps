import { NextRequest, NextResponse } from "next/server";
import { incrementCustomSkillInstalls } from "@/lib/custom-skills-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = body.id || body.skillId || body.name;

    if (!id) {
      return NextResponse.json({ error: "Skill ID is required" }, { status: 400 });
    }

    // Only custom skills support dynamic local install increments
    const updated = await incrementCustomSkillInstalls(id);
    if (updated) {
      return NextResponse.json({
        success: true,
        id: updated.id,
        installs: updated.installs,
        weeklyInstalls: updated.weeklyInstalls,
      });
    }

    // For official/ecosystem skills, do NOT alter their verified install numbers
    return NextResponse.json({
      success: false,
      message: "Ecosystem skill installs are tracked upstream and cannot be overwritten.",
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message || "Failed to record install" },
      { status: 500 }
    );
  }
}
