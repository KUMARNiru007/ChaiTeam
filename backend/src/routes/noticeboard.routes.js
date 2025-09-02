import express from 'express';
import {
  createNotice,
  getGroupNotices,
  updateNotice,
  deleteNotice,
  pinNotice,
  unpinNotice
} from '../controllers/noticeboard.controller.js';
import { authMiddleWare } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleWare);


router.post('/create', createNotice);
router.get('/group/:groupId', getGroupNotices);
router.put('/:noticeId', updateNotice);
router.delete('/:noticeId', deleteNotice);
router.patch('/pin/:noticeId', pinNotice);
router.patch('/unpin/:noticeId', unpinNotice);

export default router;