import express from 'express';
import { getKPIs  } from '../controllers/dashboard.controller.js';
import { protect  } from '../middleware/auth.middleware.js';

import { cache } from '../middleware/cache.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/kpis', cache(30), getKPIs);

export default router;
