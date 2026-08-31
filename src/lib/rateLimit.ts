export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
};

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export function checkInMemoryRateLimit(
  key: string,
  options: { limit: number; windowMs: number; now?: number },
): RateLimitResult {
  const now = options.now ?? Date.now();
  const existing = buckets.get(key);
  const bucket = existing && existing.resetAt > now ? existing : { count: 0, resetAt: now + options.windowMs };

  bucket.count += 1;
  buckets.set(key, bucket);

  const remaining = Math.max(0, options.limit - bucket.count);
  return {
    allowed: bucket.count <= options.limit,
    limit: options.limit,
    remaining,
    resetAt: bucket.resetAt,
  };
}

export function resetInMemoryRateLimitForTests(): void {
  buckets.clear();
}
