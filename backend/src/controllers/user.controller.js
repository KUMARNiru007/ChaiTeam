import { group } from 'console';
import { db } from '../libs/db.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json(new ApiError(400, 'name is required'));
    }

    const updatedUser = await db.user.update({
      where: { id: req.user.id },
      data: {
        name: name,
      },
    });

    await db.userActivity.create({
      data: {
        userId: req.user.id,
        action: 'PROFILE_UPDATED',
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedUser, 'User profile updated Successfully'),
      );
  } catch (error) {
    console.log('Error while updating user profile details: ', error);
    return res
      .status(500)
      .json(
        new ApiError(500, 'Error while updating user profile details: ', error),
      );
  }
};

export const getUserBatches = async (req, res) => {
  try {
    const batches = await db.batchMember.findMany({
      where: { email: req.user.email },
      include: {
        batch: true,
      },
    });

    if (batches.length === 0) {
      return res
        .status(400)
        .json(new ApiError(400, 'User not enrolled in any batch'));
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        batches.map((b) => b.batch),
        'All user batches fetched successfully',
      ),
    );
  } catch (error) {
    console.log('Error while fetching user batches: ', error);
    return res
      .status(500)
      .json(new ApiError(500, 'Error while fetching user batches', error));
  }
};

export const getUserGroup = async (req, res) => {
  try {
    const { batchId } = req.params;

    if (!batchId) {
      return res.status(400).json(new ApiError(400, 'Batch ID is required'));
    }

    const group = await db.groupMember.findFirst({
      where: { userId: req.user.id, batchId },
      include: {
        group: true,
      },
    });

    if (!group) {
      return res
        .status(400)
        .json(new ApiError(400, 'User is not enrolled in any group'));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, group.group, 'User group fetched successfully'),
      );
  } catch (error) {
    console.log('Error while fetching user group: ', error);
    return res
      .status(500)
      .json(new ApiError(500, 'Error while fetching user group', error));
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await db.user.findMany();

    if (!allUsers) {
      return res.status(404).json(new ApiError(404, 'No user Found!'));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, allUsers, 'All user Fetched Successfullly'));
  } catch (error) {
    console.log('Error while fething All Users: ', error);
    return res
      .status(500)
      .json(new ApiError(500, 'Error while fetching All Users: ', error));
  }
};

export const updateRole = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res
        .status(404)
        .json(
          new ApiError(404, 'User Id Not Found. Please give valid user Id'),
        );
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        role: 'ADMIN',
      },
    });

    if (!updatedUser) {
      return res
        .status(400)
        .json(new ApiError(400, "User Role can't be upadted"));
    }

    res
      .status(200)
      .json(new ApiResponse(200, updateRole, 'User Role Updated Successfully'));
  } catch (error) {
    console.error('Error while updating the User Role: ', error);
    return res
      .status(500)
      .json(new ApiError(500, 'Error while updating the User Role: ', error));
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json(new ApiError(400, 'User ID is required'));
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        role: true,
        createdAT: true,
        updatedAT: true,
        image: true,
        isVerified: true,
        // Don't include email or sensitive fields
      },
    });

    if (!user) {
      return res.status(404).json(new ApiError(404, 'User not found'));
    }

    return res.status(200).json(new ApiResponse(200, user, 'User fetched successfully'));
  } catch (error) {
    console.log('Error while fetching user: ', error);
    return res.status(500).json(new ApiError(500, 'Error while fetching user', error));
  }
};

export const getUserActivities = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json(new ApiError(400, 'User ID is required'));
    }

    const activities = await db.userActivity.findMany({
      where: { userId },
      orderBy: { createdAT: 'desc' },
      take: 50, // Limit to recent 50 activities
    });

    return res.status(200).json(new ApiResponse(200, activities, 'User activities fetched successfully'));
  } catch (error) {
    console.log('Error while fetching user activities: ', error);
    return res.status(500).json(new ApiError(500, 'Error while fetching user activities', error));
  }
};
