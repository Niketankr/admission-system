import mongoose from 'mongoose';

export let isMongoConnected = false;

export async function connectDB() {
  // If already connected, reuse connection
  if (mongoose.connection.readyState === 1) {
    isMongoConnected = true;
    return true;
  }

  const uri = process.env.MONGODB_URI;
  const isVercel = !!process.env.VERCEL;

  // On Vercel, if no external MongoDB URI (e.g. Atlas) is configured, immediately use in-memory store
  if (isVercel && !uri) {
    isMongoConnected = false;
    console.log('[Database] Running on Vercel with In-Memory Data Store (Add MONGODB_URI in Vercel Settings to connect Atlas).');
    return false;
  }

  const mongoUri = uri || 'mongodb://127.0.0.1:27017/admission_db';

  try {
    console.log(`[Database] Connecting to MongoDB...`);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
    isMongoConnected = true;
    console.log('✅ [Database] MongoDB connected successfully to database:', mongoose.connection.name);
    return true;
  } catch (err) {
    isMongoConnected = false;
    console.log(`ℹ️ [Database] MongoDB connection bypassed (${err.message}).`);
    console.log('🚀 [Database] In-Memory Data Store active.');
    return false;
  }
}
