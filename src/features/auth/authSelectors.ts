import {createSelector} from '@reduxjs/toolkit';
import {RootState} from '../../store/store';

const selectAuthState = (state: RootState) => state.auth;

export const selectIsAuthenticated = createSelector(
  [selectAuthState],
  auth => auth.isAuthenticated,
);

export const selectAuthToken = createSelector(
  [selectAuthState],
  auth => auth.token,
);

export const selectAuthUser = createSelector(
  [selectAuthState],
  auth => auth.user,
);

export const selectAuthLoading = createSelector(
  [selectAuthState],
  auth => auth.isLoading,
);

export const selectAuthError = createSelector(
  [selectAuthState],
  auth => auth.error,
);

export const selectAuthErrorTitle = createSelector(
  [selectAuthState],
  auth => auth.error?.title,
);

export const selectAuthErrorMessage = createSelector(
  [selectAuthState],
  auth => auth.error?.message,
);

export const selectIsAuthLoading = createSelector(
  [selectAuthState],
  auth => auth.isLoading,
);
