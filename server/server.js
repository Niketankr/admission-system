import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import applicationRoutes from './routes/application.routes.js';
import { uploadDir } from './middleware/upload.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const isVercel = !!process.env.VERCEL || !!process.env.NOW_REGION;

// Enable CORS for frontend clients
app.use(cors());

// Parse incoming request payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure database connection is ready on requests (Serverless cold-start handler)
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('[DB Middleware Error]', err.message);
  }
  next();
});

// Serve uploaded marksheets/documents statically
app.use('/uploads', express.static(uploadDir));

// Resolve client static path
const clientPath = fs.existsSync(path.join(process.cwd(), 'client'))
  ? path.join(process.cwd(), 'client')
  : path.join(__dirname, '..', 'client');

app.use(express.static(clientPath));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: isVercel ? 'vercel-serverless' : 'standalone-node',
    timestamp: new Date(),
    project: 'MEAN Stack Admission POC'
  });
});

// Fallback to index.html for Single Page Application client routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(clientPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  return res.status(404).send('Not Found');
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Error Handler]', err);

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File too large. Maximum file size allowed is 5MB.' });
  }

  return res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Bootstrap standalone HTTP server if not running in Vercel serverless environment
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

if (!isVercel) {
  bootstrap();
}

export default app;
