// server.js
import 'express-async-errors';
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import testRoutes from './routes/testRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import jobRoutes from "./routes/jobRoutes.js";
import errorHandler from './middleware/errorHandler.js';

dotenv.config();
const app = express();

// If behind proxy/load balancer (Heroku, nginx), enable trust proxy in production
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Basic security headers (optional but recommended)
app.use(helmet());

// Body parsers & cookie parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// CORS - allow your frontend and credentials (cookies)
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Basic root route
app.get('/', (req, res) => res.json({ message: '🚀 MERN Auth Backend is running...' }));

// Mount routes (all should be prefixed with /api)
app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/jobs', jobRoutes);

// Error handler (last middleware)
app.use(errorHandler);

// Connect DB & start server
const PORT = process.env.PORT || 5000;
const start = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI not set in .env');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
  } catch (err) {
    console.error('❌ Failed to start:', err);
    process.exit(1);
  }
};

start();
