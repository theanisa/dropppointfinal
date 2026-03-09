import { io } from 'socket.io-client';

let socket;

export const getSocket = () => {
  if (!socket) {
    const url = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || 'http://localhost:5000';
    socket = io(url, {
      transports: ['websocket'],
      autoConnect: false,
    });
  }
  return socket;
};

export const connectSocket = () => {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
  }
  return s;
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
  }
};
