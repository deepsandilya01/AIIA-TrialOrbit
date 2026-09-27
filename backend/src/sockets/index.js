import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import { getRedisClient } from '../config/redis.js';
import userRepository from '../repositories/user.repository.js';
import { assertSiteAccess } from '../middleware/scope.middleware.js';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        const normalizedOrigin = origin.replace(/\/$/, '');
        const normalizedClientUrl = env.clientUrl ? env.clientUrl.replace(/\/$/, '') : '';
        if (normalizedOrigin === normalizedClientUrl || origin.startsWith('http://localhost:')) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      },
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

    // Allow clients to subscribe to specific studies with strict IDOR verification
    socket.on('join-study', async (studyId, callback) => {
      if (!studyId) {
        if (typeof callback === 'function') callback({ success: false, error: 'Study ID required' });
        return;
      }

      try {
        const hasAccess = await assertSiteAccess(socket.user, null, studyId);
        if (hasAccess) {
          socket.join(`study:${studyId}`);
          if (typeof callback === 'function') callback({ success: true });
        } else {
          if (typeof callback === 'function') callback({ success: false, error: 'Unauthorized study access' });
          socket.emit('error', 'Unauthorized study access');
        }
      } catch (err) {
        if (typeof callback === 'function') callback({ success: false, error: 'Internal error validating access' });
        socket.emit('error', 'Internal error validating access');
      }
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
