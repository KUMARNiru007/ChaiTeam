import { db } from '../libs/db.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
export const createGroup = async (req, res) => {
  try {
    const { name, description, tags, batchId } = req.body;
    const userId = req.user.id;
    const batchName = req.batch.name;

    if (!name || !batchId || !tags) {
      return res
        .status(400)
        .json(new ApiError(400, 'Input fields are required'));
    }

    const existing = await db.groupMember.findFirst({
      where: { userId, batchId },
    });

    if (existing) {
      return res
        .status(400)
        .json(
          new ApiError(400, 'You are already belong to group of this batch'),
        );
    }

    const group = await db.groups.create({
      data: {
        name,
        description,
        tags,
        batchId,
        batchName,
        capacity: 1,
        leader_id: req.user.id,
        member: {
          create: {
            userId,
            batchId,
            name: req.user.name,
            email: req.user.email,
            role: 'LEADER',
          },
        },
      },
      include: { member: true },
    });

    // await db.user.update({
    //   where: { id: userId },
    //   data: {
    //     isInGroup: true,
    //   },
    // });

    await db.userActivity.create({
      data: {
        userId: userId,
        action: 'CREATED_GROUP',
        description: `${req.user.name} created group: ${group.name}.`,
      },
    });

    await db.groupActivity.create({
      data: {
        groupId: group.id,
        action: 'GROUP_CREATED',
        description: `${group.name} is created by ${req.user.name} on ${group.createdAT}`,
      },
    });

    return res
      .status(201)
      .json(new ApiResponse(201, group, 'Group created successfully'));
  } catch (error) {
    console.log(error);
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};

export const getAllGroups = async (req, res) => {
  try {
    const { batchId } = req.query;

    const query = {
      include: {
        member: true,
        leader: true,
      },
    };

    if (batchId) {
      query.where = { batchId };
    }

    const groups = await db.groups.findMany(query);

    return res
      .status(200)
      .json(new ApiResponse(200, groups, 'Groups fetched successfully'));
  } catch (error) {
    console.error('Error in getAllGroups:', error);
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiError(
          error.statusCode || 500,
          error.message || 'Failed to fetch groups',
        ),
      );
  }
};

export const getGroupById = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await db.groups.findUnique({
      where: { id: groupId },
      include: {
        member: true,
      },
    });

    if (!group) throw new ApiError(404, 'Group not found');

    return res
      .status(200)
      .json(new ApiResponse(200, group, 'Group fetched successfully'));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};

export const ApplyToJoinGroup = async (req, res) => {
  const { groupId } = req.params;
  const { reason } = req.body;

  try {
    if (!groupId) {
      return res.status(400).json(new ApiError(400, 'GroudId is required'));
    }

    if (!req.user) {
      return res
        .status(400)
        .json(new ApiError(400, 'User Auntheictation Failed'));
    }

    if (!reason) {
      return res
        .status(400)
        .json(new ApiError(400, 'Reason to join the group is required'));
    }

    const alreadyApplied = await db.joinApplication.findFirst({
      where: { userId: req.user.id, groupId },
    });

    if (alreadyApplied) {
      return res
        .status(400)
        .json(new ApiError(400, 'You are already applied the group'));
    }

    const alreadyJoined = await db.groupMember.findFirst({
      where: { userId: req.user.id, groupId },
    });

    if (alreadyJoined) {
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            "Can't apply. Your are alerady joined another group",
          ),
        );
    }

    const newApplication = await db.joinApplication.create({
      data: {
        userId: req.user.id,
        groupId,
        name: req.user.name,
        email: req.user.email,
        reason,
      },
    });

    const group = await db.groups.findUnique({
      where: { id: groupId },
    });

    await db.userActivity.create({
      data: {
        userId: req.user.id,
        action: 'APPLIED_TO_JOIN_GROUP',
        description: `${req.user.name} applied or put request to join group ${group.name}.`,
      },
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          newApplication,
          'Join request to Group sent Successfully',
        ),
      );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiError(500, 'Failed to send join group request', error));
  }
};

