import { Env } from '../types';

/**
 * Basic in-memory and KV-backed rate limiter for Cloudflare Workers
 */
const memoryStore = new Map<string, { count: number; expiresAt: number }>();

export async function checkRateLimit(
  request: Request,
  env: Env,
  limit: number = 60,
  windowSeconds: number = 60
): Promise<{ allowed: boolean; remaining: number }> {
  const ip = request.headers.get('CF-Connecting-IP') || 
             request.headers.get('X-Forwarded-For') || 
             '127.0.0.1';
  const url = new URL(request.url);
  const key = `ratelimit:${ip}:${url.pathname}`;
  const now = Date.now();

  // If KV is bound, use KV with expiration
  if (env.CACHE_KV) {
    try {
      const current = await env.CACHE_KV.get(key);
      const count = current ? parseInt(current, 10) : 0;
      if (count >= limit) {
        return { allowed: false, remaining: 0 };
      }
      await env.CACHE_KV.put(key, (count + 1).toString(), { expirationTtl: windowSeconds });
      return { allowed: true, remaining: limit - count - 1 };
    } catch {
      // fallback to memory
    }
  }

  // Fallback to memory store
  const record = memoryStore.get(key);
  if (record && record.expiresAt > now) {
    if (record.count >= limit) {
      return { allowed: false, remaining: 0 };
    }
    record.count += 1;
    return { allowed: true, remaining: limit - record.count };
  } else {
    memoryStore.set(key, { count: 1, expiresAt: now + windowSeconds * 1000 });
    return { allowed: true, remaining: limit - 1 };
  }
}
