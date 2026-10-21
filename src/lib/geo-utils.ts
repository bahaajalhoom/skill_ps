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
