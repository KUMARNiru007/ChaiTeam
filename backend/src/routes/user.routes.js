import express from 'express';
import { authMiddleWare } from '../middleware/auth.middleware.js';
import {
  getUserBatches,
  getUserGroup,
  updateProfile,
} from '../controllers/user.controller.js';

const router = express.Router();

router.use(authMiddleWare);

router.post('/updateProfile', updateProfile);
router.get('/allUserBatches', getUserBatches);
router.get('/getUserGroup/:batchId', getUserGroup);

export default router;
