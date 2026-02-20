const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 20; // PRO users get 20 requests/hour

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

export function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
  cleanup();

  const now = Date.now();
  const entry = store.get(key) ?? { timestamps: [] };

  // Filter to window
  entry.timestamps = entry.timestamps.filter((t) => now - t < WINDOW_MS);

  if (entry.timestamps.length >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  entry.timestamps.push(now);
  store.set(key, entry);

  return { allowed: true, remaining: MAX_REQUESTS - entry.timestamps.length };
}
