import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import uploadRoutes from './routes/uploadRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Required for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Middlewares
app.use(express.json());
app.use(cookieParser());

// 👇 CORRECTED CORS (Put here before any routes!)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.static(path.join(__dirname, '/client/dist')));

// API Routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/upload', uploadRoutes);

// React Frontend Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Server Listen
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
