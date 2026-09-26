import express from 'express';
import { createMilestone, getMilestones, getMilestoneById, updateMilestone, completeMilestone } from '../controllers/regulatory.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { regulatoryValidator } from '../validators/index.js';

const router = express.Router();

router.use(protect);

router.route('/milestones')
  .post(validate(regulatoryValidator.create), createMilestone)
  .get(getMilestones);

router.route('/milestones/:id')
  .get(getMilestoneById)
  .patch(validate(regulatoryValidator.update), updateMilestone);

router.patch('/milestones/:id/complete', completeMilestone);

export default router;
