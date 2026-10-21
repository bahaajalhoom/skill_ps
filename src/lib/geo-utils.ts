/**
 * Universal (Browser + Server safe) Geo & Device utilities.
 * Does NOT import any Node.js built-ins.
 */

export function getCountryFlag(code?: string): string {
  if (!code || code.length !== 2) return "🌐";
  if (code.toUpperCase() === "PS") return "🇵🇸";
  const codePoints = code
    .toUpperCase()
    .split("")
    .map((c) => 127397 + c.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export function getCountryName(code: string): string {
  const map: Record<string, string> = {
    PS: "Palestine",
    SA: "Saudi Arabia",
    JO: "Jordan",
    EG: "Egypt",
    AE: "United Arab Emirates",
    QA: "Qatar",
    KW: "Kuwait",
    OM: "Oman",
    BH: "Bahrain",
    US: "United States",
    GB: "United Kingdom",
    DE: "Germany",
    FR: "France",
    CA: "Canada",
    TR: "Turkey",
  };
  return map[code.toUpperCase()] || code;
}

export function parseNextUserAgent(ua: string | null): {
  browser: string;
  os: string;
  device: string;
} {
  if (!ua) {
    return { browser: "Unknown", os: "Unknown", device: "Unknown" };
  }

  const lower = ua.toLowerCase();

  // OS
  let os = "Unknown OS";
  if (lower.includes("mac os") || lower.includes("macintosh")) os = "macOS";
  else if (lower.includes("windows")) os = "Windows";
  else if (lower.includes("android")) os = "Android";
  else if (lower.includes("iphone") || lower.includes("ipad") || lower.includes("ios")) os = "iOS";
  else if (lower.includes("linux")) os = "Linux";
  else if (lower.includes("postman")) os = "Postman";
  else if (lower.includes("curl")) os = "cURL";

  // Browser
  let browser = "Browser";
  if (lower.includes("edg/")) browser = "Microsoft Edge";
  else if (lower.includes("opr/") || lower.includes("opera")) browser = "Opera";
  else if (lower.includes("brave")) browser = "Brave";
  else if (lower.includes("chrome") && !lower.includes("edg/")) browser = "Google Chrome";
  else if (lower.includes("safari") && !lower.includes("chrome")) browser = "Apple Safari";
  else if (lower.includes("firefox")) browser = "Mozilla Firefox";
  else if (lower.includes("curl")) browser = "cURL";
  else if (lower.includes("skills")) browser = "Skills CLI";
  else if (lower.includes("axios") || lower.includes("node-fetch")) browser = "Node.js Client";

  // Device
  let device = "Desktop";
  if (lower.includes("mobile") || lower.includes("android") || lower.includes("iphone")) device = "Mobile";
  else if (lower.includes("ipad") || lower.includes("tablet")) device = "Tablet";
  else if (lower.includes("curl") || lower.includes("skills") || lower.includes("node")) device = "CLI";

  return { browser, os, device };
}

/**
 * Dynamically detects client device hardware identity without any hardcoding or random values.
 * Extracts real GPU chipset (WebGL), CPU cores, and OS platform.
 */
export function getDynamicDeviceIdentity(): string {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return "Server/CLI";
  }

  // 1. Check if user explicitly set their name in localStorage
  try {
    const custom = localStorage.getItem("skillps_device_user");
    if (custom && custom.trim() && !custom.match(/^.+User-[a-z0-9]{4}$/i) && custom !== "client-user") {
      return custom.trim();
    }
  } catch {}

  // 2. Extract real GPU renderer via WebGL (e.g. "Apple M1", "Intel Iris Xe", "NVIDIA RTX 3070")
  let gpu = "";
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (gl) {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        const rawGpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        if (typeof rawGpu === "string" && rawGpu) {
          gpu = rawGpu
            .replace(/ANGLE \((.*)\)/, "$1")
            .replace(/Direct3D.*/, "")
            .replace(/OpenGL Engine.*/, "")
            .replace(/vs_\d+_\d+.*|ps_\d+_\d+.*/, "")
            .trim();
        }
      }
    }
  } catch {}

  // 3. Extract CPU cores
  const cores =
    typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency > 0
      ? `${navigator.hardwareConcurrency}c`
      : "";

  // 4. Extract OS & platform
  const ua = navigator.userAgent || "";
  let os = "Desktop";
  if (ua.includes("Mac")) os = "macOS";
  else if (ua.includes("Win")) os = "Windows";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

  // Build clean dynamic hardware identity
  const parts: string[] = [];
  if (gpu && gpu !== "Generic" && !gpu.toLowerCase().includes("swiftshader")) {
    parts.push(gpu);
  }
  parts.push(os);
  if (cores) {
    parts.push(cores);
  }

  const result = parts.join(" • ");
  return result || `${os} Device`;
}
