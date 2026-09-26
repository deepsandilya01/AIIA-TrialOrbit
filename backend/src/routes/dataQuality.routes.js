import express from 'express';
import { createQuery, getQueries, resolveQuery,
  createDeviation, getDeviations, updateDeviationStatus
 } from '../controllers/dataQuality.controller.js';
import { protect  } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

// Queries
router.route('/queries')
  .post(createQuery)
  .get(getQueries);

router.patch('/queries/:id/resolve', resolveQuery);

// Deviations
router.route('/deviations')
  .post(createDeviation)
  .get(getDeviations);

router.patch('/deviations/:id', updateDeviationStatus);

export default router;
