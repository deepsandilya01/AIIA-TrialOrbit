const express = require('express');
const { 
  createVisit, 
  getVisits, 
  getVisitById, 
  updateVisit, 
  completeVisit 
} = require('../controllers/visit.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createVisit)
  .get(getVisits);

router.route('/:id')
  .get(getVisitById)
  .patch(updateVisit);

router.patch('/:id/complete', completeVisit);

module.exports = router;
