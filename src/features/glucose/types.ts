export interface GlucoseDataPoint {
  source: string;
  date: string;
  dateUnix: number;
  value: number;
  historic: boolean;
  isSpike: boolean;
  averaged: boolean;
  isPickLow: boolean;
}

export interface ScoreDataPoint {
  source: string;
  date: string;
  unixDate: number;
  value: number;
}

export interface GlucoseResponse {
  code: number;
  message: string;
  success: boolean;
  data: {
    spikes: GlucoseDataPoint[];
    isPickLow: GlucoseDataPoint[];
    data: GlucoseDataPoint[];
    glucoseSources: string[];
    glucoseSourceChoosed: string;
    score: ScoreDataPoint[];
    events: any[];
    timezone: string;
    maxGlucose: number;
  };
  i18n: string;
  global: {
    es: string;
  };
}

export interface GlucoseRequest {
  date: string;
}

export interface GlucoseState {
  data: GlucoseDataPoint[];
  spikes: GlucoseDataPoint[];
  isPickLow: GlucoseDataPoint[];
  score: ScoreDataPoint[];
  loading: boolean;
  error: string | null;
  selectedDate: string;
  maxGlucose: number;
  glucoseSource: string;
  timeRange: 6 | 12 | 24 | 'custom';
  timezone: string;
}

export interface ChartDataPoint {
  value: number;
  date?: string;
  labelComponent?: () => React.ReactElement;
  dataPointText?: string;
  dataPointColor?: string;
  dataPointRadius?: number;
  showStrip?: boolean;
  stripHeight?: number;
  stripColor?: string;
  originalValue?: number;
}
