import {
  GLUCOSE_RANGES,
  GLUCOSE_COLORS,
  GLUCOSE_COLOR_NAMES,
  CHART_CONFIG,
} from './constants';
import {ChartDataPoint} from './types';

// Helper function to get color based on glucose value
export const getGlucoseColor = (value: number): string => {
  if (value < GLUCOSE_RANGES.LOW_THRESHOLD) return GLUCOSE_COLORS.LOW;
  if (value >= GLUCOSE_RANGES.NORMAL_MIN && value <= GLUCOSE_RANGES.NORMAL_MAX)
    return GLUCOSE_COLORS.NORMAL;
  return GLUCOSE_COLORS.HIGH;
};

// Helper function to get color name for display
export const getGlucoseColorName = (value: number): string => {
  if (value < GLUCOSE_RANGES.LOW_THRESHOLD) return GLUCOSE_COLOR_NAMES.LOW;
  if (value >= GLUCOSE_RANGES.NORMAL_MIN && value <= GLUCOSE_RANGES.NORMAL_MAX)
    return GLUCOSE_COLOR_NAMES.NORMAL;
  return GLUCOSE_COLOR_NAMES.HIGH;
};

// Helper function to get glucose status
export const getGlucoseStatus = (value: number): 'low' | 'normal' | 'high' => {
  if (value < GLUCOSE_RANGES.LOW_THRESHOLD) return 'low';
  if (value >= GLUCOSE_RANGES.NORMAL_MIN && value <= GLUCOSE_RANGES.NORMAL_MAX)
    return 'normal';
  return 'high';
};

// Helper function to check if value is in normal range
export const isGlucoseNormal = (value: number): boolean => {
  return (
    value >= GLUCOSE_RANGES.NORMAL_MIN && value <= GLUCOSE_RANGES.NORMAL_MAX
  );
};

// Helper function to check if value is low
export const isGlucoseLow = (value: number): boolean => {
  return value < GLUCOSE_RANGES.LOW_THRESHOLD;
};

// Helper function to check if value is high
export const isGlucoseHigh = (value: number): boolean => {
  return value >= GLUCOSE_RANGES.HIGH_THRESHOLD;
};

// Helper function to generate mock chart data
export const generateMockChartData = (count: number = 5): ChartDataPoint[] => {
  const mockValues = [80, 95, 120, 110, 85]; // Sample glucose values
  const baseDate = new Date('2025-01-09T08:00:00.000Z');

  return mockValues.slice(0, count).map((value, index) => {
    const date = new Date(baseDate);
    date.setHours(date.getHours() + index * 2); // 2-hour intervals

    return {
      value,
      date: date.toISOString(),
      dataPointText: value.toString(),
      originalValue: value,
      dataPointColor: getGlucoseColor(value),
      dataPointRadius: CHART_CONFIG.DEFAULT_POINT_RADIUS,
    };
  });
};