export const fetchAllJoinApplications = async (req, res) => {
  const { groupId } = req.params;
  try {
    if (!groupId) {
      return res.status(400).json(new ApiError(400, 'Groud ID is required'));
    }

    const allApplications = await db.joinApplication.findMany({
      where: { groupId },
    });

    if (allApplications.length === 0) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            null,
            'No application at the moment to join group',
          ),
        );
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          allApplications,
          'All Application fetched successfully',
        ),
      );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiError(500, 'Failed to fetch all joining applictaiosn', error),
      );
  }
};

export const addMemberToGroup = async (req, res) => {
  const { userId, name, email } = req.body;
  const { groupId } = req.params;

  try {
    if (!userId || !groupId) {
      return res
        .status(400)
        .json(new ApiError(400, 'Both User ID and Batch ID are required'));
    }

    if (!name || !email) {
      return res
        .status(400)
        .json(new ApiError(400, "User's name and email are required"));
    }

    const group = await db.groups.findUnique({
      where: { id: groupId },
      include: { member: true },
    });

    if (!group) {
      return res.status(404).json(new ApiError(404, 'Group Not Found'));
    }

    const existing = await db.groupMember.findFirst({
      where: { userId, batchId: group.batchId },
    });

    if (existing) {
      return res
        .status(400)
        .json(new ApiError(400, 'You are already a member of another group'));
    }

    if (group.capacity >= 4) {
      return res
        .status(400)
        .json(new ApiError(400), 'Group already has maximum 4 members ');
    }

    const addedMember = await db.groupMember.create({
      data: {
        userId,
        groupId,
        batchId: group.batchId,
        role: 'MEMBER',
        name,
        email,
      },
    });

    await db.joinApplication.deleteMany({
      where: { userId, groupId },
    });

    await db.groups.update({
      where: { id: groupId },
      data: {
        capacity: { increment: 1 },
      },
    });

    await db.userActivity.create({
      data: {
        userId: userId,
        action: 'JOINED_GROUP',
        description: `${name} is joined the group ${group.name}.`,
      },
    });

    await db.groupActivity.create({
      data: {
        groupId: groupId,
        action: 'MEMBER_JOINED',
        description: `${name} is added to the group.`,
      },
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          addedMember,
          'user added to the Group Successfully',
        ),
      );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          'Error Occured while adding user to the Group',
          error,
        ),
      );
  }
};

export const rejectJoinApplication = async (req, res) => {
  try {
    const { userId } = req.body;
    const { groupId } = req.params;

    if (!groupId || !userId) {
      return res
        .status(400)
        .json(new ApiError(400, 'Both userId and groupId are required'));
    }

    await db.joinApplication.deleteMany({
      where: { userId, groupId },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, 'Application Rejected Successfully'));
  } catch (error) {
    console.error('error while rejecting the application: ', error);
    return res
      .status(500)
      .json(
        new ApiError(500, 'error while rejecting the application: ', error),
      );
  }
};

export const leaveGroup = async (req, res) => {
  const { userId, reason } = req.body;
  const { groupId } = req.params;

  try {
    if (!userId || !groupId) {
      return res
        .status(400)
        .json(new ApiError(400, 'Both user Id and groud Id are required'));
    }

    if (!reason) {
      return res
        .status(400)
        .json(new ApiError(400, 'Resone to leave the group is required'));
    }

    const group = await db.groups.findUnique({
      where: { id: groupId },
      include: { member: true },
    });

    if (!group) {
      return res.status(404).json(new ApiError(404, 'Group Not Found'));
    }

    const member = await db.groupMember.findFirst({
      where: { userId, groupId },
    });

    if (!member) {
      return res
        .status(400)
        .json(new ApiError(400, 'User is not a member of this group'));
    }

    if (member.role === 'LEADER') {
      return res
        .status(400)
        .json(new ApiError(400, "You are ADMIN. You can't leave the group"));
    }

    await db.groupMember.delete({
      where: { id: member.id },
    });

    await db.groups.update({
      where: { id: groupId },
      data: {
        capacity: { decrement: 1 },
      },
    });

    // const user = await db.user.update({
    //   where: { id: userId },
    //   data: {
    //     isInGroup: false,
    //   },
    // });

    await db.userActivity.create({
      data: {
        userId: userId,
        action: 'LEAVED_GROUP',
        description: `${member.name} leaved the ${group.name}.
        Reason: ${reason}`,
      },
    });

    await db.groupActivity.create({
      data: {
        groupId: groupId,
        action: 'MEMBER_LEFT',
        description: `${member.name} leaved the group. 
        Reason by User :-
        ${reason}`,
      },
    });

    res
      .status(200)
      .json(new ApiResponse(200, null, 'User left the group successfully'));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiError(500, 'Failed to leave the group', error));
  }
};

