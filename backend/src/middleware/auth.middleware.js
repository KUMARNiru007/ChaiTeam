import jwt from 'jsonwebtoken';
import { db } from '../libs/db.js';
import { ApiError } from '../utils/ApiError.js';

export const authMiddleWare = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      throw new ApiError(400, 'User is not authenticated');
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
    } catch (error) {
      return res
        .status(401)
        .json(new ApiError(401, 'Unauthorized: Invalid Token'));
    }

    const user = await db.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
      },
    });

    if (!user) {
      return res.staus(400).json(new ApiError(400, 'User Not Fount'));
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json(new ApiError(400, 'Error while authenticating'));
  }
};

export const CheckRole = async (req, res, next) => {
  try {
    if (!req.user) {
      return res
        .status(400)
        .json(new ApiError(400, 'Failed to verify the User'));
    }

    if (req.user.role !== 'ADMIN') {
      return res.status(400).json(new ApiError(400, 'User Role is not ADMIN'));
    }

    next();
  } catch (error) {
    console.error('Error while checking the user Role: ', error);
    return res
      .status(500)
      .json(new ApiError(500, 'Error while checking the user Role: ', error));
  }
};
