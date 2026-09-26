import express from 'express';
import { createStudy, 
  getStudies, 
  getStudyById, 
  updateStudy, 
  updateLifecycle 
 } from '../controllers/study.controller.js';
import { protect  } from '../middleware/auth.middleware.js';
import { authorize  } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { studyValidator } from '../validators/index.js';

const router = express.Router();

router.use(protect); // All study routes are protected

router.route('/')
  .post(authorize('PI', 'ADMIN'), validate(studyValidator.create), createStudy)
  .get(getStudies);

router.route('/:id')
  .get(getStudyById)
  .patch(authorize('PI', 'ADMIN'), validate(studyValidator.update), updateStudy);

router.post('/:id/lifecycle', authorize('PI', 'ADMIN'), validate(studyValidator.lifecycle), updateLifecycle);

export default router;
