import express from 'express';
const app = express();
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './database/db.js';
dotenv.config({
  path: './.env',
});

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import urlRouter from './router/urlRouter.js';
app.use('/url', urlRouter);

import authRouter from './router/authRouter.js';
app.use('/auth', authRouter);

connectDB().then(() => {
  app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running on port 8000');
  });
});


