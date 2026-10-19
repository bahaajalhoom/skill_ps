import { NextRequest, NextResponse } from "next/server";
import { searchLiveSkills } from "@/lib/ecosystem-client";
import { getCustomSkills } from "@/lib/custom-skills-store";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  if (!q.trim()) {
    return NextResponse.json({ query: "", skills: [], count: 0 });
  }

  const liveResults = await searchLiveSkills(q);

  // Check if any custom skills match
  const custom = await getCustomSkills();
  const qLower = q.toLowerCase();
  const matchedCustom = custom.filter(
    (s) =>
      s.name.toLowerCase().includes(qLower) ||
      s.source.toLowerCase().includes(qLower) ||
      (s.description && s.description.toLowerCase().includes(qLower))
  );

  const combined = [...matchedCustom, ...liveResults.skills];

  return NextResponse.json({
    query: q,
    skills: combined,
    count: combined.length,
  });
}
