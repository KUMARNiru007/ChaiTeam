import express from 'express';
import { googleLogin } from '../controllers/auth.controlers.js';

const router = express.Router();

router.get('/google', (req, res) => {
  const redirectUrl = process.env.GOOGLE_CALLBACK_URL;
  const clientId = process.env.GOOGLE_CLIENT_ID;

  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUrl}&response_type=code&scope=openid%20email%20profile&access_type=offline`;

  res.redirect(url);
});

router.get('/google/callback', googleLogin);

export default router;
