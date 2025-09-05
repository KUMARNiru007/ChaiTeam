import express, { Router } from 'express';
import { fetchWholeUserActivity } from '../controllers/userActivity.controller.js';
import { fetchWholeGroupActivity } from '../controllers/groupActivity.controller.js';
import { authMiddleWare } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleWare);

router.post('/UserActivity', fetchWholeUserActivity);
router.post('/GroupActivity', fetchWholeGroupActivity);

export default router;
