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
