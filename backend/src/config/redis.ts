/**
 * Redis connection and configuration
 */

import Redis from "ioredis";
import { env } from "./env";

let redis: Redis | null = null;
let redisConnected = false;
let redisErrorLogged = false;

if (env.REDIS_URL) {
  try {
    redis = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 1, // Reduce retries
      retryStrategy: () => null, // Don't retry on failure
      enableOfflineQueue: false, // Don't queue commands when offline
      lazyConnect: true, // Don't connect immediately
      showFriendlyErrorStack: false,
    });

    redis.on("connect", () => {
      redisConnected = true;
      redisErrorLogged = false; // Reset error flag on successful connection
      console.log("✅ Redis connection established");
    });

    redis.on("error", () => {
      // Only log error once to avoid spam
      if (!redisErrorLogged) {
        console.log("⚠️  Redis not available (caching disabled)");
        redisErrorLogged = true;
      }
      redisConnected = false;
    });

    redis.on("close", () => {
      redisConnected = false;
    });

    // Try to connect, but don't fail if it doesn't work
    redis.connect().catch(() => {
      // Silently fail - Redis is optional
      redisConnected = false;
    });
  } catch (error) {
    // If Redis initialization fails, just continue without it
    redis = null;
    redisConnected = false;
  }
}

export { redis };

/**
 * Cache helper functions
 * Gracefully handles Redis unavailability - returns null/does nothing if Redis is not connected
 */
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    if (!redis || !redisConnected) return null;
    try {
      const value = await redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      // Silently fail - Redis is optional
      return null;
    }
  },

  async set(key: string, value: unknown, ttlSeconds = 3600): Promise<void> {
    if (!redis || !redisConnected) return;
    try {
      await redis.setex(key, ttlSeconds, JSON.stringify(value));
    } catch (error) {
      // Silently fail - Redis is optional
    }
  },

  async del(key: string): Promise<void> {
    if (!redis || !redisConnected) return;
    try {
      await redis.del(key);
    } catch (error) {
      // Silently fail - Redis is optional
    }
  },
};

