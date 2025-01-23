import { createSlice } from "@reduxjs/toolkit";

type User = {
  uname: string;
  pwd: string;
  refreshToken?: string[];
  email?: string;
  profilePic?: string;
};

type initialStateType = {
  currentUser: User | null;
  error: string | null;
  loading: boolean;
};

const initialState: initialStateType = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { signInStart, signInSuccess, signInFailure } = userSlice.actions;

export default userSlice.reducer;
