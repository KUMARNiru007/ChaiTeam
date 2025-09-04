import express, { Router } from 'express';
import { fetchWholeUserActivity } from '../controllers/userActivity.controllers.js';

const router = express.Router();

router.post('/UserActivity', fetchWholeUserActivity);

export default router;
