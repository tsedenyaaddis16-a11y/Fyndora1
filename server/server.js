import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initMampDatabase } from './config/mampDb.js';
import { seedMampDatabase } from './scripts/seedMamp.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import scholarshipRoutes from './routes/scholarshipRoutes.js';
import opportunityRoutes from './routes/opportunityRoutes.js';
import userRoutes from './routes/userRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import universityRoutes from './routes/universityRoutes.js';
import mentorRoutes from './routes/mentorRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

// Middleware
import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Enable CORS
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

// Body Parser
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Fyndora REST API is operational',
    database: `MAMP MySQL (${process.env.DB_NAME || 'pathfinder'})`,
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/users', userRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/mentor-journey', mentorRoutes);
app.use('/api/chat', chatRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to and initialize MAMP MySQL Database
  const isMampConnected = await initMampDatabase();

  if (isMampConnected) {
    await seedMampDatabase();
  }

  app.listen(PORT, () => {
    console.log(`🚀 Fyndora API Server running on http://localhost:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health`);
    console.log(`   Database: MAMP MySQL (Database: ${process.env.DB_NAME || 'pathfinder'}, Port: ${process.env.DB_PORT || 3306})`);
  });
};

startServer();
