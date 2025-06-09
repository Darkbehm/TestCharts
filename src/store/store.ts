import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import glucoseReducer from '../features/glucose/glucoseSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    glucose: glucoseReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
