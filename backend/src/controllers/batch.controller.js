import { db } from '../libs/db.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import crypto from 'crypto';


export const createBatch = async (req, res) => {
  try {
    const { name, description, capacity, metadata, reason } = req.body;
    const adminId = req.user?.id;

    if (!name || !capacity || !description) {
      throw new ApiError(
        400,
        "Name, Description, and Capacity are required"
      );
    }

 
    const newBatch = await db.batch.create({
      data: {
        id: crypto.randomUUID(),
        name,
        description: description || "",
        capacity,
        status: "active",
        metadata: metadata || {},
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    
    await db.batchActivity.create({
      data: {
        id: crypto.randomUUID(),
        batch_id: newBatch.id,
        user_id: null,
        activity_type: "batch_created",
        description: `Batch '${newBatch.name}' created by Admin ${adminId}`,
        performed_by: adminId,
        metadata: { capacity, metadata },
        created_at: new Date(),
        is_milestone: true,
      },
    });

   
    await db.adminActivity.create({
      data: {
        id: crypto.randomUUID(),
        admin_id: adminId,
        target_type: "batch",
        target_id: newBatch.id,
        activity_type: "batch_created",
        description: `Created batch '${newBatch.name}'`,
        reason: reason || "Batch creation",
        metadata: { capacity, metadata },
        created_at: new Date(),
        ip_address: req.ip,
        user_agent: req.headers["user-agent"],
        severity: "medium",
      },
    });

    return res
      .status(201)
      .json(new ApiResponse(201, newBatch, "Batch created successfully"));
  } catch (error) {
    console.error("Error creating batch:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Error creating batch"));
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
      db.batches.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: "desc" },
      }),
      db.batches.count({ where }),
    ]);

    return res
      .status(200)
      .json(new ApiResponse(200, batch, "All Batch fetched successfully"));
  } catch (error) {
    console.error("Error fetching batch:", error);
    return next(new ApiError(500, "Internal server error", error));
  }
};

export const getBatchById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const batch = await db.batches.findUnique({
      where: { id },
      include: {
        batch_members: {
          include: {
            users: {
              select: {
                id: true,
                username: true,
                email: true,
                first_name: true,
                last_name: true,
                status: true,
              },
            },
          },
        },
        groups: {
          select: {
            id: true,
            name: true,
            status: true,
            capacity: true,
            current_members: true,
          },
        },
      },
    });

    if (!batch) {
      return next(new ApiError(404, "Batch not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, batch, "Batch fetched successfully"));
  } catch (error) {
    console.error("Error fetching batch:", error);
    return next(new ApiError(500, "Internal server error", error));
  }
};

export const updateBatch = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, status, capacity } = req.body;

    const existingBatch = await db.batches.findUnique({ where: { id } });

    if (!existingBatch) {
      return next(new ApiError(404, "Batch not found"));
    }

    const updatedBatch = await db.batches.update({
      where: { id },
      data: {
        name,
        description,
        status,
        capacity,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, updatedBatch, "Batch updated successfully"));
  } catch (err) {
    console.error("Error updating batch:", err);
    return next(new ApiError(500, "Internal server error", err));
  }
};

export const deleteBatch = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingBatch = await db.batches.findUnique({ where: { id } });

    if (!existingBatch) {
      return next(new ApiError(404, "Batch not found"));
    }

    await db.batches.delete({
      where: { id },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Batch deleted successfully"));
  } catch (err) {
    console.error("Error deleting batch:", err);
    return next(new ApiError(500, "Internal server error", err));
  }
};

export const uploadBatchCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json(new ApiError(400, "CSV file is required"));
    }

    const { batchId } = req.body;
    if (!batchId) {
      return res
        .status(400)
        .json(new ApiError(400, "Batch ID is required"));
    }

    const batch = await db.batches.findUnique({ where: { id: batchId } });
    if (!batch) {
      return res
        .status(404)
        .json(new ApiError(404, "Batch not found"));
    }

    const members = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row) => {
        members.push(row); // Collect rows
      })
      .on("end", async () => {
        try {

          //CSV contains: email, username, first_name, last_name
          const insertData = members.map((m) => ({
            batch_id: batchId,
            user: {
              connectOrCreate: {
                where: { email: m.email },
                create: {
                  email: m.email,
                  username: m.username,
                  first_name: m.first_name,
                  last_name: m.last_name,
                  status: "active",
                },
              },
            },
          }));

          for (const data of insertData) {
            await db.batch_members.create({ data });
          }

          return res
            .status(201)
            .json(new ApiResponse(201, "Batch CSV uploaded successfully", members));
        } catch (err) {
          console.error("Error saving members:", err);
          return res
            .status(500)
            .json(new ApiError(500, "Error saving members to database"));
        }
      });
  } catch (err) {
    console.error("Error uploading batch CSV:", err);
    return res
      .status(500)
      .json(new ApiError(500, "Internal server error"));
  }
};

