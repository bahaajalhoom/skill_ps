import { NextRequest, NextResponse } from "next/server";
import { incrementCustomSkillInstalls } from "@/lib/custom-skills-store";
import { recordLocalInstallLog } from "@/lib/install-telemetry-store";
import { extractNextClientIp, resolveNextGeo, parseNextUserAgent } from "@/lib/geo";
import { InstallLog } from "@/types/skills";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = body.id || body.skillId || body.name;
    const agentTarget = body.agentTarget || "cli";

    if (!id) {
      return NextResponse.json({ error: "Skill ID is required" }, { status: 400 });
    }

    // Only custom skills support dynamic local install increments & telemetry logging
    const updated = await incrementCustomSkillInstalls(id);
    if (updated) {
      // Capture client IP, User-Agent, and Geolocation
      const ip = extractNextClientIp(request);
      const uaRaw = request.headers.get("user-agent") || "";
      const uaParsed = parseNextUserAgent(uaRaw);
      const geo = await resolveNextGeo(ip, request);

      const log: InstallLog = {
        id: `inst_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        skillId: updated.id,
        skillName: updated.name,
        source: updated.source,
        ip,
        country: geo.country,
        countryCode: geo.countryCode,
        city: geo.city,
        region: geo.region,
        latitude: geo.latitude,
        longitude: geo.longitude,
        isp: geo.isp,
        userAgent: uaRaw,
        browser: uaParsed.browser,
        os: uaParsed.os,
        device: uaParsed.device,
        agentTarget,
        createdAt: new Date().toISOString(),
      };

      await recordLocalInstallLog(log);

      return NextResponse.json({
        success: true,
        id: updated.id,
        installs: updated.installs,
        weeklyInstalls: updated.weeklyInstalls,
        log,
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
