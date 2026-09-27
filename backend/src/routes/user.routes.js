import express from 'express';
import { getAllUsers, getUserById, createUser, updateUser, updateRole, updateStatus, updateProfile } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { userValidator } from '../validators/index.js';

const router = express.Router();

router.use(protect);

router.put('/profile', updateProfile);

// Rest of user management routes are ADMIN-only
router.use(authorize('ADMIN'));

router.route('/')
  .get(getAllUsers)
  .post(validate(userValidator.create), createUser);

router.route('/:id')
  .get(getUserById)
  .patch(validate(userValidator.update), updateUser);

router.patch('/:id/role', validate(userValidator.updateRole), updateRole);
router.patch('/:id/status', validate(userValidator.updateStatus), updateStatus);

export default router;
