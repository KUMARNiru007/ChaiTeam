import { db } from '../libs/db.js';
import { ApiError } from '../utils/ApiError.js';

// verify batch existence
export const validateBatchId = async (req, res, next) => {
  try {
    const batchId = req.params.batchId || req.body.batchId;

    if (!batchId) {
      throw new ApiError(400, 'Batch ID is required');
    }

    const batch = await db.batch.findUnique({
      where: { id: batchId },
      include: {
        batchMembers: true
      }
    });

    if (!batch) {
      throw new ApiError(404, 'Batch not found');
    }

    req.batch = batch;
    next();
  } catch (error) {
    next(error);
  }
};

// check batch capacity
export const checkBatchCapacity = async (req, res, next) => {
  try {
    const batchId = req.params.id || req.body.batchId;

    const [batch, currentMembers] = await Promise.all([
      db.batch.findUnique({ where: { id: batchId } }),
      db.batchMembers.count({ where: { batchId } }),
    ]);

    if (currentMembers >= batch.capacity) {
      throw new ApiError(400, 'Batch capacity is full');
    }

    next();
  } catch (error) {
    next(error);
  }
};

//  validate batch status
export const validateBatchStatus = async (req, res, next) => {
  try {
    const batch = req.batch;

    if (batch.status === 'COMPLETED' || batch.status === 'INACTIVE') {
      throw new ApiError(400, 'Cannot modify an inactive or completed batch');
    }

    next();
  } catch (error) {
    next(error);
  }
};
