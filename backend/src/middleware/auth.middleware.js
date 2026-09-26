import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import userRepository from '../repositories/user.repository.js';
import { getRedisClient } from '../config/redis.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    
    // Check Redis blacklist
    if (decoded.jti) {
      const redis = getRedisClient();
      if (redis) {
        try {
          const isBlacklisted = await redis.get(`auth:blacklist:${decoded.jti}`);
          if (isBlacklisted) {
            return res.status(401).json({ success: false, message: 'Token revoked' });
          }
        } catch (redisErr) {
          console.warn('Redis error during auth verification, skipping blacklist check:', redisErr.message);
        }
      }
    }
    
    // Check if user still exists
    const user = await userRepository.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'User no longer exists or is inactive' });
    }

    req.user = decoded; // { id, role, siteId, iat, exp, jti }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};
