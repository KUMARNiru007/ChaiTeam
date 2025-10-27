import express from 'express';
import {
  createGroup,
  getAllGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  addMemberToGroup,
  ApplyToJoinGroup,
  fetchAllJoinApplications,
  leaveGroup,
  kickMemberFromGroup,
  rejectJoinApplication,
} from '../controllers/groups.controller.js';

import { authMiddleWare, CheckRole } from '../middleware/auth.middleware.js';
import { validateBatchId } from '../middleware/batch.middleware.js';

const router = express.Router();

router.post('/createGroup', authMiddleWare, validateBatchId, createGroup);
router.get('/getAllGroups', authMiddleWare, getAllGroups);
router.get('/getGroupById/:groupId', authMiddleWare, getGroupById);
router.post('/applyToJoinGroup/:groupId', authMiddleWare, ApplyToJoinGroup);
router.get(
  '/allApplications/:groupId',
  authMiddleWare,
  CheckRole,
  fetchAllJoinApplications,
);
router.post(
  '/addMemberToGroup/:groupId',
  authMiddleWare,
  CheckRole,
  addMemberToGroup,
);
router.post(
  '/rejectApplication/:groupId',
  authMiddleWare,
  CheckRole,
  rejectJoinApplication,
);
router.post('/leaveGroup/:groupId', authMiddleWare, leaveGroup);
router.post(
  '/kickMember/:groupId',
  authMiddleWare,
  CheckRole,
  kickMemberFromGroup,
);
router.put('/updateGroup/:groupId', authMiddleWare, CheckRole, updateGroup);
router.delete('/disbannedGroup/:groupId', authMiddleWare, deleteGroup);

export default router;
