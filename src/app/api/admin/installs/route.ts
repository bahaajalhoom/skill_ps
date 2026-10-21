import { NextRequest, NextResponse } from "next/server";
import { getLocalInstallLogs, getLocalTelemetryStats, clearLocalInstallLogs } from "@/lib/install-telemetry-store";
import { apiFetch } from "@/lib/api-config";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "100", 10);
  const page = parseInt(searchParams.get("page") || "0", 10);
  const search = searchParams.get("q") || "";

  // 1. Try remote backend if configured
  try {
    const remoteRes = await apiFetch(`/api/admin/installs?limit=${limit}&page=${page}&q=${encodeURIComponent(search)}`);
    if (remoteRes.ok) {
      const data = await remoteRes.json();
      if (data && data.success) {
        return NextResponse.json(data);
      }
    }
  } catch (err) {
    console.warn("Failed to fetch admin stats from remote backend, falling back to local store:", err);
  }

  // 2. Fallback to local store
  try {
    const offset = page * limit;
    const { logs, total } = await getLocalInstallLogs(limit, offset, search);
    const stats = await getLocalTelemetryStats();

    return NextResponse.json({
      success: true,
      stats,
      logs,
      total,
      page,
      limit,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to load telemetry" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await apiFetch("/api/admin/installs", { method: "DELETE" }).catch(() => {});
    await clearLocalInstallLogs();
    return NextResponse.json({ success: true, message: "Logs cleared" });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to clear logs" },
      { status: 500 }
    );
  }
}
