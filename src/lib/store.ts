import themeReducer from '@/features/themeSlice';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/features/userSlice';
import contentReducer from '@/features/contentSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    user: userReducer,
    content: contentReducer,
  },
});

export type AppStore = typeof store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
