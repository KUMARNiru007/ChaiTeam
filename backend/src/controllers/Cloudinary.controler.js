import crypto from 'crypto';

import cloudinary from '../utils/Cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

const GetCloudinarySignature = async (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = 'batches';

    const stringToSign = `folder=${folder}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`;

    const signature = crypto
      .createHash('sha1')
      .update(stringToSign)
      .digest('hex');

    const data = {
      apiKey: process.env.CLOUDINARY_API_KEY,
      timestamp,
      signature,
      folder,
    };

    return res
      .status(200)
      .json(new ApiResponse(200, data, 'Image Signed Successfully'));
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json(new ApiError(400, 'Error while Signing the Image', error));
  }
};

export { GetCloudinarySignature };
