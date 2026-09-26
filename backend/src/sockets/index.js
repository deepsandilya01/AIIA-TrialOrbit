import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
    }
  });

  // Socket Authentication Middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    try {
      const decoded = jwt.verify(token, env.jwtSecret || process.env.JWT_SECRET);
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
