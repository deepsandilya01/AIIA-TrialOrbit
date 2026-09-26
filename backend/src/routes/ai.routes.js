import express from 'express';
import { 
  handleKpiQuery,
  handleRecruitmentRisk,
  handleAnomalyDetection,
  handleSafetySummary
} from '../controllers/ai.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { rbacMiddleware } from '../middleware/rbac.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/kpi-query', rbacMiddleware('ai:query'), handleKpiQuery);
router.post('/recruitment-risk', rbacMiddleware('ai:query'), handleRecruitmentRisk);
router.post('/anomaly-detection', rbacMiddleware('ai:query'), handleAnomalyDetection);
router.post('/safety-summary', rbacMiddleware('ai:query'), handleSafetySummary);

export default router;
