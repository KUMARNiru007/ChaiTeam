import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import userAuthRoutes from './routes/userAuth.routes.js';
import batchRoutes from './routes/batch.routes.js';
import groupRoutes from './routes/groups.routes.js';
import noticeboardRoutes from './routes/noticeboard.routes.js';
import activityRoutes from './routes/Activity.routes.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 4000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authroization'],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hi, welcome to ChaiTeam');
});

app.use('/api/v1/auth', userAuthRoutes);
app.use('/api/v1/batch', batchRoutes);
app.use('/api/v1/groups', groupRoutes);
app.use('/api/v1/noticeboard', noticeboardRoutes);
app.use('/api/v1/activity', activityRoutes);

app.listen(PORT, () => {
  console.log(`App is listning on PORT: ${PORT}`);
});
