import express from 'express';
import { validateBatchId, checkBatchCapacity, validateBatchStatus } from '../middleware/batch.middleware.js';
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
    getMyBatch
} from '../controllers/batch.controller.js';
import { authMiddleWare } from '../middleware/auth.middleware.js';

const batchRouter = express.Router();

// Apply JWT verification to all batch routes
batchRouter.use(authMiddleWare);

// Batch management routes
batchRouter.post('/create', createBatch);
batchRouter.get('/all', getAllBatches);
batchRouter.get('/my-batch', getMyBatch);

// Individual batch routes with validation
batchRouter.get('/:id', validateBatchId, getBatchById);
batchRouter.put('/:id', validateBatchId, validateBatchStatus, updateBatch);
batchRouter.delete('/:id', validateBatchId, deleteBatch);

// Batch member management routes
batchRouter.post('/upload-csv', uploadBatchCSV);
batchRouter.post('/assign-user', validateBatchId, checkBatchCapacity, validateBatchStatus, assignUserToBatch);
batchRouter.delete('/:batchId/remove-user/:userId', validateBatchId, validateBatchStatus, removeUserFromBatch);
batchRouter.get('/:id/users', validateBatchId, getBatchUsers);

export default batchRouter;
