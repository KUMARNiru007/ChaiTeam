import crypto from 'crypto';
import fs from 'fs';
import csv from 'csv-parser';

import { db } from '../libs/db.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const createBatch = async (req, res) => {
  console.log('Request Body: ', req.body);
  try {
    const { name, description } = req.body;
    const adminId = req.user?.id;

    if (!name || !description) {
      throw new ApiError(400, 'Name, Description, and Capacity are required');
    }

    const newBatch = await db.batch.create({
      data: {
        name,
        description: description || '',
      },
    });

    // await db.batchActivity.create({
    //   data: {
    //     id: crypto.randomUUID(),
    //     batch_id: newBatch.id,
    //     user_id: null,
    //     activity_type: 'batch_created',
    //     description: `Batch '${newBatch.name}' created by Admin ${adminId}`,
    //     performed_by: adminId,
    //     metadata: { capacity, metadata },
    //     created_at: new Date(),
    //     is_milestone: true,
    //   },
    // });

    // await db.adminActivity.create({
    //   data: {
    //     id: crypto.randomUUID(),
    //     admin_id: adminId,
    //     target_type: 'batch',
    //     target_id: newBatch.id,
    //     activity_type: 'batch_created',
    //     description: `Created batch '${newBatch.name}'`,
    //     reason: reason || 'Batch creation',
    //     metadata: { capacity, metadata },
    //     created_at: new Date(),
    //     ip_address: req.ip,
    //     user_agent: req.headers['user-agent'],
    //     severity: 'medium',
    //   },
    // });

    return res
      .status(201)
      .json(new ApiResponse(201, newBatch, 'Batch created successfully'));
  } catch (error) {
    console.error('Error creating batch:', error);
    return res.status(500).json(new ApiError(500, 'Error creating batch'));
  }
};

export const getAllBatches = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const where = {};
    if (status) where.status = status;

    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    const [batches, total] = await Promise.all([
      db.batch.findMany({
        where,
        skip,
        take,
        orderBy: { createdAT: 'desc' },
      }),
      db.batch.count({ where }),
    ]);

    return res
      .status(200)
      .json(new ApiResponse(200, batches, 'All Batch fetched successfully'));
  } catch (error) {
    console.error('Error fetching batch:', error);
    return next(new ApiError(500, 'Internal server error', error));
  }
};

export const getBatchById = async (req, res, next) => {
  try {
    const batch = req.batch;

    if (!batch) {
      return next(new ApiError(404, 'Batch not found'));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, batch, 'Batch fetched successfully'));
  } catch (error) {
    console.error('Error fetching batch:', error);
    return next(new ApiError(500, 'Internal server error', error));
  }
};

