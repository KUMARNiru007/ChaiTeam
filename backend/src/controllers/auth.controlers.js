import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';

import { db } from '../libs/db.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import {
  generateAccessToken,
  generateRefreshToekn,
} from '../utils/GenerateTokens.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const googleLogin = async (req, res) => {
  // console.log('Auth code from Google:', req.query.code);
  const code = req.query.code;

  if (!code) {
    throw new ApiError(400, 'Authorization code not provided');
  }

  try {
    const tokenResponse = await axios.post(
      'https://oauth2.googleapis.com/token',
      {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLOUD_SECRET,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL,
        grant_type: 'authorization_code',
      },
    );

    const { id_token } = tokenResponse.data;

    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    let user = await db.user.findFirst({ where: { email } });
    if (!user) {
      user = await db.user.create({
        data: {
          email,
          name,
          image: picture,
        },
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToekn(user);

    const accessCookieOptions = {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 1000 * 60 * 15, // 15 minutes
    };

    const refreshCookieOptions = {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    };

    res.cookie('accessToken', accessToken, accessCookieOptions);
    res.cookie('refreshToken', refreshToken, refreshCookieOptions);

    return res.redirect(`${process.env.BASE_URL}`);
  } catch (error) {
    console.error(
      'Google OAuth Error Response:',
      error.response?.data || error.message || error,
    );
    throw new ApiError(500, 'Google Authentication failed');
  }
};

export { googleLogin };
