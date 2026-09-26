import express from 'express';
import { createSite, 
  getSites, 
  getSiteById, 
  updateSite, 
  updateStatus 
 } from '../controllers/site.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { siteValidator } from '../validators/index.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(authorize('ADMIN', 'PI', 'COORDINATOR'), validate(siteValidator.create), createSite)
  .get(getSites);

router.route('/:id')
  .get(getSiteById)
  .patch(authorize('ADMIN', 'PI', 'COORDINATOR'), validate(siteValidator.update), updateSite);

router.patch('/:id/status', validate(siteValidator.updateStatus), updateStatus);

export default router;
