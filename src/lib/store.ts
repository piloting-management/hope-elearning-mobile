import themeReducer from '@/features/themeSlice';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/features/userSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    user: userReducer,
  },
});

export type AppStore = typeof store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
