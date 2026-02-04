import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  otherUsers: [],
  selectedUser: null,
  selectedprofile: null,
  searchValue: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setOtherUsers: (state, action) => {
      state.otherUsers = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setSelectedprofile: (state, action) => {
      state.selectedprofile = action.payload;
    },
    setSearchValue: (state, action) => {
      state.searchValue = action.payload;
    }
  },
});

export const { setUser, setOtherUsers, setSelectedUser, setSelectedprofile, setSearchValue } = authSlice.actions;

export default authSlice.reducer;
