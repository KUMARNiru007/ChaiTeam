import express from 'express';
import {
  createNotice,
  getGroupNotices,
  updateNotice,
  deleteNotice,
  pinNotice,
  unpinNotice,
  getBatchNotices,
  getGlobalNotices,
} from '../controllers/noticeboard.controller.js';
import { authMiddleWare } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleWare);

router.post('/create', createNotice);
router.get('/getGroupNotices/:groupId', getGroupNotices);
router.get('/getBatchNotices/:batchId', getBatchNotices);
router.get('/getGlobalNotices', getGlobalNotices);
router.put('/updateNotice/:noticeId', updateNotice);
router.delete('/deleteNotice/:noticeId', deleteNotice);
router.patch('/pin/:noticeId', pinNotice);
router.patch('/unpin/:noticeId', unpinNotice);

export default router;
