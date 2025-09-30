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

    const userInBatch = await db.batchMember.findFirst({
      where: { email },
    });
    let user = await db.user.findFirst({ where: { email } });

    // if (user) {
    //   if (user.provider !== 'google') {
    //     throw new ApiError(
    //       400,
    //       `Account already exists with ${user.provider}. Please login through ${user.provider}`,
    //     );
    //   }
    // }
    // if (!user) {
    //   user = await db.user.create({
    //     data: {
    //       email,
    //       name,
    //       image: picture,
    //       provider: 'google',
    //     },
    //   });

    //   await db.userActivity.create({
    //     data: {
    //       userId: user.id,
    //       action: 'ACCOUNT_CREATED',
    //       description: `${user.name} first time landed on ${user.createdAT}`,
    //     },
    //   });
    // }

    if (userInBatch && !user) {
      user = await db.user.create({
        data: {
          email,
          name,
          image: picture,
          provider: 'google',
        },
      });

      await db.userActivity.create({
        data: {
          userId: user.id,
          action: 'ACCOUNT_CREATED',
          description: `${user.name} first time landed on ${user.createdAT}`,
        },
      });
    } else if (!userInBatch) {
      return res
        .status(401)
        .json(
          new ApiError(
            401,
            'You are not alowed to logIn in this app. As, you are not a memebr of any batch',
          ),
        );
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToekn(user);

    await db.user.update({
      where: { id: user.id },
      data: {
        refreshToken,
      },
    });

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

    return res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  } catch (error) {
    console.error(
      'Google OAuth Error Response:',
      error.response?.data || error.message || error,
    );
    throw new ApiError(500, 'Google Authentication failed');
  }
};

const gtihubLogin = async (req, res) => {
  const code = req.query.code;

  try {
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GITHUB_CALLBACK_URL,
      },
      { headers: { Accept: 'application/json' } },
    );

    const GithubAccessToken = tokenResponse.data.access_token;

    // Fetching user profile details from github
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${GithubAccessToken}` },
    });

    const emailResponse = await axios.get(
      'https://api.github.com/user/emails',
      {
        headers: { Authorization: `Bearer ${GithubAccessToken}` },
      },
    );

    const githubUser = userResponse.data;
    const email = emailResponse.data.find((e) => e.primary).email;

    const userInGroup = await db.groupMember.findFirst({ where: { email } });
    let user = await db.user.findFirst({ where: { email } });

    // if (user) {
    //   if (user.provider !== 'github') {
    //     throw new ApiError(
    //       400,
    //       `Account already exists with ${user.provider}. Please login through ${user.provider}`,
    //     );
    //   }
    // }
    // if (!user) {
    //   user = await db.user.create({
    //     data: {
    //       email,
    //       name: githubUser.name || githubUser.login,
    //       image: githubUser.avatar_url,
    //       provider: 'github',
    //     },
    //   });

    //   await db.userActivity.create({
    //     data: {
    //       userId: user.id,
    //       action: 'ACCOUNT_CREATED',
    //       description: `${user.name} first time landed on ${user.createdAT}`,
    //     },
    //   });
    // }

    if (userInGroup && !user) {
      user = await db.user.create({
        data: {
          email,
          name: githubUser.name || githubUser.login,
          image: githubUser.avatar_url,
          provider: 'github',
        },
      });

      await db.userActivity.create({
        data: {
          userId: user.id,
          action: 'ACCOUNT_CREATED',
          description: `${user.name} first time landed on ${user.createdAT}`,
        },
      });
    } else if (!userInGroup) {
      return res
        .status(401)
        .json(
          new ApiError(
            401,
            'You are not alowed to logIn in this app. As, you are not a memebr of any batch',
          ),
        );
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToekn(user);

    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken,
      },
    });

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

    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  } catch (error) {
    console.error(
      'GitHub OAuth error:',
      error || error.response?.data || error.message,
    );
    throw new ApiError(500, 'Guhub Authentication Failed', error);
  }
};
const check = async (req, res) => {
  try {
    return res
      .status(200)
      .json(new ApiResponse(200, req.user, 'User AUthenticated Successfully'));
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json(new ApiError(400, 'Error while checking authencity of the user'));
  }
};

const tokenRefresh = async (req, res) => {
  try {
    console.log(req.cookies);
    const refreshToken = req.cookies?.refreshToken;

    console.log('Refresh Token Found', refreshToken ? 'YES' : 'NO');
    if (!refreshToken) {
      return res.status(403).json(new ApiError(403, 'Refresh token Not Found'));
    }

    const user = await db.user.findFirst({
      where: {
        refreshToken,
      },
    });

    if (!user) {
      return res.status(403).json(new ApiError(403, 'Invalid Refresh Token'));
    }

    const decodedData = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET,
    );

    if (!decodedData) {
      return res
        .status(403)
        .json(new ApiError(403, 'Refresh Token Expired. Login Again'));
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToekn(user);

    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    });

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

    res.cookie('accessToken', newAccessToken, accessCookieOptions);
    res.cookie('refreshToken', refreshToken, refreshCookieOptions);

    return res
      .status(200)
      .json(new ApiResponse(200, null, 'Token Refreshed Successfully'));
  } catch (error) {
    console.log(error);
    return res.status(400).json(new ApiError(400, error.message));
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie('accessToken', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    await db.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        accessToken: null,
        refreshToken: null,
      },
    });

    res
      .status(200)
      .json(new ApiResponse(200, null, 'User LoggedOut Successfully'));
  } catch (error) {
    console.log(error);
    return res.status(400).json(new ApiError(400, error.message));
  }
};

export { googleLogin, gtihubLogin, check, tokenRefresh, logout };
