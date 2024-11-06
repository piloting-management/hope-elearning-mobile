// src/features/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  displayName: string | null;
  email: string | null;
  emailVerified: boolean;
  token: string | null;
  uid: string | null;
  photoURL: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  displayName: null,
  email: null,
  emailVerified: false,
  token: null,
  uid: null,
  photoURL: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(
      state,
      action: PayloadAction<{
        displayName: string;
        email: string;
        emailVerified: boolean;
        token: string;
        uid: string;
        photoURL: string | null;
      }>,
    ) {
      state.displayName = action.payload.displayName;
      state.email = action.payload.email;
      state.emailVerified = action.payload.emailVerified;
      state.token = action.payload.token;
      state.uid = action.payload.uid;
      state.photoURL = action.payload.photoURL;
      state.isAuthenticated = true;
    },
    clearUser(state) {
      state.displayName = null;
      state.email = null;
      state.emailVerified = false;
      state.token = null;
      state.uid = null;
      state.photoURL = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
