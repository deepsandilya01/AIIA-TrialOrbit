import express from 'express';
import { getKPIs, getRecruitmentSummary, getRecruitmentTrend, getComplianceSummary } from '../controllers/dashboard.controller.js';
import { protect  } from '../middleware/auth.middleware.js';

import { cache } from '../middleware/cache.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/kpis', cache(30), getKPIs);
router.get('/recruitment-summary', cache(30), getRecruitmentSummary);
router.get('/recruitment-trend', cache(30), getRecruitmentTrend);
router.get('/compliance-summary', cache(30), getComplianceSummary);

export default router;
