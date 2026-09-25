const express = require('express');
const { 
  createQuery, getQueries, resolveQuery,
  createDeviation, getDeviations, updateDeviationStatus
} = require('../controllers/dataQuality.controller');
const { protect } = require('../middleware/auth.middleware');

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

module.exports = router;
