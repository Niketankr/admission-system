import mongoose from 'mongoose';

export let isMongoConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/admission_db';

  try {
    console.log(`[Database] Attempting to connect to MongoDB at ${uri}...`);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    isMongoConnected = true;
    console.log('✅ [Database] MongoDB connected successfully to database:', mongoose.connection.name);
  } catch (err) {
    isMongoConnected = false;
    console.log(`ℹ️ [Database] Primary MongoDB not reachable (${err.message}).`);
    console.log('🚀 [Database] Activating instant In-Memory Data Store (Zero-Setup Fallback).');
    console.log('📌 [Database] All CRUD, Auth, Uploads, State Workflows & Analytics work out-of-the-box!');
    console.log('💡 [Database] Tip: Set MONGODB_URI in server/.env to MongoDB Atlas or start local mongod when ready.');
  }

  return isMongoConnected;
}