export const assignUserToBatch = async (req, res) => {
  try {
    const { batchId, userId } = req.body;

    if (!batchId || !userId) {
      return res
        .status(400)
        .json(new ApiError(400, "Batch ID and User ID are required"));
    }

    const batch = await db.batches.findUnique({ where: { id: batchId } });
    if (!batch) {
      return res.status(404).json(new ApiError(404, "Batch not found"));
    }

    const user = await db.users.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }

    // Check if already assigned
    const existing = await db.batch_members.findFirst({
      where: {
         batch_id: batchId,
         user_id: userId },
    });
    if (existing) {
      return res
        .status(400)
        .json(new ApiError(400, "User already assigned to this batch"));
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
      .json(new ApiResponse(200, "User assigned to batch successfully", batchMember));
  } catch (err) {
    console.error("Error assigning user to batch:", err);
    return res
      .status(500)
      .json(new ApiError(500, "Internal server error"));
  }
};
export const removeUserFromBatch = async (req, res) => {
  try {
    const { batchId, userId } = req.params;

    if (!batchId || !userId) {
      throw new ApiError(400, "Batch ID and User ID are required");
    }

    
    const batch = await db.batches.findUnique({ where: { 
        id: batchId
     } });
    if (!batch) {
      throw new ApiError(404, "Batch not found");
    }

  
    const batchMember = await db.batch_members.findUnique({
      where: {
        batch_id_user_id: {
          batch_id: batchId,
          user_id: userId,
        },
      },
    });

    if (!batchMember) {
      throw new ApiError(404, "User not found in this batch");
    }

    await db.batch_members.delete({
      where: {
        batch_id_user_id: {
          batch_id: batchId,
          user_id: userId,
        },
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "User removed from batch successfully"));
  } catch (err) {
    console.error("Error removing user from batch:", err);
    return res
      .status(err.statusCode || 500)
      .json(
        new ApiError(err.statusCode || 500, err.message || "Internal server error")
      );
  }
};

export const getBatchUsers = async (req, res) => {
  try {
    const { batchId } = req.params;

    if (!batchId) {
      throw new ApiError(400, "Batch ID is required");
    }

    const batch = await db.batches.findUnique({
      where: { id: batchId },
      include: {
        batch_members: {
          include: {
            users: {
              select: {
                id: true,
                username: true,
                email: true,
                first_name: true,
                last_name: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!batch) {
      throw new ApiError(404, "Batch not found");
    }

    const users = batch.batch_members.map((member) => member.users);

    return res
      .status(200)
      .json(new ApiResponse(200, users, "Batch users fetched successfully"));
  } catch (err) {
    console.error("Error fetching batch users:", err);
    return res
      .status(err.statusCode || 500)
      .json(
        new ApiError(err.statusCode || 500, err.message || "Internal server error")
      );
  }
};

export const getMyBatch = async (req, res) => {
  try {
    const userId = req.user?.id; // Assuming userId comes from middleware (JWT/session)
    if (!userId) {
      throw new ApiError(401, "Unauthorized - User not found in request");
    }

    const batch = await db.batches.findFirst({
      where: {
        batch_members: {
          some: {
            user_id: userId,
          },
        },
      },
      include: {
        batch_members: {
          include: {
            users: {
              select: {
                id: true,
                username: true,
                email: true,
                first_name: true,
                last_name: true,
                status: true,
              },
            },
          },
        },
        groups: {
          select: {
            id: true,
            name: true,
            status: true,
            capacity: true,
            current_members: true,
          },
        },
      },
    });

    if (!batch) {
      throw new ApiError(404, "No batch assigned to this user");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, batch, "User batch fetched successfully"));
  } catch (err) {
    console.error("Error in getMyBatch:", err);
    return res.status(err.statusCode || 500).json(
      new ApiError(
        err.statusCode || 500,
        err.message || "Internal server error"
      )
    );
  }
};
