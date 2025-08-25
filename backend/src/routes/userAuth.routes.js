import express from 'express';
import {
  check,
  googleLogin,
  gtihubLogin,
  logout,
  tokenRefresh,
} from '../controllers/auth.controller.js';
import { authMiddleWare } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/google', (req, res) => {
  const redirectUrl = process.env.GOOGLE_CALLBACK_URL;
  const clientId = process.env.GOOGLE_CLIENT_ID;

  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUrl}&response_type=code&scope=openid%20email%20profile&access_type=offline`;

  res.redirect(url);
});

router.get('/google/callback', googleLogin);

router.get('/github', (req, res) => {
  const redirectUrl = process.env.GITHUB_CALLBACK_URL;
  const clientId = process.env.GITHUB_CLIENT_ID;

  const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUrl}&scope=user:email`;

  res.redirect(url);
});

router.get('/github/callback', gtihubLogin);

router.get('/check', authMiddleWare, check);
router.get('/refreshToken', tokenRefresh);
router.get('/logout', authMiddleWare, logout);

export default router;
