import { createSlice } from "@reduxjs/toolkit";

const groupSlice = createSlice({
    name: "group",
    initialState: {
        myGroups: [],
        selectedGroup: null,
        groupMessages: [],
    },
    reducers: {
        setMyGroups: (state, action) => {
            state.myGroups = action.payload;
        },
        setSelectedGroup: (state, action) => {
            state.selectedGroup = action.payload;
        },
        setGroupMessages: (state, action) => {
            state.groupMessages = action.payload;
        },
        addGroupMessage: (state, action) => {
            state.groupMessages = [action.payload, ...state.groupMessages];
        },
    },
});

export const { setMyGroups, setSelectedGroup, setGroupMessages, addGroupMessage } = groupSlice.actions;

export default groupSlice.reducer;