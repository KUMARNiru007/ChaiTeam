import express, { Router } from 'express';
import { fetchWholeUserActivity } from '../controllers/userActivity.controllers.js';
import { fetchWholeGroupActivity } from '../controllers/groupActivity.controllers.js';

const router = express.Router();

router.post('/UserActivity', fetchWholeUserActivity);
router.post('/GroupActivity', fetchWholeGroupActivity);

export default router;
