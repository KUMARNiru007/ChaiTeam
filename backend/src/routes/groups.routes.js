import express from 'express';
import {
  createGroup,
  getAllGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  addMemberToGroup,
  ApplyToJoinGroup,
  leaveGroup,
  kickMemberFromGroup,
  rejectJoinApplication,
  fetchUserAllApplications,
  fetchAllGroupApplications,
  deleteApplication,
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
  fetchAllGroupApplications,
);
router.get(
  '/userApplications/:userId',
  authMiddleWare,
  fetchUserAllApplications,
);
router.get(
  '/withdrawApplication/:applicationId',
  authMiddleWare,
  deleteApplication,
);
router.get(
  '/deleteApplication/:applicationId',
  authMiddleWare,
  deleteApplication,
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
