import { db } from '../libs/db.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export const fetchWholeUserActivity = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json(new ApiError(400, 'userId is required'));
    }

    const UserAcitvity = await db.userAcitvity.findMany({
      where: { userId: userId },
    });

    if (!UserAcitvity) {
      return res
        .status(404)
        .json(new ApiError(404, 'There is no activity of user found'));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, UserAcitvity, 'User activity fetched Successfuly'),
      );
  } catch (error) {
    console.log('error while fethcing user activity: ', error);
    return res
      .status(500)
      .json(new ApiError(500, 'error while fethcing user activity: ', error));
  }
};
