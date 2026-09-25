const express = require('express');
const { 
  createMilestone, getMilestones, updateMilestone, completeMilestone
} = require('../controllers/regulatory.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.route('/milestones')
  .post(createMilestone)
  .get(getMilestones);

router.route('/milestones/:id')
  .patch(updateMilestone);

router.patch('/milestones/:id/complete', completeMilestone);

module.exports = router;
