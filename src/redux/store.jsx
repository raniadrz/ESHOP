import { configureStore } from '@reduxjs/toolkit';
import cartSlice from './cartSlice';

export const store = configureStore({
  reducer: {
    cart: cartSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['cart.time'],
      },
    }),
  devTools: true,
});
