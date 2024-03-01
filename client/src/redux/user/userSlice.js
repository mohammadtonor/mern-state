import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInfailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        updateUserStart: (state) => {
            state.loading = true;
        },
        updateUserSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateUserfailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        deleteUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        deleteUserStart: (state) => {
            state.loading = true;
        },
        deleteUserfailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        }
    },
});

export const { 
    signInStart,
    signInSuccess, 
    signInfailure,
    updateUserStart,
    updateUserSuccess,
    updateUserfailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserfailure
} = userSlice.actions;

export default userSlice.reducer;