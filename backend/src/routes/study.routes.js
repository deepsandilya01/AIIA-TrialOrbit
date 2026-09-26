import express from 'express';
import { createStudy, 
  getStudies, 
  getStudyById, 
  updateStudy, 
  updateLifecycle 
 } from '../controllers/study.controller.js';
import { protect  } from '../middleware/auth.middleware.js';
import { authorize  } from '../middleware/rbac.middleware.js';

const router = express.Router();

router.use(protect); // All study routes are protected

router.route('/')
  .post(authorize('PI', 'ADMIN'), createStudy)
  .get(getStudies);

router.route('/:id')
  .get(getStudyById)
  .patch(authorize('PI', 'ADMIN'), updateStudy);

router.post('/:id/lifecycle', authorize('PI', 'ADMIN'), updateLifecycle);

export default router;
