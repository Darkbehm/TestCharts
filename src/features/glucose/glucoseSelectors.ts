import {createSelector} from '@reduxjs/toolkit';
import {RootState} from '../../store/store';
import {ChartDataPoint} from './types';
import {getGlucoseColor, getGlucoseColorName} from './utils';
import {SAMPLE_DATA_LIMIT, DOWNSAMPLING_TARGET} from './constants';

// Basic selectors
export const selectGlucoseState = (state: RootState) => state.glucose;

export const selectGlucoseData = (state: RootState) => state.glucose.data;

export const selectGlucoseSpikes = (state: RootState) => state.glucose.spikes;

export const selectGlucosePickLows = (state: RootState) =>
  state.glucose.isPickLow;

export const selectGlucoseScore = (state: RootState) => state.glucose.score;

export const selectGlucoseLoading = (state: RootState) => {
  console.log('selectGlucoseLoading called, loading:', state.glucose.loading);
  return state.glucose.loading;
};

export const selectGlucoseError = (state: RootState) => {
  console.log('selectGlucoseError called, error:', state.glucose.error);
  return state.glucose.error;
};

export const selectSelectedDate = (state: RootState) =>
  state.glucose.selectedDate;

export const selectTimeRange = (state: RootState) => state.glucose.timeRange;

export const selectTimezone = (state: RootState) => state.glucose.timezone;

export const selectMaxGlucose = (state: RootState) => state.glucose.maxGlucose;

export const selectGlucoseSource = (state: RootState) =>
  state.glucose.glucoseSource;

// Helper function to downsample data while preserving important peaks
const downsampleData = (
  data: any[],
  targetCount: number = DOWNSAMPLING_TARGET,
): any[] => {
  if (data.length <= targetCount) {
    return data;
  }

  // Calculate average and standard deviation to identify significant peaks
  const values = data.map(point => point.value);
  const average = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance =
    values.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) /
    values.length;
  const stdDev = Math.sqrt(variance);

  // Identify important points (peaks and valleys)
  const importantPoints: any[] = [];
  const threshold = stdDev * 1.5; // Points that deviate more than 1.5 standard deviations

  data.forEach((point, index) => {
    const deviation = Math.abs(point.value - average);
    if (deviation > threshold || point.isSpike || point.isPickLow) {
      importantPoints.push({...point, index, isImportant: true});
    }
  });

  // Create uniform sampling excluding important points
  const samplingInterval = Math.floor(
    data.length / (targetCount - importantPoints.length),
  );
  const uniformPoints: any[] = [];

  for (let i = 0; i < data.length; i += samplingInterval) {
    const point = data[i];
    // Only add if it's not already in important points
    const isAlreadyImportant = importantPoints.some(imp => imp.index === i);
    if (
      !isAlreadyImportant &&
      uniformPoints.length < targetCount - importantPoints.length
    ) {
      uniformPoints.push({...point, index: i, isImportant: false});
    }
  }

  // Combine important points and uniform sampling
  const combinedPoints = [...importantPoints, ...uniformPoints];

  // Sort by original index and return
  return combinedPoints.sort((a, b) => a.index - b.index).slice(0, targetCount);
};

