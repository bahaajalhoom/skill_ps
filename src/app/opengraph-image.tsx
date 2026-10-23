import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Skills.ps — The Agent Skills Directory";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#050508",
          backgroundImage:
            "radial-gradient(circle at 15% 15%, rgba(16, 185, 129, 0.22) 0%, transparent 45%), radial-gradient(circle at 85% 20%, rgba(239, 68, 68, 0.18) 0%, transparent 45%), radial-gradient(circle at 50% 85%, rgba(139, 92, 246, 0.16) 0%, transparent 50%)",
          padding: "48px 56px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "#ffffff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle grid pattern overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            opacity: 0.8,
          }}
        />

        {/* Top Palestine Accent Line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            display: "flex",
          }}
        >
          <div style={{ flex: 1, backgroundColor: "#111827" }} />
          <div style={{ flex: 1, backgroundColor: "#ffffff" }} />
          <div style={{ flex: 1, backgroundColor: "#10b981" }} />
          <div style={{ flex: 1, backgroundColor: "#ef4444" }} />
        </div>

        {/* HEADER SECTION */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            zIndex: 10,
          }}
        >
          {/* Brand Logo & Name */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Terminal Icon Box */}
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #10b981, #059669)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 24px rgba(16, 185, 129, 0.4)",
              }}
            >
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: 900,
                  color: "#000000",
                  fontFamily: "monospace",
                }}
              >
                &gt;_
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                  style={{
                    fontSize: "26px",
                    fontWeight: 900,
                    letterSpacing: "-0.5px",
                    fontFamily: "monospace",
                  }}
                >
                  SKILLS<span style={{ color: "#10b981" }}>.PS</span>
                </span>
                <span style={{ fontSize: "20px" }}>🇵🇸</span>
              </div>
              <span
                style={{
                  fontSize: "12px",
                  color: "#9ca3af",
                  fontFamily: "monospace",
                  letterSpacing: "1px",
                }}
              >
                THE AGENT SKILLS DIRECTORY
              </span>
            </div>
          </div>

          {/* Live Status Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 16px",
              borderRadius: "9999px",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#10b981",
                boxShadow: "0 0 10px #10b981",
              }}
            />
            <span
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#10b981",
                fontFamily: "monospace",
                letterSpacing: "0.5px",
              }}
            >
              1.4M+ SKILLS ONLINE
            </span>
          </div>
        </div>

        {/* HERO CENTERPIECE */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            zIndex: 10,
            marginTop: "16px",
            marginBottom: "16px",
          }}
        >
          {/* Main Headline */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              lineHeight: 1.05,
            }}
          >
            <span
              style={{
                fontSize: "62px",
                fontWeight: 900,
                letterSpacing: "-2px",
                color: "#ffffff",
              }}
            >
              SUPERCHARGE YOUR
            </span>
            <span
              style={{
                fontSize: "66px",
                fontWeight: 900,
                letterSpacing: "-2px",
                background: "linear-gradient(90deg, #10b981 0%, #38bdf8 50%, #a855f7 100%)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              AI CODING AGENTS
            </span>
          </div>

          {/* Subtitle */}
          <p
            style={{
              fontSize: "20px",
              color: "#d1d5db",
              maxWidth: "850px",
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            Install curated, production-grade workflows for Cursor, Claude Code, Antigravity,
            Windsurf, and Copilot in seconds.
          </p>

          {/* Floating Terminal Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              alignSelf: "flex-start",
              gap: "12px",
              padding: "14px 22px",
              borderRadius: "14px",
              backgroundColor: "rgba(10, 10, 15, 0.85)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              boxShadow: "0 12px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
            }}
          >
            {/* Terminal Dots */}
            <div style={{ display: "flex", gap: "6px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ef4444" }} />
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#f59e0b" }} />
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#10b981" }} />
            </div>

            <span
              style={{
                fontSize: "17px",
                fontFamily: "monospace",
                color: "#9ca3af",
                marginLeft: "8px",
              }}
            >
              $
            </span>
            <span
              style={{
                fontSize: "17px",
                fontFamily: "monospace",
                fontWeight: 600,
                color: "#38bdf8",
              }}
            >
              npx skills add
            </span>
            <span
              style={{
                fontSize: "17px",
                fontFamily: "monospace",
                color: "#f3f4f6",
              }}
            >
              vercel-labs/skills/find-skills
            </span>
          </div>
        </div>

        {/* BOTTOM METRICS & AGENTS DOCK */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            width: "100%",
            zIndex: 10,
            paddingTop: "16px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          {/* Supported Agents Badges */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                fontSize: "12px",
                color: "#6b7280",
                fontFamily: "monospace",
                fontWeight: 700,
                marginRight: "4px",
                letterSpacing: "0.5px",
              }}
            >
              TARGETS:
            </span>

            {[
              { name: "Cursor", color: "#38bdf8", bg: "rgba(56, 189, 248, 0.12)" },
              { name: "Claude Code", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.12)" },
              { name: "Antigravity", color: "#10b981", bg: "rgba(16, 185, 129, 0.12)" },
              { name: "Windsurf", color: "#06b6d4", bg: "rgba(6, 182, 212, 0.12)" },
              { name: "Copilot", color: "#a855f7", bg: "rgba(168, 85, 247, 0.12)" },
            ].map((agent) => (
              <div
                key={agent.name}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  backgroundColor: agent.bg,
                  border: `1px solid ${agent.color}40`,
                  fontSize: "13px",
                  fontWeight: 600,
                  color: agent.color,
                  fontFamily: "monospace",
                }}
              >
                {agent.name}
              </div>
            ))}
          </div>

          {/* Stats Summary Counter */}
          <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <span style={{ fontSize: "22px", fontWeight: 800, color: "#ffffff", fontFamily: "monospace" }}>
                3.9M+
              </span>
              <span style={{ fontSize: "11px", color: "#9ca3af", fontFamily: "monospace", textTransform: "uppercase" }}>
                Total Installs
              </span>
            </div>

            <div style={{ width: "1px", height: "32px", backgroundColor: "rgba(255, 255, 255, 0.1)" }} />

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <span style={{ fontSize: "22px", fontWeight: 800, color: "#10b981", fontFamily: "monospace" }}>
                100% Free
              </span>
              <span style={{ fontSize: "11px", color: "#9ca3af", fontFamily: "monospace", textTransform: "uppercase" }}>
                Open Source
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
