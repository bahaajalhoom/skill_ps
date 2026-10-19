export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
  : "";

export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (!API_BASE_URL) return cleanPath;
  return `${API_BASE_URL}${cleanPath}`;
}

/**
 * Resilient fetcher:
 * 1. Tries external backend API if configured (e.g. http://skill-ps-api.apps.taqat.academy)
 * 2. Automatically falls back to internal Next.js API route if external backend is unreachable or returns 404/5xx
 */
export async function apiFetch(path: string, options?: RequestInit): Promise<Response> {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  if (API_BASE_URL) {
    try {
      const remoteUrl = `${API_BASE_URL}${cleanPath}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(remoteUrl, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (res.ok) {
        return res;
      }
      console.warn(`[apiFetch] Remote API returned status ${res.status} for ${remoteUrl}, falling back to internal Next.js route`);
    } catch (err) {
      console.warn(`[apiFetch] Remote API unreachable (${(err as Error).message}), falling back to internal Next.js route`);
    }
  }

  // Fallback to internal Next.js route
  return fetch(cleanPath, options);
}