// Computed selectors
export const selectChartData = createSelector(
  [
    selectGlucoseData,
    selectGlucoseSpikes,
    selectGlucosePickLows,
    selectTimeRange,
    selectTimezone,
  ],
  (data, spikes, pickLows, timeRange, timezone) => {
    console.log('selectChartData called with:', {
      dataLength: data.length,
      spikesLength: spikes.length,
      pickLowsLength: pickLows.length,
      timeRange,
      timezone,
    });

    // Combine all data points and sort by date
    const allData = [...data, ...spikes, ...pickLows];
    console.log('🔄 Combined allData length:', allData.length);

    // Use SAMPLE_DATA_LIMIT to avoid performance issues
    console.log(
      `⏳ Using simplified data processing (first ${SAMPLE_DATA_LIMIT} items)...`,
    );
    const uniqueData = allData.slice(0, SAMPLE_DATA_LIMIT);
    console.log(
      '✅ Simplified processing completed, uniqueData length:',
      uniqueData.length,
    );

    // Sort by date
    console.log('⏳ Starting date sort...');
    uniqueData.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    console.log('✅ Date sort completed');

    // Filter data based on timeRange
    if (uniqueData.length > 0) {
      let filteredData: typeof uniqueData;

      if (timeRange === 'custom') {
        // For custom date, show all data from that specific date
        console.log('📅 Using custom date mode - showing all data');
        filteredData = uniqueData;
      } else {
        // For time ranges (6h, 12h, 24h), filter from NOW backwards
        const now = new Date();
        const hoursInMs = (timeRange as number) * 60 * 60 * 1000;
        const cutoffTime = now.getTime() - hoursInMs;

        console.log('🕐 Time filtering from NOW backwards:', {
          now: now.toISOString(),
          timeRangeHours: timeRange,
          cutoffTime: new Date(cutoffTime).toISOString(),
          sampleDataPoint: uniqueData[0]
            ? {
                date: uniqueData[0].date,
                dateUnix: uniqueData[0].dateUnix,
                dateUnixConverted: uniqueData[0].dateUnix
                  ? new Date(uniqueData[0].dateUnix * 1000).toISOString()
                  : 'N/A',
              }
            : 'No data',
        });

        filteredData = uniqueData.filter(point => {
          // Use dateUnix if available, otherwise parse date string
          const pointTime = point.dateUnix
            ? point.dateUnix * 1000
            : new Date(point.date).getTime();
          const isWithinRange = pointTime >= cutoffTime;

          if (!isWithinRange && uniqueData.indexOf(point) < 3) {
            console.log('❌ Point filtered out:', {
              date: point.date,
              dateUnix: point.dateUnix,
              pointTime: new Date(pointTime).toISOString(),
              cutoffTime: new Date(cutoffTime).toISOString(),
              withinRange: isWithinRange,
            });
          }

          return isWithinRange;
        });
      }

      console.log(`Filtered data result: ${filteredData.length} points`);

      // Apply downsampling to reduce data points while preserving important peaks
      console.log('⏳ Starting downsampling...');
      const downsampledData = downsampleData(filteredData, 20);
      console.log('✅ Downsampling completed');

      console.log('downsampledData', downsampledData);

      // Convert to chart format with time data and colors
      return downsampledData.map((point, index): ChartDataPoint => {
        const originalValue = point.value;
        const color = getGlucoseColor(originalValue);
        const colorName = getGlucoseColorName(originalValue);

        console.log(`Point ${index}: ${originalValue}mg/dL = ${colorName}`);

        return {
          value: point.value, // Use original glucose value directly
          date: point.date,
          dataPointText: point.value.toString(), // Keep original value for display
          originalValue: originalValue, // Store for interactions
          dataPointColor: color,
          dataPointRadius: 5,
          showStrip: false, // We'll use this for selected point
          stripHeight: 0,
          stripColor: color,
        };
      });
    }

    // Fallback for empty data
    return [];
  },
);

export const selectGlucoseStats = createSelector(
  [selectGlucoseData, selectGlucoseSpikes, selectGlucosePickLows],
  (data, spikes, pickLows) => {
    const allValues = [...data, ...spikes, ...pickLows].map(
      point => point.value,
    );

    if (allValues.length === 0) {
      return {
        min: 0,
        max: 0,
        average: 0,
        spikeCount: 0,
        lowCount: 0,
      };
    }

    return {
      min: Math.min(...allValues),
      max: Math.max(...allValues),
      average: Math.round(
        allValues.reduce((sum, val) => sum + val, 0) / allValues.length,
      ),
      spikeCount: spikes.length,
      lowCount: pickLows.length,
    };
  },
);
