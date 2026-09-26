import express from 'express';
import { createVisit, 
  getVisits, 
  getVisitById, 
  updateVisit, 
  completeVisit 
 } from '../controllers/visit.controller.js';
import { protect  } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { visitValidator } from '../validators/index.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(validate(visitValidator.create), createVisit)
  .get(getVisits);

router.route('/:id')
  .get(getVisitById)
  .patch(validate(visitValidator.updateStatus), updateVisit);

router.patch('/:id/complete', validate(visitValidator.updateStatus), completeVisit);

export default router;
