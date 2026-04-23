// Simple in-memory rate limiter for Vercel serverless
// Each instance maintains its own Map; resets on cold starts
// This is adequate for brute-force protection on auth endpoints

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const stores = new Map<string, Map<string, RateLimitEntry>>();

function getStore(name: string): Map<string, RateLimitEntry> {
  if (!stores.has(name)) {
    stores.set(name, new Map());
  }
  return stores.get(name)!;
}

/**
 * Check if a request should be rate limited.
 * @returns { limited: boolean, remaining: number, retryAfterSeconds: number }
 */
export function rateLimit(
  key: string,
  opts: { storeName?: string; max: number; windowMs: number }
): { limited: boolean; remaining: number; retryAfterSeconds: number } {
  const { storeName = "default", max, windowMs } = opts;
  const store = getStore(storeName);
  const now = Date.now();

  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    // First request or window has expired
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false, remaining: max - 1, retryAfterSeconds: 0 };
  }

  if (entry.count >= max) {
    const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
    return { limited: true, remaining: 0, retryAfterSeconds };
  }

  entry.count++;
  return { limited: false, remaining: max - entry.count, retryAfterSeconds: 0 };
}

/**
 * Extract client IP from request headers (Vercel-compatible).
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
