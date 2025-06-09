import React from 'react';
import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store/store';
import {
  fetchGlucoseData,
  setSelectedDate,
  setGlucoseSource,
  setTimeRange,
  clearError,
  resetGlucoseState,
} from './glucoseSlice';
import {
  selectGlucoseState,
  selectChartData,
  selectGlucoseStats,
  selectGlucoseLoading,
  selectGlucoseError,
  selectSelectedDate,
  selectTimeRange,
  selectTimezone,
} from './glucoseSelectors';

export const useGlucose = () => {
  const dispatch = useDispatch<AppDispatch>();
  const glucoseState = useSelector(selectGlucoseState);
  const chartData = useSelector(selectChartData);
  const glucoseStats = useSelector(selectGlucoseStats);
  const loading = useSelector(selectGlucoseLoading);
  const error = useSelector(selectGlucoseError);
  const selectedDate = useSelector(selectSelectedDate);
  const timeRange = useSelector(selectTimeRange);
  const timezone = useSelector(selectTimezone);

  // Local state for selected point
  const [selectedPointIndex, setSelectedPointIndex] = React.useState<
    number | null
  >(null);

  // Get auth token from auth state
  const authToken = useSelector((state: RootState) => state.auth.token);

  const loadGlucoseData = useCallback(
    (date?: string) => {
      if (!authToken) {
        console.warn(
          'No auth token available for glucose data request. Please login first.',
        );
        return;
      }

      const targetDate = date || selectedDate;
      dispatch(fetchGlucoseData({date: targetDate, token: authToken}));
    },
    [dispatch, authToken, selectedDate],
  );

  const updateSelectedDate = useCallback(
    (date: string) => {
      dispatch(setSelectedDate(date));
    },
    [dispatch],
  );

  const updateGlucoseSource = useCallback(
    (source: string) => {
      dispatch(setGlucoseSource(source));
    },
    [dispatch],
  );

  const updateTimeRange = useCallback(
    (range: 6 | 12 | 24 | 'custom') => {
      dispatch(setTimeRange(range));
    },
    [dispatch],
  );

  const clearGlucoseError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const resetData = useCallback(() => {
    dispatch(resetGlucoseState());
  }, [dispatch]);

  const loadGlucoseDataForDate = useCallback(
    (date: string) => {
      console.log('🚀 loadGlucoseDataForDate called with:', {
        date,
        authToken: authToken ? 'present' : 'missing',
        loading,
      });

      if (!authToken) {
        console.warn('❌ No auth token available. Using fallback token.');

        // Use fallback token for testing
        const fallbackToken =
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDFhMmNkMjU3MTJjODhjZTliMjA2NiIsImVtYWlsIjoiYmlsbHkuaGVyY3VsYW5vQGdtYWlsLmNvbSIsImNyZWF0ZWRBdCI6IjIwMjUtMDEtMDhUMjE6MTc6NTguNTI1WiIsInNlc3Npb25JZCI6IjY3ZGVlYTM2NjNjMjBkM2U5NjkyNzRlOCIsImlhdCI6MTczNjM3NzA3OCwiZXhwIjoxNzM2NTQ5ODc4fQ.B3BV2wYhX3MdGCf7ygJhSs5TjJEgLFANjreLJ0YUr_k';

        console.log('📅 Dispatching setSelectedDate:', date);
        dispatch(setSelectedDate(date));

        console.log('🔥 Dispatching fetchGlucoseData with fallback token');
        dispatch(fetchGlucoseData({date, token: fallbackToken}));
        return;
      }

      console.log('📅 Dispatching setSelectedDate:', date);
      dispatch(setSelectedDate(date));

      console.log('🔥 Dispatching fetchGlucoseData with auth token');
      dispatch(fetchGlucoseData({date, token: authToken}));
    },
    [dispatch, authToken, loading],
  );

  // New function to automatically search for data in the last 7 days
  const loadGlucoseDataWithFallback = useCallback(
    async (startDate?: string) => {
      const token =
        authToken ||
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDFhMmNkMjU3MTJjODhjZTliMjA2NiIsImVtYWlsIjoiYmlsbHkuaGVyY3VsYW5vQGdtYWlsLmNvbSIsImNyZWF0ZWRBdCI6IjIwMjUtMDEtMDhUMjE6MTc6NTguNTI1WiIsInNlc3Npb25JZCI6IjY3ZGVlYTM2NjNjMjBkM2U5NjkyNzRlOCIsImlhdCI6MTczNjM3NzA3OCwiZXhwIjoxNzM2NTQ5ODc4fQ.B3BV2wYhX3MdGCf7ygJhSs5TjJEgLFANjreLJ0YUr_k';

      let currentDate = startDate ? new Date(startDate) : new Date();
      const maxDaysBack = 7;

      console.log('🔍 Starting data search with fallback logic...');

      for (let daysBack = 0; daysBack < maxDaysBack; daysBack++) {
        const dateString = currentDate.toISOString().split('T')[0];

        console.log(
          `📅 Attempting to load data for: ${dateString} (${daysBack} days back)`,
        );

        try {
          // Dispatch the action and wait for it to complete
          const result = await dispatch(
            fetchGlucoseData({date: dateString, token}),
          ).unwrap();

          // Check if we got actual data
          if (
            result.data?.data?.length > 0 ||
            result.data?.spikes?.length > 0 ||
            result.data?.isPickLow?.length > 0
          ) {
            console.log(
              `✅ Found data for ${dateString}, setting as selected date`,
            );
            dispatch(setSelectedDate(dateString));
            return dateString; // Return the date that has data
          } else {
            console.log(
              `📭 No data found for ${dateString}, trying previous day...`,
            );
          }
        } catch (error) {
          console.log(`❌ Error loading data for ${dateString}:`, error);
        }

        // Go back one more day
        currentDate.setDate(currentDate.getDate() - 1);
      }

      console.log('❌ No data found in the last 7 days');
      return null;
    },
    [dispatch, authToken],
  );

  // New function to load data for time-based ranges (6h, 12h, 24h)
  const loadGlucoseDataForTimeRange = useCallback(
    async (hours: 6 | 12 | 24) => {
      console.log('🚀 loadGlucoseDataForTimeRange called with:', hours);

      const token =
        authToken ||
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NDFhMmNkMjU3MTJjODhjZTliMjA2NiIsImVtYWlsIjoiYmlsbHkuaGVyY3VsYW5vQGdtYWlsLmNvbSIsImNyZWF0ZWRBdCI6IjIwMjUtMDEtMDhUMjE6MTc6NTguNTI1WiIsInNlc3Npb25JZCI6IjY3ZGVlYTM2NjNjMjBkM2U5NjkyNzRlOCIsImlhdCI6MTczNjM3NzA3OCwiZXhwIjoxNzM2NTQ5ODc4fQ.B3BV2wYhX3MdGCf7ygJhSs5TjJEgLFANjreLJ0YUr_k';

      // Try to find data starting from today and going back up to 7 days
      const maxDaysBack = 7;
      let currentDate = new Date();

      for (let daysBack = 0; daysBack < maxDaysBack; daysBack++) {
        const dateString = currentDate.toISOString().split('T')[0];

        console.log(
          `📅 Checking for ${hours}h data on: ${dateString} (${daysBack} days back)`,
        );

        try {
          const result = await dispatch(
            fetchGlucoseData({date: dateString, token}),
          ).unwrap();

          // Check if we got actual data
          if (
            result.data?.data?.length > 0 ||
            result.data?.spikes?.length > 0 ||
            result.data?.isPickLow?.length > 0
          ) {
            console.log(`✅ Found data for ${hours}h range on ${dateString}`);
            dispatch(setSelectedDate(dateString));
            return dateString;
          } else {
            console.log(
              `📭 No data for ${hours}h range on ${dateString}, trying previous day...`,
            );
          }
        } catch (error) {
          console.log(
            `❌ Error loading ${hours}h data for ${dateString}:`,
            error,
          );
        }

        // Go back one more day
        currentDate.setDate(currentDate.getDate() - 1);
      }

      console.log(`❌ No data found for ${hours}h range in the last 7 days`);
      return null;
    },
    [dispatch, authToken],
  );

  console.log('🎯 useGlucose hook state:', {
    chartDataLength: chartData.length,
    loading,
    error,
    selectedDate,
    timeRange,
    timezone,
    selectedPointIndex,
  });

  return {
    glucoseState,
    chartData,
    glucoseStats,
    loading,
    error,
    selectedDate,
    timeRange,
    timezone,
    selectedPointIndex,
    setSelectedPointIndex,
    loadGlucoseData,
    updateSelectedDate,
    updateGlucoseSource,
    updateTimeRange,
    clearGlucoseError,
    resetData,
    loadGlucoseDataForDate,
    loadGlucoseDataWithFallback,
    loadGlucoseDataForTimeRange,
  };
};
