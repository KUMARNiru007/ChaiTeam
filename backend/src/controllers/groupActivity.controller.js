import { db } from '../libs/db.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const fetchWholeGroupActivity = async (req, res) => {
  try {
    const { groupId } = req.body;

    if (!groupId) {
      return res.status(400).json(new ApiError(400, 'groupId is required'));
    }

    const GroupActivity = await db.groupActivity.findMany({
      where: { groupId: groupId },
    });

    if (!GroupActivity) {
      return res
        .status(404)
        .json(new ApiError(404, 'No activity of group found.'));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          GroupActivity,
          'Group activity fetched SUccessfully',
        ),
      );
  } catch (error) {
    console.error('Error while fetching group activity: ', error);
    return res
      .status(500)
      .json(new ApiError(500, 'Error while fetching group activity: ', error));
  }
};
