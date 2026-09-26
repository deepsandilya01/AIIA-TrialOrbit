import dotenv from 'dotenv';
dotenv.config();

export default { 
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aiia_trialorbit',
  jwtSecret: process.env.JWT_SECRET || 'super_secret_jwt_key_here',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development',
 };
