import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateAccessToken = (user) => {
  // console.log('access spiry: ', process.env.ACCESS_TOKEN_EXPIRY);
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );
};

const generateRefreshToekn = (user) => {
  // console.log('refresh expiry: ', process.env.REFRESH_TOKEN_EXPIRY);
  return jwt.sign({ id: user.id }, process.env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

export { generateAccessToken, generateRefreshToekn };
