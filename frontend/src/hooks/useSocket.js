import { useEffect } from 'react';
import { getSocket } from '../services/socket';

export const useSocketEvent = (event, callback) => {
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on(event, callback);

    return () => {
      socket.off(event, callback);
    };
  }, [event, callback]);
};
