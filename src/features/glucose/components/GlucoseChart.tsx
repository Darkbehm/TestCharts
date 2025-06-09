import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {LineChart} from 'react-native-gifted-charts';
import {useGlucose} from '../glucoseActions';
import {
  getGlucoseColorName,
  getGlucoseColor,
} from '../utils';
import {
  CHART_CONFIG,
  GLUCOSE_RANGES,
  GLUCOSE_COLORS,
  GLUCOSE_COLOR_NAMES,
  TIME_RANGE_CONFIG,
  CHART_SECTIONS,
} from '../constants';

const {width: screenWidth} = Dimensions.get('window');

// Move the pointer label component outside render
const PointerLabel: React.FC<{
  items: any;
  timezone: string;
  onPointPress: (item: any, index: number) => void;
}> = ({items, timezone, onPointPress}) => {
  const item = items[0];
  if (item && item.originalValue) {
    onPointPress(item, item.index);
    return (
      <View style={styles.pointerLabel}>
        <Text style={styles.pointerLabelText}>{item.originalValue} mg/dL</Text>
        <Text style={styles.pointerLabelTime}>
          {new Date(item.date).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: timezone,
          })}
        </Text>
      </View>
    );
  }
  return null;
};

export const GlucoseChart: React.FC = () => {
  const {
    chartData,
    glucoseStats,
    loading,
    error,
    timeRange,
    timezone,
    selectedPointIndex,
    setSelectedPointIndex,
  } = useGlucose();

  console.log('🎯 GlucoseChart component rendered');

  console.log('📊 GlucoseChart state:', {
    chartDataLength: chartData.length,
    loading,
    error,
    hasStats: !!glucoseStats,
    timeRange,
    timezone,
    selectedPointIndex,
  });

  // Debug logging
  console.log('GlucoseChart Debug:', {
    loading,
    error,
    chartDataLength: chartData.length,
    glucoseStats,
  });

  // Use real data only - no more mock data
  const displayData = chartData;
  const displayStats = glucoseStats;

  // Handle point press for interaction
  const handlePointPress = React.useCallback(
    (pointData: any, index: number) => {
      console.log('Point pressed:', {pointData, index});
      setSelectedPointIndex(index);
    },
    [setSelectedPointIndex],
  );

  // Memoize the pointer label component
  const pointerLabelComponent = React.useCallback(
    (items: any) => (
      <PointerLabel
        items={items}
        timezone={timezone}
        onPointPress={handlePointPress}
      />
    ),
    [timezone, handlePointPress],
  );

  // Enhanced data processing to include connecting points for smooth transitions
  const createSmoothedColorSegments = (data: any[]) => {
    if (data.length === 0) return [];

    const allSegments = [] as any[];

    // Process each point and determine its color based on glucose value
    data.forEach((point, index) => {
      const value = point.originalValue || point.value;
      const glucoseColor = getGlucoseColor(value);

      allSegments.push({
        ...point,
        segmentColor: glucoseColor,
        dataPointRadius:
          selectedPointIndex === index
            ? CHART_CONFIG.SELECTED_POINT_RADIUS
            : CHART_CONFIG.DEFAULT_POINT_RADIUS,
        showStrip: selectedPointIndex === index,
        stripHeight:
          selectedPointIndex === index ? CHART_CONFIG.STRIP_HEIGHT : 0,
        stripColor: selectedPointIndex === index ? glucoseColor : 'transparent',
        dataPointColor: glucoseColor,
      });
    });

    return allSegments;
  };

  const processedSegmentData = createSmoothedColorSegments(displayData);

  // Determine line and background colors based on average glucose value
  const getColorsBasedOnAverage = (average: number) => {
    if (average < GLUCOSE_RANGES.LOW_THRESHOLD) {
      return {
        lineColor: GLUCOSE_COLORS.LOW,
        startFillColor: 'rgba(239, 68, 68, 0.2)', // Red with transparency
        endFillColor: 'rgba(239, 68, 68, 0.05)',
        colorName: GLUCOSE_COLOR_NAMES.LOW,
        trendSymbol: '↓',
      };
    } else if (
      average >= GLUCOSE_RANGES.NORMAL_MIN &&
      average <= GLUCOSE_RANGES.NORMAL_MAX
    ) {
      return {
        lineColor: GLUCOSE_COLORS.NORMAL,
        startFillColor: 'rgba(6, 182, 212, 0.2)', // Cyan with transparency
        endFillColor: 'rgba(6, 182, 212, 0.05)',
        colorName: GLUCOSE_COLOR_NAMES.NORMAL,
        trendSymbol: '~',
      };
    } else {
      return {
        lineColor: GLUCOSE_COLORS.HIGH,
        startFillColor: 'rgba(245, 158, 11, 0.2)', // Yellow with transparency
        endFillColor: 'rgba(245, 158, 11, 0.05)',
        colorName: GLUCOSE_COLOR_NAMES.HIGH,
        trendSymbol: '↑',
      };
    }
  };

  const averageColors = getColorsBasedOnAverage(displayStats.average);

  // Generate 24 fixed time sections based on timeRange
  const generateFixedTimeLabels = (
    timeRange: 6 | 12 | 24 | 'custom',
    timezone: string = 'America/Caracas',
  ) => {
    const labels: string[] = [];
    const now = new Date();

    if (timeRange === 'custom') {
      // For custom date, generate hourly labels for the full day
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);

      for (let i = 0; i < CHART_SECTIONS; i++) {
        const timePoint = new Date(startOfDay);
        timePoint.setHours(i);

        const timeLabel = timePoint.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: timezone,
        });

        labels.push(timeLabel);
      }

      return labels;
    }

    // Calculate interval based on timeRange using TIME_RANGE_CONFIG
    const config = TIME_RANGE_CONFIG[timeRange as 6 | 12 | 24];
    const intervalMinutes =
      config && 'intervalMinutes' in config ? config.intervalMinutes : 60;

    // Generate 24 labels going backwards from now
    for (let i = CHART_SECTIONS - 1; i >= 0; i--) {
      const timePoint = new Date(now);
      timePoint.setMinutes(timePoint.getMinutes() - i * intervalMinutes);

      const timeLabel = timePoint.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: timezone,
      });

      labels.push(timeLabel);
    }

    return labels;
  };

  const fixedTimeLabels = generateFixedTimeLabels(timeRange, timezone);

  // Calculate optimal spacing for scrollable chart
  const minSpacing = CHART_CONFIG.MIN_SPACING;
  const chartWidth = screenWidth - 40;
  const totalChartWidth = Math.max(
    chartWidth,
    CHART_SECTIONS * minSpacing + 100,
  ); // Always fit 24 sections

  if (loading && chartData.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando datos de glucosa...</Text>
          <Text style={styles.loadingText}>
            Debug: loading = {String(loading)}
          </Text>
          <Text style={styles.loadingText}>Error: {error || 'none'}</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Error al cargar datos</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  if (displayData.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Sin datos disponibles</Text>
          <Text style={styles.emptyText}>
            No hay datos de glucosa disponibles para la fecha seleccionada.
            {'\n'}Por favor, verifica tu dispositivo de monitoreo de glucosa.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.chartTitle}>Niveles de Glucosa</Text>
          <View style={styles.trendIndicator}>
            <Text
              style={[styles.trendSymbol, {color: averageColors.lineColor}]}>
              {averageColors.trendSymbol}
            </Text>
          </View>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, {color: averageColors.lineColor}]}>
              {displayStats.average}
            </Text>
            <Text style={styles.statLabel}>
              Promedio ({averageColors.colorName})
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{displayStats.min}</Text>
            <Text style={styles.statLabel}>Mínimo</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{displayStats.max}</Text>
            <Text style={styles.statLabel}>Máximo</Text>
          </View>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}>
          <LineChart
            data={processedSegmentData}
            width={totalChartWidth}
            height={CHART_CONFIG.HEIGHT}
            spacing={minSpacing}
            initialSpacing={20}
            endSpacing={20}
            thickness={3}
            color={averageColors.lineColor}
            dataPointsColor={GLUCOSE_COLORS.NORMAL} // Will be overridden by individual point colors
            dataPointsRadius={4}
            startFillColor={averageColors.startFillColor}
            endFillColor={averageColors.endFillColor}
            startOpacity={0.8}
            endOpacity={0.1}
            areaChart
            curved
            animateOnDataChange
            animationDuration={1000}
            onDataChangeAnimationDuration={300}
            maxValue={CHART_CONFIG.MAX_VALUE}
            noOfSections={CHART_CONFIG.NO_OF_SECTIONS}
            stepValue={CHART_CONFIG.STEP_VALUE}
            yAxisOffset={0}
            mostNegativeValue={0}
            adjustToWidth={false}
            yAxisColor="#E5E7EB"
            xAxisColor="#E5E7EB"
            yAxisThickness={1}
            xAxisThickness={1}
            rulesColor="#F3F4F6"
            rulesType="solid"
            yAxisTextStyle={styles.axisText}
            xAxisLabelTextStyle={styles.axisText}
            showValuesAsDataPointsText
            textShiftY={-8}
            textShiftX={-5}
            textFontSize={10}
            textColor="#6B7280"
            hideYAxisText={false}
            yAxisLabelWidth={35}
            formatYLabel={value => `${Math.round(Number(value))}`}
            showXAxisIndices
            xAxisIndicesHeight={20}
            xAxisIndicesWidth={1}
            xAxisIndicesColor="#E5E7EB"
            showVerticalLines
            verticalLinesColor="#F3F4F6"
            verticalLinesThickness={1}
            hideDataPoints={false}
            dataPointsHeight={6}
            dataPointsWidth={6}
            dataPointsRadius1={3}
            xAxisLabelTexts={fixedTimeLabels}
            rotateLabel
            labelsExtraHeight={30}
            pointerConfig={{
              pointerStripHeight: 160,
              pointerStripColor: '#E5E7EB',
              pointerStripWidth: 2,
              showPointerStrip: true,
              pointerColor: '#3B82F6',
              radius: 6,
              pointerLabelWidth: 100,
              pointerLabelHeight: 90,
              pointerLabelComponent,
            }}
          />
        </ScrollView>
      </View>

      {/* Selected Point Info */}
      {selectedPointIndex !== null && displayData[selectedPointIndex] && (
        <View style={styles.selectedPointContainer}>
          <Text style={styles.selectedPointTitle}>Punto Seleccionado</Text>
          <View style={styles.selectedPointInfo}>
            <Text style={styles.selectedPointText}>
              🩸 Glucosa:{' '}
              {displayData[selectedPointIndex].originalValue ||
                displayData[selectedPointIndex].dataPointText}{' '}
              mg/dL
            </Text>
            <Text style={styles.selectedPointText}>
              ⏰ Hora:{' '}
              {displayData[selectedPointIndex]?.date
                ? new Date(
                    displayData[selectedPointIndex].date,
                  ).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                    timeZone: timezone,
                  })
                : 'N/A'}
            </Text>
            <View style={styles.selectedPointColorIndicator}>
              <View
                style={[
                  styles.colorDot,
                  {
                    backgroundColor:
                      displayData[selectedPointIndex].dataPointColor,
                  },
                ]}
              />
              <Text style={styles.selectedPointText}>
                Estado:{' '}
                {getGlucoseColorName(
                  displayData[selectedPointIndex].originalValue ||
                    parseInt(
                      displayData[selectedPointIndex].dataPointText || '0',
                      10,
                    ),
                )}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.clearSelectionButton}
            onPress={() => setSelectedPointIndex(null)}>
            <Text style={styles.clearSelectionText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendColor,
              {backgroundColor: averageColors.lineColor},
            ]}
          />
          <Text style={styles.legendText}>
            Línea de tendencia (color dinámico)
          </Text>
        </View>

        {/* Glucose Range Legend */}
        <View style={styles.rangeLegendContainer}>
          <Text style={styles.rangeLegendTitle}>Rangos de Glucosa</Text>
          <View style={styles.rangeLegendItems}>
            <View style={styles.rangeLegendItem}>
              <View
                style={[
                  styles.legendColor,
                  {backgroundColor: GLUCOSE_COLORS.LOW},
                ]}
              />
              <Text style={styles.legendText}>
                {GLUCOSE_COLOR_NAMES.LOW} (&lt; {GLUCOSE_RANGES.LOW_THRESHOLD}{' '}
                mg/dL)
              </Text>
            </View>
            <View style={styles.rangeLegendItem}>
              <View
                style={[
                  styles.legendColor,
                  {backgroundColor: GLUCOSE_COLORS.NORMAL},
                ]}
              />
              <Text style={styles.legendText}>
                {GLUCOSE_COLOR_NAMES.NORMAL} ({GLUCOSE_RANGES.NORMAL_MIN}-
                {GLUCOSE_RANGES.NORMAL_MAX} mg/dL)
              </Text>
            </View>
            <View style={styles.rangeLegendItem}>
              <View
                style={[
                  styles.legendColor,
                  {backgroundColor: GLUCOSE_COLORS.HIGH},
                ]}
              />
              <Text style={styles.legendText}>
                {GLUCOSE_COLOR_NAMES.HIGH} (&gt; {GLUCOSE_RANGES.NORMAL_MAX}{' '}
                mg/dL)
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.alertsContainer}>
          {displayStats.spikeCount > 0 && (
            <View style={styles.alertItem}>
              <Text style={[styles.alertText, {color: GLUCOSE_COLORS.HIGH}]}>
                ↑ {displayStats.spikeCount} picos detectados
              </Text>
            </View>
          )}
          {displayStats.lowCount > 0 && (
            <View style={styles.alertItem}>
              <Text style={[styles.alertText, {color: GLUCOSE_COLORS.LOW}]}>
                ↓ {displayStats.lowCount} niveles bajos
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  errorContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#EF4444',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  emptyContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  headerContainer: {
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  trendSymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B82F6',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  scrollContent: {
    alignItems: 'center',
  },
  scrollView: {
    // Add any necessary styles for the scroll view
  },
  axisText: {
    fontSize: 10,
    color: '#6B7280',
  },
  legendContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#374151',
  },
  rangeLegendContainer: {
    marginBottom: 16,
  },
  rangeLegendTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  rangeLegendItems: {
    // Remove flexDirection: 'row' to make it vertical (default)
  },
  rangeLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  alertsContainer: {
    marginTop: 8,
  },
  alertItem: {
    marginVertical: 2,
  },
  alertText: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '500',
  },
  selectedPointContainer: {
    marginTop: 16,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  selectedPointTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  selectedPointInfo: {
    marginBottom: 12,
  },
  selectedPointText: {
    fontSize: 14,
    color: '#6B7280',
  },
  selectedPointColorIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  clearSelectionButton: {
    backgroundColor: '#3B82F6',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  clearSelectionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  pointerLabel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointerLabelText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '700',
  },
  pointerLabelTime: {
    fontSize: 12,
    color: '#6B7280',
  },
});
