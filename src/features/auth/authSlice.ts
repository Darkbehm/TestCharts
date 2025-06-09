import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AuthState,
  LoginCredentials,
  AuthResponse,
  AuthError,
  AuthUser,
} from './types';
import {authAPI} from './authAPI';

const STORAGE_KEY = '@auth_token';
const USER_STORAGE_KEY = '@auth_user';

// Async thunks
export const loginUser = createAsyncThunk<
  {response: AuthResponse; user: AuthUser},
  LoginCredentials,
  {rejectValue: AuthError}
>('auth/login', async (credentials, {rejectWithValue}) => {
  try {
    const result = await authAPI.login(credentials);
    // Persist token
    await AsyncStorage.setItem(STORAGE_KEY, result.response.token);
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(result.user));
    return result;
  } catch (error) {
    return rejectWithValue(error as AuthError);
  }
});

export const loadStoredAuth = createAsyncThunk<
  {token: string | null; user: AuthUser | null},
  void,
  {rejectValue: string}
>('auth/loadStored', async (_, {rejectWithValue}) => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEY);
    const user = await AsyncStorage.getItem(USER_STORAGE_KEY);
    return {token, user: user ? JSON.parse(user) : null};
  } catch (error) {
    return rejectWithValue('Failed to load stored authentication');
  }
});

export const logoutUser = createAsyncThunk<void, void, {rejectValue: string}>(
  'auth/logout',
  async (_, {rejectWithValue}) => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      return rejectWithValue('Failed to clear stored authentication');
    }
  },
);

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    resetAuth: state => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.error = null;
      state.isLoading = false;
    },
  },
  extraReducers: builder => {
    builder
      // Login cases
      .addCase(loginUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.response.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        // Store the complete error object as it comes from the API
        state.error = action.payload || {
          message: 'Login failed',
        };
      })
      // Load stored auth cases
      .addCase(loadStoredAuth.pending, state => {
        state.isLoading = true;
      })
      .addCase(loadStoredAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.token = action.payload.token;
          state.user = action.payload.user;
          state.isAuthenticated = true;
          // Note: In a real app, you might want to validate the token here
        }
      })
      .addCase(loadStoredAuth.rejected, state => {
        state.isLoading = false;
        state.isAuthenticated = false;
      })
      // Logout cases
      .addCase(logoutUser.fulfilled, state => {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.error = null;
      });
  },
});

export const {clearError, resetAuth} = authSlice.actions;
export default authSlice.reducer;
