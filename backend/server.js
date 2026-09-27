import app from './src/app.js';
import connectDB from './src/config/db.js';
import env from './src/config/env.js';

import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

import { initRedis } from './src/config/redis.js';

// Connect to MongoDB and Redis
await connectDB();
await initRedis();

const PORT = env.port;

import { initSocket } from './src/sockets/index.js';

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${env.nodeEnv} mode on port ${PORT}`);
});

// Initialize real-time updates layer
initSocket(server);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
