import express from 'express';
import { createSite, 
  getSites, 
  getSiteById, 
  updateSite, 
  updateStatus 
 } from '../controllers/site.controller.js';
import { protect  } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createSite)
  .get(getSites);

router.route('/:id')
  .get(getSiteById)
  .patch(updateSite);

router.patch('/:id/status', updateStatus);

export default router;
