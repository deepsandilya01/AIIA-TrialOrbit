import { createClient } from 'redis';
import env from './env.js';

let redisClient = null;

const initRedis = async () => {
  if (!env.redisUrl) {
    console.warn('REDIS_URL is missing. Redis caching and rate-limiting will be disabled.');
    return null;
  }

  try {
    redisClient = createClient({
      url: env.redisUrl,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) return new Error('Redis max retries reached');
          return Math.min(retries * 100, 3000);
        }
      }
    });

    redisClient.on('error', (err) => {
      // Avoid logging full error with credentials if any
      console.error('Redis Client Error:', err.message);
    });

    redisClient.on('ready', () => {
      console.log('Redis connected successfully.');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error('Failed to initialize Redis:', error.message);
    redisClient = null; // graceful fallback
    return null;
  }
};

export const getRedisClient = () => redisClient;
export { initRedis };
