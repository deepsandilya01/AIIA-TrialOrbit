import express from 'express';
import { createEvent, getEvents, updateEvent, pvReview
 } from '../controllers/safety.controller.js';
import { protect  } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/events')
  .post(createEvent)
  .get(getEvents);

router.route('/events/:id')
  .patch(updateEvent);

router.patch('/events/:id/pv-review', pvReview);

export default router;
