// Glucose range thresholds
export const GLUCOSE_RANGES = {
  LOW_THRESHOLD: 70,
  NORMAL_MIN: 71,
  NORMAL_MAX: 140,
  HIGH_THRESHOLD: 141,
} as const;

// Colors for glucose ranges
export const GLUCOSE_COLORS = {
  LOW: '#EF4444', // Red for low glucose
  NORMAL: '#06B6D4', // Cyan for normal glucose
  HIGH: '#F59E0B', // Yellow for high glucose
  TREND_LINE: '#3B82F6', // Blue for trend line
} as const;

// Color names for display
export const GLUCOSE_COLOR_NAMES = {
  LOW: 'Bajo',
  NORMAL: 'Normal',
  HIGH: 'Alto',
} as const;

// Chart configuration
export const CHART_CONFIG = {
  MAX_VALUE: 200,
  MIN_VALUE: 0,
  NO_OF_SECTIONS: 5,
  STEP_VALUE: 30,
  HEIGHT: 250,
  DEFAULT_POINT_RADIUS: 5,
  SELECTED_POINT_RADIUS: 8,
  MIN_SPACING: 60,
  STRIP_HEIGHT: 200,
} as const;

// Time range configurations
export const TIME_RANGE_CONFIG = {
  6: {intervalMinutes: 15, label: '6h'},
  12: {intervalMinutes: 30, label: '12h'},
  24: {intervalMinutes: 60, label: '24h'},
  custom: {label: 'Otro'},
} as const;

// Chart sections and intervals
export const CHART_SECTIONS = 24; // Always 24 sections for time axis

// Default timezone
export const DEFAULT_TIMEZONE = 'America/Caracas';

// Sample data configuration
export const SAMPLE_DATA_LIMIT = 100;
export const DOWNSAMPLING_TARGET = 20;
