import express from 'express';
import multer from 'multer';

import {
  validateBatchId,
  checkBatchCapacity,
  validateBatchStatus,
} from '../middleware/batch.middleware.js';
import {
  createBatch,
  getAllBatches,
  getBatchById,
  updateBatch,
  deleteBatch,
  uploadBatchCSV,
  assignUserToBatch,
  removeUserFromBatch,
  getBatchUsers,
  getAllUserBatches,
} from '../controllers/batch.controller.js';
import { authMiddleWare } from '../middleware/auth.middleware.js';

const batchRouter = express.Router();
const upload = multer({ dest: 'uploads/' });

// Apply JWT verification to all batch routes
batchRouter.use(authMiddleWare);

// Batch management routes
batchRouter.post('/create', createBatch);
batchRouter.get('/all', getAllBatches);
batchRouter.get('/my-batches', getAllUserBatches);

// Individual batch routes with validation
batchRouter.get('/getBatchById/:batchId', validateBatchId, getBatchById);
batchRouter.put(
  '/updateBatch/:batchId',
  validateBatchId,
  validateBatchStatus,
  updateBatch,
);
batchRouter.delete('/deleteBatch/:batchId', validateBatchId, deleteBatch);

// Batch member management routes
batchRouter.post('/upload-csv/:batchId', upload.single('file'), uploadBatchCSV);
batchRouter.post(
  '/assign-user',
  validateBatchId,
  checkBatchCapacity,
  validateBatchStatus,
  assignUserToBatch,
);
batchRouter.delete(
  '/removeUserFromBatch/:batchId',
  validateBatchId,
  validateBatchStatus,
  removeUserFromBatch,
);
batchRouter.get('/getBatchUsers/:batchId', validateBatchId, getBatchUsers);

export default batchRouter;
