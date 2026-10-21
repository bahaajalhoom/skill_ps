import { NextRequest } from "next/server";

export interface GeoLocation {
  country: string;
  countryCode: string;
  city: string;
  region: string;
  latitude?: number;
  longitude?: number;
  isp?: string;
}

// In-memory cache for fast repeat lookups
const geoCache = new Map<string, GeoLocation>();

/**
 * Extracts client IP from Next.js NextRequest or standard Request headers.
 */
export function extractNextClientIp(req: NextRequest | Request): string {
  const headers = req.headers;

  const cfIp = headers.get("cf-connecting-ip");
  if (cfIp && isValidIp(cfIp)) return cleanIp(cfIp);

  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const firstIp = forwarded.split(",")[0].trim();
    if (firstIp && isValidIp(firstIp)) return cleanIp(firstIp);
  }

  const realIp = headers.get("x-real-ip");
  if (realIp && isValidIp(realIp)) return cleanIp(realIp);

  const vercelIp = headers.get("x-vercel-forwarded-for");
  if (vercelIp && isValidIp(vercelIp)) return cleanIp(vercelIp);

  return "127.0.0.1";
}

function cleanIp(ip: string): string {
  if (ip.startsWith("::ffff:")) {
    return ip.replace("::ffff:", "");
  }
  return ip;
}

function isValidIp(ip: string): boolean {
  if (!ip) return false;
  return ip.length >= 7 && ip.length <= 45;
}

function isPrivateIp(ip: string): boolean {
  if (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip === "localhost" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("172.16.") ||
    ip.startsWith("172.17.") ||
    ip.startsWith("172.18.") ||
    ip.startsWith("172.19.") ||
    ip.startsWith("172.2") ||
    ip.startsWith("172.3") ||
    ip.startsWith("fe80:")
  ) {
    return true;
  }
  return false;
}

/**
 * Resolves geolocation using headers or fast cached ip-api lookup.
 */
export async function resolveNextGeo(ip: string, req?: NextRequest | Request): Promise<GeoLocation> {
  // Check headers from edge proxies
  if (req) {
    const cfCountry = req.headers.get("cf-ipcountry");
    const cfCity = req.headers.get("cf-ipcity");
    if (cfCountry && cfCountry !== "XX") {
      return {
        country: getCountryName(cfCountry),
        countryCode: cfCountry.toUpperCase(),
        city: cfCity || "Unknown City",
        region: "",
      };
    }

    const vercelCountry = req.headers.get("x-vercel-ip-country");
    const vercelCity = req.headers.get("x-vercel-ip-city");
    if (vercelCountry) {
      return {
        country: getCountryName(vercelCountry),
        countryCode: vercelCountry.toUpperCase(),
        city: vercelCity ? decodeURIComponent(vercelCity) : "Unknown City",
        region: "",
      };
    }
  }

  // Local / private IP
  if (isPrivateIp(ip)) {
    return {
      country: "Local Network",
      countryCode: "PS", // Palestine flag branding for local developer
      city: "Developer Workspace",
      region: "Localhost",
      isp: "Private Intranet",
    };
  }

  // In-memory cache
  if (geoCache.has(ip)) {
    return geoCache.get(ip)!;
  }

  // Fast external lookup with 1.8s timeout
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1800);

    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,regionName,city,lat,lon,isp`, {
      signal: controller.signal,
      headers: { "User-Agent": "SkillPS-Telemetry/1.0" },
    });

    clearTimeout(timeout);

    if (res.ok) {
      const data: any = await res.json();
      if (data.status === "success") {
        const geo: GeoLocation = {
          country: data.country || "Unknown Country",
          countryCode: data.countryCode || "UN",
          city: data.city || "Unknown City",
          region: data.regionName || "",
          latitude: typeof data.lat === "number" ? data.lat : undefined,
          longitude: typeof data.lon === "number" ? data.lon : undefined,
          isp: data.isp || "Unknown ISP",
        };
        geoCache.set(ip, geo);
        return geo;
      }
    }
  } catch {
    // Fall through
  }

  const fallback: GeoLocation = {
    country: "Unknown Country",
    countryCode: "UN",
    city: "Unknown City",
    region: "",
    isp: "Network Provider",
  };
  geoCache.set(ip, fallback);
  return fallback;
}

/**
 * Lightweight User-Agent parser.
 */
export function parseNextUserAgent(ua: string): { browser: string; os: string; device: string } {
  if (!ua) {
    return { browser: "Skills CLI", os: "Terminal", device: "CLI" };
  }

  const lower = ua.toLowerCase();

  // OS
  let os = "Unknown OS";
  if (lower.includes("macintosh") || lower.includes("mac os")) os = "macOS";
  else if (lower.includes("windows")) os = "Windows";
  else if (lower.includes("android")) os = "Android";
  else if (lower.includes("iphone") || lower.includes("ipad") || lower.includes("ipod")) os = "iOS";
  else if (lower.includes("linux")) os = "Linux";
  else if (lower.includes("curl") || lower.includes("node") || lower.includes("skills")) os = "CLI / Terminal";

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

export function getCountryFlag(code?: string): string {
  if (!code || code.length !== 2) return "🌐";
  if (code.toUpperCase() === "PS") return "🇵🇸";
  const codePoints = code
    .toUpperCase()
    .split("")
    .map((c) => 127397 + c.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

function getCountryName(code: string): string {
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
