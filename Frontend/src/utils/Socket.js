import { io } from "socket.io-client";

// src/socket.js
let socket = null;

export const connectSocket = (userId) => {

//   console.log("Connecting socket for userId:", userId);

  if ((!socket || socket.disconnected) && userId) {
    socket = io(`${import.meta.env.VITE_API_URL}`, {
      withCredentials: true,
      auth: { userId },
    });
  }
};

export const getSocket = () => socket;