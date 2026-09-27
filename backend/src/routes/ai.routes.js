import express from 'express';
import { 
  getStudyOverview,
  generateExplanation,
  askAI
} from '../controllers/ai.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { rbacMiddleware } from '../middleware/rbac.middleware.js';
import { cache } from '../middleware/cache.middleware.js';

const router = express.Router();

router.use(protect);

// GET overall study intelligence (deterministic) - cache for 120 seconds
router.get('/studies/:studyId/overview', rbacMiddleware('ai:query'), cache(120), getStudyOverview);

// POST generate LLM explanation for study risk
router.post('/studies/:studyId/explanation', rbacMiddleware('ai:query'), generateExplanation);

// POST ask AI a specific question about the study
router.post('/studies/:studyId/chat', rbacMiddleware('ai:query'), askAI);

export default router;
