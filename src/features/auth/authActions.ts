import {useDispatch, useSelector} from 'react-redux';
import {useCallback} from 'react';
import type {AppDispatch} from '../../store/store';
import {loginUser, logoutUser, clearError, loadStoredAuth} from './authSlice';
import {
  selectIsAuthenticated,
  selectAuthToken,
  selectAuthUser,
  selectAuthLoading,
  selectAuthError,
  selectAuthErrorTitle,
  selectAuthErrorMessage,
} from './authSelectors';
import {LoginCredentials} from './types';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const token = useSelector(selectAuthToken);
  const user = useSelector(selectAuthUser);
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const errorTitle = useSelector(selectAuthErrorTitle);
  const errorMessage = useSelector(selectAuthErrorMessage);

  const handleLogin = useCallback(
    (credentials: LoginCredentials) => {
      return dispatch(loginUser(credentials));
    },
    [dispatch],
  );

  const handleLogout = useCallback(() => {
    return dispatch(logoutUser());
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleLoadStoredAuth = useCallback(() => {
    return dispatch(loadStoredAuth());
  }, [dispatch]);

  return {
    // State
    isAuthenticated,
    token,
    user,
    isLoading,
    error,
    errorTitle,
    errorMessage,
    // Actions
    login: handleLogin,
    logout: handleLogout,
    clearError: handleClearError,
    loadStoredAuth: handleLoadStoredAuth,
  };
};
