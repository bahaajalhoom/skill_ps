import { NextRequest } from "next/server";
import os from "os";
import dns from "dns/promises";
import { getCountryFlag, getCountryName, parseNextUserAgent } from "./geo-utils";

export { getCountryFlag, getCountryName, parseNextUserAgent };

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
 * Resolves the client machine/device username (يوزر الجهاز) for Next.js.
 */
export async function resolveNextDeviceUser(
  req: NextRequest | Request,
  ip: string,
  explicitUser?: string
): Promise<string> {
  // 1. Explicit user from body or custom header
  if (explicitUser && typeof explicitUser === "string" && explicitUser.trim()) {
    return explicitUser.trim();
  }

  const headers = req.headers;
  const headerUser =
    headers.get("x-device-user") ||
    headers.get("x-client-user");

  if (headerUser && headerUser.trim()) {
    return headerUser.trim();
  }

  // 2. If client is on local machine / localhost
  if (isPrivateIp(ip)) {
    try {
      const sysUser = os.userInfo().username;
      const sysHost = os.hostname();
      if (sysUser && sysUser !== "root") {
        return `${sysUser}@${sysHost}`;
      }
      return sysHost || sysUser || "local-developer";
    } catch {
      const envUser = process.env.USER || process.env.USERNAME;
      if (envUser) return envUser;
    }
  }

  // 3. Try reverse DNS lookup on IP to get computer / host name
  try {
    const hostnames = await Promise.race([
      dns.reverse(ip),
      new Promise<string[]>((_, reject) => setTimeout(() => reject(new Error("Timeout")), 1200)),
    ]);
    if (Array.isArray(hostnames) && hostnames.length > 0) {
      const host = hostnames[0].split(".")[0];
      if (host && host.length >= 2 && !host.startsWith("ip-") && !host.startsWith("cpe-")) {
        return host;
      }
    }
  } catch {
    // Reverse DNS timeout or residential ISP
  }

  // 4. Derive from client User-Agent and platform
  const uaRaw = headers.get("user-agent") || "";
  const parsed = parseNextUserAgent(uaRaw);
  return `${parsed.os}-${parsed.device}`;
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
