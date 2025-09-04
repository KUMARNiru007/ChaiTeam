import { db } from '../libs/db.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export const createNotice = async (req, res) => {
  try {
    const { title, content, scope, groupId, batchId } = req.body;
    const userId = req.user.id;

    if (!title || !content || !scope) {
      return res
        .status(400)
        .json(new ApiError(400, 'Tile, content and scope fileds are required'));
    }

    if (scope === 'GROUP' && !groupId) {
      return res
        .status(400)
        .json(new ApiError(400, 'groupId is required for GROUP notices'));
    }
    if (scope === 'BATCH' && !batchId) {
      return res
        .status(400)
        .json(new ApiError(400, 'batchId is required for BATCH notices'));
    }
    if (scope === 'GLOBAL' && (groupId || batchId)) {
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            'for GLOBAL notices both groudId and batchId is not required',
          ),
        );
    }

    const newNotice = await db.notices.create({
      data: {
        title,
        content,
        scope,
        groupId: groupId || null,
        batchId: batchId || null,
        createdById: userId,
      },
    });

    return res
      .status(201)
      .json(new ApiResponse(201, newNotice, 'New ntice created Successfully'));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiError(500, 'Error while creating notice', error));
  }
};

export const getGroupNotices = async (req, res) => {
  try {
    const { groupId } = req.params;

    if (!groupId) {
      return res.status(400).json(new ApiError(400, 'groupId is required'));
    }

    const groupNotices = await db.notices.findMany({
      where: {
        OR: [{ groupId: groupId }],
      },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        group: { select: { id: true, name: true } },
        batch: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          groupNotices,
          'Gruop notices fetched Successfully',
        ),
      );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiError(500, 'Error while fetching all notices of the group'));
  }
};

export const getBatchNotices = async (req, res) => {
  try {
    const { batchId } = req.params;

    if (!batchId) {
      return res.status(400).json(new ApiError(500, 'batchId is required'));
    }

    const batchNotices = await db.notices.findmany({
      where: {
        OR: [{ batchId: batchId }],
      },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        group: { select: { id: true, name: true } },
        batch: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          batchNotices,
          'All notices of batch fetched successfully',
        ),
      );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiError(500, 'Error while fetching batch notices', error));
  }
};

export const getGlobalNotices = async (req, res) => {
  try {
    const globalNotices = await db.notices.findMany({
      where: {
        OR: [{ scope: 'GLOBAL' }],
      },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        group: { select: { id: true, name: true } },
        batch: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          globalNotices,
          'All global notices fethced successfully',
        ),
      );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiError(500, 'Error while fetching all gloabl notices', error),
      );
  }
};

export const updateNotice = async (req, res) => {
  try {
    const { noticeId } = req.params;
    const { title, content } = req.body;
    const user = req.user;

    if (!noticeId) {
      return res.status(400).json(new ApiError(400, 'noticeId is required'));
    }

    if (!title || !content) {
      return res
        .status(400)
        .json(new ApiError(400, 'Both title and content is required'));
    }

    const notice = await db.notices.findUnique({
      where: { id: noticeId },
    });

    if (!notice) {
      return res.status(404).json(new ApiError(404, 'Notice nto found'));
    }

    if (notice.createdById !== user.id && user.role !== 'ADMIN') {
      return res
        .status(401)
        .json(new ApiError(401, 'You can only edit your own notices'));
    }

    const updatedNotice = await db.notices.update({
      where: { id: noticeId },
      data: {
        title,
        content,
        isEdited: true,
        updatedAt: new Date(),
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, updatedNotice, 'Notice updated successfully'));
  } catch (error) {
    console.error('Error updating notice:', error);
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(500, 'Error while upadting notice', error));
  }
};

export const deleteNotice = async (req, res) => {
  try {
    const { noticeId } = req.params;
    const user = req.user;

    if (!noticeId) {
      return res.status(400).json(new ApiError(400, 'noticeId is required'));
    }

    const notice = await db.notices.findUnique({
      where: { id: noticeId },
    });

    if (!notice) {
      return res.status(404).json(new ApiError(404, 'Notice Not Found'));
    }

    const groupMemeber = await db.groupMemeber.findUnique({
      where: { userId: user.id },
    });

    if (
      notice.createdById !== user.id &&
      user.role !== 'ADMIN' &&
      groupMemeber.role !== 'LEADER'
    ) {
      return res
        .status(401)
        .json(new ApiError(401, 'you are nto allowd to delete this notice'));
    }

    await db.notices.delte({
      where: { id: noticeId },
    });

    return res
      .status(200)
      .json(new ApiResponse(20, null, 'Notice deleted Successfully'));
  } catch (error) {
    console.log('Error while deleting notice: ', error);
    return res
      .status(500)
      .json(new ApiError(500, 'Error while deleting notice: ', error));
  }
};

export const pinNotice = async (req, res) => {
  try {
    const { noticeId } = req.params;
    const userId = req.user.id;

    // Check if user is group leader
    const notice = await db.notices.findUnique({
      where: { id: noticeId },
      include: {
        group: {
          include: {
            member: {
              where: {
                userId,
                role: 'LEADER',
              },
            },
          },
        },
      },
    });

    if (!notice) {
      throw new ApiError(404, 'Notice not found');
    }

    if (notice.group.member.length === 0) {
      throw new ApiError(403, 'Only group leaders can pin messages');
    }

    const pinnedNotice = await db.notices.update({
      where: { id: noticeId },
      data: { type: 'pinned_chat' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profile_color: true,
          },
        },
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, pinnedNotice, 'Notice pinned successfully'));
  } catch (error) {
    console.error('Error pinning notice:', error);
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};

export const unpinNotice = async (req, res) => {
  try {
    const { noticeId } = req.params;
    const userId = req.user.id;

    // Check if user is group leader
    const notice = await db.notices.findUnique({
      where: { id: noticeId },
      include: {
        group: {
          include: {
            member: {
              where: {
                userId,
                role: 'LEADER',
              },
            },
          },
        },
      },
    });

    if (!notice) {
      throw new ApiError(404, 'Notice not found');
    }

    if (notice.group.member.length === 0) {
      throw new ApiError(403, 'Only group leaders can unpin messages');
    }

    const unpinnedNotice = await db.notices.update({
      where: { id: noticeId },
      data: { type: 'chat' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profile_color: true,
          },
        },
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, unpinnedNotice, 'Notice unpinned successfully'),
      );
  } catch (error) {
    console.error('Error unpinning notice:', error);
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};