export const updateBatch = async (req, res, next) => {
  try {
    const { batchId } = req.params;
    const { name, description, status, logoImageUrl, bannerImageUrl } =
      req.body;

    const existingBatch = await db.batch.findUnique({ where: { id: batchId } });

    if (!existingBatch) {
      return res.status(400).json(new ApiError(400, 'Batch Not Found'));
    }

    const updatedBatch = await db.batch.update({
      where: { id: batchId },
      data: {
        name,
        description,
        status,
        logoImageUrl,
        bannerImageUrl,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, updatedBatch, 'Batch updated successfully'));
  } catch (err) {
    console.error('Error updating batch:', err);
    return next(new ApiError(500, 'Internal server error', err));
  }
};

export const deleteBatch = async (req, res, next) => {
  try {
    const batch = req.batch;

    if (!batch) {
      return next(new ApiError(404, 'Batch not found'));
    }

    await db.batch.delete({
      where: { id: batch.id },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, 'Batch deleted successfully'));
  } catch (err) {
    console.error('Error deleting batch:', err);
    return next(new ApiError(500, 'Internal server error', err));
  }
};

export const uploadBatchCSV = async (req, res) => {
  const batchId = req.params?.batchId;

  try {
    if (!batchId) {
      return res.status(400).json(new ApiError(400, 'Batch ID is required'));
    }

    await db.$disconnect();
    const Batch = await db.batch.findUnique({
      where: { id: batchId },
      include: { batchMembers: true },
    });

    if (!Batch) {
      return res.status(400).json(new ApiError(400, 'Batch Not Found'));
    }

    const existingUsersCount = Batch.batchMembers.length;
    const results = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (row) => {
        // Skips if email field is empty
        if (row.email && row.email.trim() !== '') {
          results.push({
            name: row.name?.trim() || null,
            email: row.email.trim(),
            batchId: batchId,
          });
        }
      })
      .on('end', async () => {
        console.log('Results: ', results);

        if (results.length === 0) {
          return res
            .status(400)
            .json(new ApiError(400, 'No valid students found in CSV'));
        }

        await db.batchMember.createMany({
          data: results,
          skipDuplicates: true,
        });

        res
          .status(201)
          .json(
            new ApiResponse(
              201,
              results.length,
              'Students Added to batch successfully',
            ),
          );
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiError(500, 'Failed to uplaod Students'));
  }
};

export const assignUserToBatch = async (req, res) => {
  try {
    const { batchId, userId } = req.body;

    if (!batchId || !userId) {
      return res
        .status(400)
        .json(new ApiError(400, 'Batch ID and User ID are required'));
    }

    const batch = await db.batches.findUnique({ where: { id: batchId } });
    if (!batch) {
      return res.status(404).json(new ApiError(404, 'Batch not found'));
    }

    const user = await db.users.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json(new ApiError(404, 'User not found'));
    }

    // Check if already assigned
    const existing = await db.batch_members.findFirst({
      where: {
        batch_id: batchId,
        user_id: userId,
      },
    });
    if (existing) {
      return res
        .status(400)
        .json(new ApiError(400, 'User already assigned to this batch'));
    }

    // Assign user
    const batchMember = await db.batch_members.create({
      data: {
        batch_id: batchId,
        user_id: userId,
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          'User assigned to batch successfully',
          batchMember,
        ),
      );
  } catch (err) {
    console.error('Error assigning user to batch:', err);
    return res.status(500).json(new ApiError(500, 'Internal server error'));
  }
};
export const removeUserFromBatch = async (req, res) => {
  try {
    const batch = req.batch;
    const { batchId } = req.params;
    const { email } = req.body;

    if (!batchId || !email) {
      throw new ApiError(400, 'Batch ID and User mail are required');
    }

    if (!batch) {
      throw new ApiError(404, 'Batch not found');
    }

    const batchMember = await db.batchMember.findFirst({
      where: {
        email,
      },
    });

    if (!batchMember) {
      throw new ApiError(404, 'User not found in this batch');
    }

    await db.batchMember.delete({
      where: {
        batchId_email: {
          batchId,
          email,
        },
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, 'User removed from batch successfully'));
  } catch (err) {
    console.error('Error removing user from batch:', err);
    return res
      .status(err.statusCode || 500)
      .json(
        new ApiError(
          err.statusCode || 500,
          err.message || 'Internal server error',
        ),
      );
  }
};

export const getBatchUsers = async (req, res) => {
  try {
    const { batchId } = req.params;

    if (!batchId) {
      throw new ApiError(400, 'Batch ID is required');
    }

    const batch = await db.batch.findUnique({
      where: { id: batchId },
      include: {
        batchMembers: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!batch) {
      throw new ApiError(404, 'Batch not found');
    }

    const users = batch.batchMembers.map((member) => ({
      id: member.id,
      email: member.email,
      name: member.name,
    }));

    return res
      .status(200)
      .json(new ApiResponse(200, users, 'Batch users fetched successfully'));
  } catch (err) {
    console.error('Error fetching batch users:', err);
    return res
      .status(err.statusCode || 500)
      .json(
        new ApiError(
          err.statusCode || 500,
          err.message || 'Internal server error',
        ),
      );
  }
};

export const getAllUserBatches = async (req, res) => {
  try {
    const email = req.user?.email; // Assuming userId comes from middleware (JWT/session)
    if (!email) {
      return res
        .status(400)
        .json(new ApiError(401, 'Unauthorized - User not found in request'));
    }

    const batches = await db.batch.findMany({
      where: {
        batchMembers: {
          some: {
            email: email,
          },
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        logoImageUrl: true,
        bannerImageUrl: true,
        createdAT: true,
        updatedAT: true,
      },
    });

    if (!batches || batches.length === 0) {
      throw new ApiError(404, 'No batch assigned to this user');
    }

    return res
      .status(200)
      .json(new ApiResponse(200, batches, 'User batch fetched successfully'));
  } catch (err) {
    console.error('Error in getMyBatch:', err);
    return res
      .status(err.statusCode || 500)
      .json(
        new ApiError(
          err.statusCode || 500,
          err.message || 'Internal server error',
        ),
      );
  }
};
