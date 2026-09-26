import express from 'express';
import { register, login, getMe, logout  } from '../controllers/auth.controller.js';
import { protect  } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { authValidator } from '../validators/index.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', validate(authValidator.login), login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;
