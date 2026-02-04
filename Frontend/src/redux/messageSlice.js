import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  messages: [],
};

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages = [action.payload , ...state.messages];
    },
    removeMessage: (state, action) => {
      state.messages = state.messages.filter(
        (message) => message.id !== action.payload.id
      );
    },
  },
});

export const { setMessages, addMessage, removeMessage } = messageSlice.actions;

export default messageSlice.reducer;
