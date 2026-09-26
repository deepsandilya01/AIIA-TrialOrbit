import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import env from '../src/config/env.js';

export const connectTestDB = async () => {
  const uri = process.env.MONGODB_TEST_URI;
  if (!uri) {
    console.error("MONGODB_TEST_URI is not set. External test DB is required since MongoMemoryServer failed to install.");
    throw new Error("MONGODB_TEST_URI is required for tests.");
  }
  
  if (uri === process.env.MONGODB_URI || uri === process.env.MONGO_URI) {
    throw new Error("CRITICAL: MONGODB_TEST_URI must not be the production DB!");
  }
  
  env.mongoUri = uri;
  await mongoose.connect(uri);
};

export const closeTestDB = async () => {
  await mongoose.disconnect();
};

export const clearTestDB = async () => {
  if (mongoose.connection.readyState !== 1) return;
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};
