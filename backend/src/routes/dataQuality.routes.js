import express from 'express';
import { createQuery, getQueries, resolveQuery, exportQueries,
  createDeviation, getDeviations, updateDeviationStatus, exportDeviations
 } from '../controllers/dataQuality.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { queryValidator, deviationValidator } from '../validators/index.js';

const router = express.Router();

router.use(protect);

// Queries
router.route('/queries')
  .post(validate(queryValidator.create), createQuery)
  .get(getQueries);

router.get('/queries/export', exportQueries);

router.patch('/queries/:id/resolve', validate(queryValidator.resolve), resolveQuery);

// Deviations
router.route('/deviations')
  .post(validate(deviationValidator.create), createDeviation)
  .get(getDeviations);

router.get('/deviations/export', exportDeviations);

router.patch('/deviations/:id', validate(deviationValidator.update), updateDeviationStatus);

export default router;
