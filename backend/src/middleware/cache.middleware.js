import { getRedisClient } from '../config/redis.js';

export const cache = (ttlSeconds = 60) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const redis = getRedisClient();
    if (!redis) {
      // Redis is not available, proceed without caching
      return next();
    }

    const userScope = req.user ? `:${req.user.role}:${req.user.id}` : ':anonymous';
    const key = `cache:${req.originalUrl || req.url}${userScope}`;

    try {
      const cachedData = await redis.get(key);
      if (cachedData) {
        res.setHeader('Cache-Control', 'private, no-store'); // prevent browser caching
        return res.status(200).json(JSON.parse(cachedData));
      }

      // Intercept res.json to cache the response before sending
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          redis.set(key, JSON.stringify(body), { EX: ttlSeconds }).catch(err => {
            console.error('Redis cache set error:', err.message);
          });
        }
        res.setHeader('Cache-Control', 'private, no-store');
        return originalJson(body);
      };

      next();
    } catch (err) {
      console.error('Redis cache get error:', err.message);
      next(); // fallback to DB if cache errors out
    }
  };
};

export const invalidateCachePrefix = async (prefixPattern) => {
  const redis = getRedisClient();
  if (!redis) return;
  try {
    const keys = await redis.keys(`cache:${prefixPattern}*`);
    if (keys.length > 0) {
      await redis.del(keys);
    }
  } catch (error) {
    console.error('Cache invalidation error:', error.message);
  }
};
