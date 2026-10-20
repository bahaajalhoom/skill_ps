import { NextRequest, NextResponse } from "next/server";
import { fetchLiveSkills } from "@/lib/ecosystem-client";
import { getCustomSkills } from "@/lib/custom-skills-store";
import { LeaderboardView } from "@/types/skills";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const view = (searchParams.get("view") || "all-time") as LeaderboardView;
  const page = parseInt(searchParams.get("page") || "0", 10);

  if (view === "custom") {
    const custom = await getCustomSkills();
    return NextResponse.json({
      skills: custom,
      page: 0,
      total: custom.length,
      hasMore: false,
      view: "custom",
    });
  }

  const liveData = await fetchLiveSkills(view, page);

  // If on page 0 and in all-time view, prepend custom skills if any exist
  if (page === 0 && view === "all-time") {
    const custom = await getCustomSkills();
    if (custom.length > 0) {
      // DEDUPLICATE: Filter out any custom skill that collides with an official ecosystem skill!
      const safeCustom = custom.filter(
        (c) =>
          c.isCustom &&
          !liveData.skills.some(
            (s) => s.id === c.id || s.name.toLowerCase() === c.name.toLowerCase()
          )
      );
      if (safeCustom.length > 0) {
        liveData.skills = [...safeCustom, ...liveData.skills];
      }
    }
  }

  return NextResponse.json(liveData, {
    headers: {
      "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
    },
  });
}
