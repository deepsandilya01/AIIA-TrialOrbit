import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import { getRedisClient } from '../config/redis.js';
import userRepository from '../repositories/user.repository.js';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: env.clientUrl || 'http://localhost:5173',
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
      credentials: true
    }
  });

  // Socket Authentication Middleware
  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    try {
      const decoded = jwt.verify(token, env.jwtSecret || process.env.JWT_SECRET);
      
      if (decoded.jti) {
        const redis = getRedisClient();
        if (redis) {
          const isBlacklisted = await redis.get(`auth:blacklist:${decoded.jti}`);
          if (isBlacklisted) return next(new Error('Authentication error: Token revoked'));
        }
      }

      const user = await userRepository.findById(decoded.id);
      if (!user || !user.isActive) {
        return next(new Error('Authentication error: User inactive'));
      }

      socket.user = decoded; // Contains id, role, studyId, etc.
      next();
    } catch (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id} (User: ${socket.user.id}, Role: ${socket.user.role})`);

    // Assign to roles and generic dashboard room
    socket.join(`role:${socket.user.role}`);
    socket.join('dashboard');

    // If user has specific assigned study, join that study room
    if (socket.user.studyId) {
      socket.join(`study:${socket.user.studyId}`);
    }

    // Allow clients (especially ADMIN/MONITOR) to subscribe to specific studies
    socket.on('join-study', (studyId) => {
      // In a real app we might verify if they have access to this study
      socket.join(`study:${studyId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

// Expose a structured emitter function for services to use
export const emitEvent = (room, eventName, payload) => {
  if (io) {
    io.to(room).emit(eventName, payload);
  }
};
