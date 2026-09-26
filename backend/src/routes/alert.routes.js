import express from 'express';
import { getActiveAlerts, getAllAlerts, acknowledgeAlert  } from '../controllers/alert.controller.js';
import { protect  } from '../middleware/auth.middleware.js';

import { validate } from '../middleware/validate.middleware.js';
import { alertValidator } from '../validators/index.js';

const router = express.Router();

router.use(protect);

router.get('/', getAllAlerts);
router.get('/active', getActiveAlerts);
router.patch('/:id/acknowledge', validate(alertValidator.acknowledge), acknowledgeAlert);

export default router;
