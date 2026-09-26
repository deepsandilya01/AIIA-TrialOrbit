import express from 'express';
import { createVisit, 
  getVisits, 
  getVisitById, 
  updateVisit, 
  completeVisit 
 } from '../controllers/visit.controller.js';
import { protect  } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createVisit)
  .get(getVisits);

router.route('/:id')
  .get(getVisitById)
  .patch(updateVisit);

router.patch('/:id/complete', completeVisit);

export default router;
