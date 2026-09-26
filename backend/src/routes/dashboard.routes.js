import express from 'express';
import { getKPIs  } from '../controllers/dashboard.controller.js';
import { protect  } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/kpis', getKPIs);

export default router;
