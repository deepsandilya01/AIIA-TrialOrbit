import express from 'express';
import { createMilestone, getMilestones, updateMilestone, completeMilestone
 } from '../controllers/regulatory.controller.js';
import { protect  } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/milestones')
  .post(createMilestone)
  .get(getMilestones);

router.route('/milestones/:id')
  .patch(updateMilestone);

router.patch('/milestones/:id/complete', completeMilestone);

export default router;
