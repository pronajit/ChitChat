// notificationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    items: [], // { id, title, message, read: false }
  },
  reducers: {
    addNotification: (state, action) => {
      const newNotification = { ...action.payload, read: false };
      state.items.unshift(newNotification); // latest pehle dikhe
    },
    markAsRead: (state, action) => {
      const note = state.items.find((n) => n.id === action.payload);
      if (note) note.read = true;
    },
    removeNotification: (state, action) => {
      state.items = state.items.filter((note) => note.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.items = [];
    },
  },
});

export const { addNotification, markAsRead, removeNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
