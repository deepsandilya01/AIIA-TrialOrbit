import express from 'express';
import { createParticipant, 
  getParticipants, 
  getParticipantById, 
  updateParticipant, 
  updateStatus 
 } from '../controllers/participant.controller.js';
import { protect  } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createParticipant)
  .get(getParticipants);

router.route('/:id')
  .get(getParticipantById)
  .patch(updateParticipant);

router.patch('/:id/status', updateStatus);


export default router;
