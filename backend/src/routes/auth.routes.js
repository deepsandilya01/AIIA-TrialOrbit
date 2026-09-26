import express from 'express';
import { register, login, getMe, logout  } from '../controllers/auth.controller.js';
import { protect  } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { authValidator } from '../validators/index.js';

const router = express.Router();

import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { getRedisClient } from '../config/redis.js';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts, please try again after 15 minutes' },
  skip: (req) => process.env.NODE_ENV === 'test',
});

router.post('/register', validate(authValidator.register), register);
router.post('/login', loginLimiter, validate(authValidator.login), login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;
