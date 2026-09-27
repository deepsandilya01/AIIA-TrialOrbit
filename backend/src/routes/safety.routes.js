import express from 'express';
import { createEvent, getEvents, getEventById, updateEvent, pvReview, exportSafetyReport } from '../controllers/safety.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { safetyValidator } from '../validators/index.js';

const router = express.Router();

router.use(protect);

router.route('/events')
  .post(validate(safetyValidator.create), createEvent)
  .get(getEvents);

router.route('/events/:id')
  .get(getEventById)
  .patch(validate(safetyValidator.update), updateEvent);

router.patch('/events/:id/pv-review', validate(safetyValidator.pvReview), pvReview);
router.get('/events/:id/export', exportSafetyReport);

export default router;
