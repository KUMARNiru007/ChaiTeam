import { db } from '../libs/db.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export const createNotice = async (req, res) => {
  try {
    const { groupId, message, type = 'chat' } = req.body;
    const userId = req.user.id;

    if (!groupId || !message) {
      throw new ApiError(400, 'Group ID and message are required');
    }

    // Verify user is member of the group
    const groupMember = await db.groupMember.findFirst({
      where: {
        groupId,
        userId
      }
    });

    if (!groupMember) {
      throw new ApiError(403, 'You are not a member of this group');
    }

    const notice = await db.noticeboard.create({
      data: {
        group_id: groupId,
        user_id: userId,
        type,
        message,
        status: 'active'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profile_color: true
          }
        }
      }
    });

    return res
      .status(201)
      .json(new ApiResponse(201, notice, 'Notice created successfully'));
  } catch (error) {
    console.error('Error creating notice:', error);
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};

export const getGroupNotices = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { type, page = 1, limit = 50 } = req.query;

    if (!groupId) {
      throw new ApiError(400, 'Group ID is required');
    }

    // Verify user is member of the group
    const groupMember = await db.groupMember.findFirst({
      where: {
        groupId,
        userId: req.user.id
      }
    });

    if (!groupMember) {
      throw new ApiError(403, 'You are not a member of this group');
    }

    const where = {
      group_id: groupId,
      status: 'active'
    };

    if (type) where.type = type;

    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    const [notices, total] = await Promise.all([
      db.noticeboard.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profile_color: true
            }
          }
        }
      }),
      db.noticeboard.count({ where })
    ]);

    return res
      .status(200)
      .json(new ApiResponse(200, { notices, total }, 'Notices fetched successfully'));
  } catch (error) {
    console.error('Error fetching notices:', error);
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};

export const updateNotice = async (req, res) => {
  try {
    const { noticeId } = req.params;
    const { message } = req.body;
    const userId = req.user.id;

    if (!message) {
      throw new ApiError(400, 'Message is required');
    }

    const notice = await db.noticeboard.findUnique({
      where: { id: noticeId }
    });

    if (!notice) {
      throw new ApiError(404, 'Notice not found');
    }

    if (notice.user_id !== userId) {
      throw new ApiError(403, 'You can only edit your own messages');
    }

    const updatedNotice = await db.noticeboard.update({
      where: { id: noticeId },
      data: {
        message,
        is_edited: true,
        updated_at: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profile_color: true
          }
        }
      }
    });

    return res
      .status(200)
      .json(new ApiResponse(200, updatedNotice, 'Notice updated successfully'));
  } catch (error) {
    console.error('Error updating notice:', error);
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};

export const deleteNotice = async (req, res) => {
  try {
    const { noticeId } = req.params;
    const userId = req.user.id;

    const notice = await db.noticeboard.findUnique({
      where: { id: noticeId }
    });

    if (!notice) {
      throw new ApiError(404, 'Notice not found');
    }

    // Check if user is the author or group leader
    const isAuthor = notice.user_id === userId;
    const isLeader = await db.groupMember.findFirst({
      where: {
        groupId: notice.group_id,
        userId,
        role: 'LEADER'
      }
    });

    if (!isAuthor && !isLeader) {
      throw new ApiError(403, 'You can only delete your own messages or be a group leader');
    }

    await db.noticeboard.update({
      where: { id: noticeId },
      data: { status: 'deleted' }
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, 'Notice deleted successfully'));
  } catch (error) {
    console.error('Error deleting notice:', error);
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};

export const pinNotice = async (req, res) => {
  try {
    const { noticeId } = req.params;
    const userId = req.user.id;

    // Check if user is group leader
    const notice = await db.noticeboard.findUnique({
      where: { id: noticeId },
      include: {
        group: {
          include: {
            member: {
              where: {
                userId,
                role: 'LEADER'
              }
            }
          }
        }
      }
    });

    if (!notice) {
      throw new ApiError(404, 'Notice not found');
    }

    if (notice.group.member.length === 0) {
      throw new ApiError(403, 'Only group leaders can pin messages');
    }

    const pinnedNotice = await db.noticeboard.update({
      where: { id: noticeId },
      data: { type: 'pinned_chat' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profile_color: true
          }
        }
      }
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
    const notice = await db.noticeboard.findUnique({
      where: { id: noticeId },
      include: {
        group: {
          include: {
            member: {
              where: {
                userId,
                role: 'LEADER'
              }
            }
          }
        }
      }
    });

    if (!notice) {
      throw new ApiError(404, 'Notice not found');
    }

    if (notice.group.member.length === 0) {
      throw new ApiError(403, 'Only group leaders can unpin messages');
    }

    const unpinnedNotice = await db.noticeboard.update({
      where: { id: noticeId },
      data: { type: 'chat' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profile_color: true
          }
        }
      }
    });

    return res
      .status(200)
      .json(new ApiResponse(200, unpinnedNotice, 'Notice unpinned successfully'));
  } catch (error) {
    console.error('Error unpinning notice:', error);
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};