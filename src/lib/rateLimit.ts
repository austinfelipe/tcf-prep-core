const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 5;

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

// Clean up old entries periodically
function cleanup() {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < WINDOW_MS);
    if (entry.timestamps.length === 0) {
      store.delete(key);
    }
  }
}

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  cleanup();

  const now = Date.now();
  const entry = store.get(ip) ?? { timestamps: [] };

  // Filter to window
  entry.timestamps = entry.timestamps.filter((t) => now - t < WINDOW_MS);

  if (entry.timestamps.length >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  entry.timestamps.push(now);
  store.set(ip, entry);

  return { allowed: true, remaining: MAX_REQUESTS - entry.timestamps.length };
}
