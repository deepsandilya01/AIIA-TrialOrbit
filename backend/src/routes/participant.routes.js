import express from 'express';
import { createParticipant, 
  getParticipants, 
  getParticipantById, 
  updateParticipant, 
  updateStatus,
  updateParticipantConsent
 } from '../controllers/participant.controller.js';
import { protect  } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { participantValidator } from '../validators/index.js';

import { exportParticipants } from '../controllers/participant.controller.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(validate(participantValidator.create), createParticipant)
  .get(getParticipants);

router.get('/export', exportParticipants);

router.route('/:id')
  .get(getParticipantById)
  .patch(validate(participantValidator.update), updateParticipant);

router.patch('/:id/status', validate(participantValidator.updateStatus), updateStatus);
router.post('/:id/consent', validate(participantValidator.consent), updateParticipantConsent);


export default router;
