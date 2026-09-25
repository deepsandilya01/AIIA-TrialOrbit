const express = require('express');
const { 
  createEvent, getEvents, updateEvent, pvReview
} = require('../controllers/safety.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.route('/events')
  .post(createEvent)
  .get(getEvents);

router.route('/events/:id')
  .patch(updateEvent);

router.patch('/events/:id/pv-review', pvReview);

module.exports = router;
