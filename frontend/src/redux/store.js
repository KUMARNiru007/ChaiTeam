import { configureStore } from '@reduxjs/toolkit';
import sidebarReducer from './sidebarSlice.js';

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
  },
});
