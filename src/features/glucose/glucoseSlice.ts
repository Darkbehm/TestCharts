import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {glucoseAPI} from './glucoseAPI';
import {GlucoseState, GlucoseRequest} from './types';
import {DEFAULT_TIMEZONE} from './constants';
import {RootState} from '../../store/store';

const initialState: GlucoseState = {
  data: [],
  spikes: [],
  isPickLow: [],
  score: [],
  loading: false,
  error: null,
  selectedDate: new Date().toISOString().split('T')[0],
  maxGlucose: 0,
  glucoseSource: '',
  timeRange: 24,
  timezone: DEFAULT_TIMEZONE,
};

// Async thunk for fetching glucose data
export const fetchGlucoseData = createAsyncThunk(
  'glucose/fetchGlucoseData',
  async (
    {date, token}: {date: string; token: string},
    {rejectWithValue, getState},
  ) => {
    try {
      console.log('🔄 fetchGlucoseData STARTED with:', {
        date,
        dateType: typeof date,
        token: token ? 'present' : 'missing',
      });

      // Get user ID from auth state
      const state = getState() as RootState;
      const userId = state.auth.user?.id;

      if (!userId) {
        throw new Error('User ID not found. Please login first.');
      }

      console.log('👤 Using userId from auth state:', userId);

      const request: GlucoseRequest = {date};
      const response = await glucoseAPI.getGlucoseData(request, token, userId);

      console.log('✅ fetchGlucoseData SUCCESS with response:', {
        data: response.data?.data?.length || 0,
        spikes: response.data?.spikes?.length || 0,
        isPickLow: response.data?.isPickLow?.length || 0,
        glucoseSource: response.data?.glucoseSourceChoosed,
      });

      return response;
    } catch (error) {
      console.log('❌ fetchGlucoseData ERROR:', error);
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  },
);

const glucoseSlice = createSlice({
  name: 'glucose',
  initialState,
  reducers: {
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    setGlucoseSource: (state, action: PayloadAction<string>) => {
      state.glucoseSource = action.payload;
    },
    setTimeRange: (state, action: PayloadAction<6 | 12 | 24 | 'custom'>) => {
      state.timeRange = action.payload;
    },
    clearError: state => {
      state.error = null;
    },
    resetGlucoseState: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(fetchGlucoseData.pending, state => {
        console.log('fetchGlucoseData.pending - setting loading to true');
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGlucoseData.fulfilled, (state, action) => {
        console.log('fetchGlucoseData.fulfilled with data:', action.payload);
        state.loading = false;
        state.error = null;
        const {data} = action.payload;
        state.data = data.data;
        state.spikes = data.spikes;
        state.isPickLow = data.isPickLow;
        state.score = data.score;
        state.maxGlucose = data.maxGlucose;
        state.glucoseSource = data.glucoseSourceChoosed;
        state.timezone = data.timezone || 'America/Caracas';
      })
      .addCase(fetchGlucoseData.rejected, (state, action) => {
        console.log('fetchGlucoseData.rejected with error:', action.error);
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedDate,
  setGlucoseSource,
  setTimeRange,
  clearError,
  resetGlucoseState,
} = glucoseSlice.actions;

export default glucoseSlice.reducer;
