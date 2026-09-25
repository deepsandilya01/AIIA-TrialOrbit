const express = require('express');
const { 
  createParticipant, 
  getParticipants, 
  getParticipantById, 
  updateParticipant, 
  updateStatus 
} = require('../controllers/participant.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createParticipant)
  .get(getParticipants);

router.route('/:id')
  .get(getParticipantById)
  .patch(updateParticipant);

router.patch('/:id/status', updateStatus);

// TODO: Add consent routes

module.exports = router;