export const kickMemberFromGroup = async (req, res) => {
  const { userId, reason } = req.body;
  const { groupId } = req.params;

  try {
    if (!userId || !groupId) {
      return res
        .status(400)
        .json(new ApiError(400, 'Both UserId and groupId are required'));
    }

    if (!reason) {
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            'Reason to kick the user from the group is required',
          ),
        );
    }

    const member = await db.groupMember.findFirst({
      where: { userId, groupId },
    });

    if (!member) {
      return res
        .status(400)
        .json(new ApiError(400, 'User is not membe of this group'));
    }

    const leader = await db.groupMember.findFirst({
      where: { userId: req.user.id, groupId },
    });

    if (leader.role !== 'LEADER') {
      return res
        .status(401)
        .json(
          new ApiError(
            401,
            'You don;t have permission to kick memeber from group. Only leader can do that',
          ),
        );
    }

    // Storing the reason and userDetails heer in notice board

    await db.groupMember.delete({
      where: { id: member.id },
    });

    const group = await db.groups.update({
      where: { id: groupId },
      data: {
        capacity: { decrement: 1 },
      },
    });

    // const user = await db.user.update({
    //   where: { id: userId },
    //   data: {
    //     isInGroup: false,
    //   },
    // });

    await db.userActivity.create({
      data: {
        userId: userId,
        action: 'KICKED_FROM_GROUP',
        description: `${member.name} kicked from group ${group.name}.
        Reason given by group leader :- 
        ${reason}`,
      },
    });

    await db.groupActivity.create({
      data: {
        groupId: groupId,
        action: 'MEMBER_KICKED',
        description: `${member.name} is kicked from the group.
        Reason by Leader :- 
        ${reason}`,
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(400, null, 'User kicked from the group successfully'),
      );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiError(500, 'error while kicking the user from the froup', error),
      );
  }
};

export const updateGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { name, description, tags, status, logoImageUrl, groupImageUrl } =
      req.body;

    if (!groupId) {
      return res.status(400).json(new ApiError(400, 'Group Id is required'));
    }

    if (!name || !description || !tags || !status) {
      return res.status(400).json(new ApiError(400, 'All Fields are required'));
    }

    const group = await db.groups.update({
      where: { id: groupId },
      data: {
        name,
        description,
        tags,
        status,
        logoImageUrl,
        groupImageUrl,
      },
    });

    await db.groupActivity.create({
      data: {
        groupId: groupId,
        action: 'GROUP_UPDATED',
        description: `Group details has been upadetd.`,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, group, 'Group updated successfully'));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};

export const deleteGroup = async (req, res) => {
  const { groupId } = req.params;

  try {
    if (!groupId) {
      return res.status(400).json(new ApiError(400, 'Group ID is required'));
    }

    const group = await db.groups.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      return res.status(400).json(new ApiError(400, 'Group Not Found'));
    }

    if (group.capacity > 1) {
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            "Batch can't be deleted. All memebers should be removed first",
          ),
        );
    }

    await db.groups.delete({
      where: { id: groupId },
    });

    // await db.user.update({
    //   where: { id: req.user.id },
    //   data: {
    //     isInGroup: false,
    //   },
    // });

    await db.userActivity.create({
      data: {
        userId: req.user.id,
        action: 'DISBANNED_GROUP',
        description: `${req.user.name} Disbanned or closed it's group ${group.name}.`,
      },
    });

    res
      .status(200)
      .json(new ApiResponse(200, null, 'Group Deletd Successfully'));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiError(500, 'Failed to Delete the group', error));
  }
};
