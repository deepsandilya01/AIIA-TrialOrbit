import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api/v1', '') : 'http://localhost:3000');

let socket = null;

export const connectSocket = (token) => {
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    console.log('Connected to real-time server:', socket.id);
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err.message);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
