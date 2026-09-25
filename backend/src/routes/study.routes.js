const express = require('express');
const { 
  createStudy, 
  getStudies, 
  getStudyById, 
  updateStudy, 
  updateLifecycle 
} = require('../controllers/study.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/rbac.middleware');

const router = express.Router();

router.use(protect); // All study routes are protected

router.route('/')
  .post(authorize('PI', 'ADMIN'), createStudy)
  .get(getStudies);

router.route('/:id')
  .get(getStudyById)
  .patch(authorize('PI', 'ADMIN'), updateStudy);

router.post('/:id/lifecycle', authorize('PI', 'ADMIN'), updateLifecycle);

module.exports = router;
