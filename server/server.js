import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import applicationRoutes from './routes/application.routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend clients
app.use(cors());

// Parse incoming request payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded marksheets/documents statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend client if present
const clientPath = path.join(__dirname, '..', 'client');
app.use(express.static(clientPath));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date(), project: 'MEAN Stack Admission POC' });
});

// Fallback to index.html for Single Page Application client routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientPath, 'index.html'));
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Error Handler]', err);

  // Handle Multer file size / type errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File too large. Maximum file size allowed is 5MB.' });
  }

  return res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start Server and connect to Database
async function bootstrap() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 Online Admission System (MEAN Stack POC) Running!`);
    console.log(`📡 Server URL: http://localhost:${PORT}`);
    console.log(`📋 API Endpoints: http://localhost:${PORT}/api/`);
    console.log(`💻 Web Application: http://localhost:${PORT}/`);
    console.log(`=======================================================`);
  });
}

bootstrap();

