import { Redis } from 'ioredis';

const REDIS_URL = process.env.REDIS_URL ?? 'redis://localhost:6379';

export const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => Math.min(times * 100, 3000),
});

redis.on('error', (err) => {
  console.error('[redis] Connection error:', err.message);
});

redis.on('connect', () => {
  console.log('[redis] Connected successfully ✓');
});

/**
 * cacheProductCatalog
 * Helpers for caching marketplace product feeds
 */
export async function setCache(key: string, data: any, ttlSeconds = 300) {
  try {
    await redis.set(key, JSON.stringify(data), 'EX', ttlSeconds);
  } catch (err) {
    console.error(`[redis] Cache set failed for ${key}`, err);
  }
}

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error(`[redis] Cache get failed for ${key}`, err);
    return null;
  }
}

export async function invalidateCache(pattern: string) {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`[redis] Invalidated ${keys.length} keys for pattern: ${pattern}`);
    }
  } catch (err) {
    console.error(`[redis] Cache invalidation failed for ${pattern}`, err);
  }
}
