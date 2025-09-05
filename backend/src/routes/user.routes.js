import express from 'express';
import { authMiddleWare } from '../middleware/auth.middleware.js';
import { updateProfile } from '../controllers/user.controllers.js';

const router = express.Router();

router.use(authMiddleWare);

router.post('/updateProfile', updateProfile);

export default router;
