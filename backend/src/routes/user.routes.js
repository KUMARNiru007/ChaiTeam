import express from 'express';
import { authMiddleWare, CheckRole } from '../middleware/auth.middleware.js';
import {
  getAllUsers,
  getUserActivities,
  getUserBatches,
  getUserById,
  getUserGroup,
  updateProfile,
  updateRole,
} from '../controllers/user.controller.js';

const router = express.Router();

router.use(authMiddleWare);

router.post('/updateProfile', updateProfile);
router.get('/allUserBatches', getUserBatches);
router.get('/getUserGroup/:batchId', getUserGroup);
router.get('/allUsers', getAllUsers);
router.post('/updateRole', CheckRole, updateRole);
router.get('/:userId', getUserById);
router.get('/:userId/activities', getUserActivities);

export default router;
