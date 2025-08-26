import { db } from "../libs/db.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";


export const createGroup = async (req, res) => {
  try {
    const { name, description, batch_id } = req.body;

    if (!name || !batch) { 
      throw new ApiError(400, "Input fields are required");}

    const group = await db.groups.create({
      data: {
        name,
        description,
        batch_id,
        leader_id: req.user.id, 
      },
    });

    return res
      .status(201)
      .json(new ApiResponse(201, group, "Group created successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};

export const getAllGroups = async (req, res) => {
  try {
    const groups = await db.groups.findMany({
      include: {
        leader: true,
        batch: true,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, groups, "Groups fetched successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};

export const getGroupById = async (req, res) => {
  try {
    const { id } = req.params;

    const group = await db.groups.findUnique({
      where: { id },
      include: {
        leader: true,
        batch: true,
      },
    });

    if (!group) throw new ApiError(404, "Group not found");

    return res
      .status(200)
      .json(new ApiResponse(200, group, "Group fetched successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};

export const updateGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;

    const group = await db.groups.update({
      where: { id },
      data: {
        name,
        description,
        status,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, group, "Group updated successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;

    await db.groups.delete({ where: { id } });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Group deleted successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message));
  }
};
