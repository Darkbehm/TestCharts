import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {useGlucose} from '../glucoseActions';
import {TIME_RANGE_CONFIG} from '../constants';

export const DateSelector: React.FC = () => {
  const {
    selectedDate,
    timeRange,
    loadGlucoseDataForDate,
    loadGlucoseDataWithFallback,
    loadGlucoseDataForTimeRange,
    updateTimeRange,
    loading,
  } = useGlucose();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);

  // Load data for the current selected date when component mounts
  useEffect(() => {
    console.log('DateSelector useEffect called:', {
      hasInitialLoad,
      selectedDate,
      timeRange,
    });

    if (!hasInitialLoad) {
      if (timeRange === 'custom') {
        const today = new Date().toISOString().split('T')[0];
        console.log(
          'DateSelector: calling loadGlucoseDataWithFallback with:',
          today,
        );
        loadGlucoseDataWithFallback(today);
      } else {
        console.log(
          'DateSelector: calling loadGlucoseDataForTimeRange with:',
          timeRange,
        );
        loadGlucoseDataForTimeRange(timeRange as 6 | 12 | 24);
      }
      setHasInitialLoad(true);
    }
  }, [
    loadGlucoseDataForDate,
    loadGlucoseDataWithFallback,
    loadGlucoseDataForTimeRange,
    hasInitialLoad,
    selectedDate,
    timeRange,
  ]);

  const currentDate = new Date(selectedDate);

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (event.type === 'set' && date) {
      const dateString = date.toISOString().split('T')[0];
      loadGlucoseDataForDate(dateString);
    }
  };

  const handleShowDatePicker = () => {
    setShowDatePicker(true);
  };

  const formatDisplayDate = (dateString: string): string => {
    return dateString; // Already in YYYY-MM-DD format
  };

  const goToPreviousDay = () => {
    const currentDateObj = new Date(selectedDate);
    currentDateObj.setDate(currentDateObj.getDate() - 1);
    const newDateString = currentDateObj.toISOString().split('T')[0];
    loadGlucoseDataForDate(newDateString);
  };

  const goToNextDay = () => {
    const currentDateObj = new Date(selectedDate);
    const today = new Date();

    // Don't allow future dates
    if (currentDateObj.toDateString() === today.toDateString()) {
      return;
    }

    currentDateObj.setDate(currentDateObj.getDate() + 1);
    const newDateString = currentDateObj.toISOString().split('T')[0];
    loadGlucoseDataForDate(newDateString);
  };

  const isToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return selectedDate === today;
  };

  const handleTimeRangeChange = (range: 6 | 12 | 24 | 'custom') => {
    updateTimeRange(range);

    // Load appropriate data based on selection
    if (range === 'custom') {
      // For custom, load data with fallback for currently selected date
      loadGlucoseDataWithFallback(selectedDate);
    } else {
      // For time ranges, load data for current time range
      loadGlucoseDataForTimeRange(range);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Rango de Tiempo</Text>
        <Text style={styles.headerSubtitle}>
          Selecciona cómo ver los datos de glucosa
        </Text>
      </View>

      {/* Time Range Selector */}
      <View style={styles.timeRangeContainer}>
        <Text style={styles.timeRangeTitle}>Período</Text>
        <View style={styles.timeRangeButtons}>
          {Object.entries(TIME_RANGE_CONFIG).map(([range, config]) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.timeRangeButton,
                timeRange === range && styles.timeRangeButtonActive,
              ]}
              onPress={() =>
                handleTimeRangeChange(range as 6 | 12 | 24 | 'custom')
              }
              disabled={loading}
              accessibilityLabel={
                range === 'custom' ? 'Fecha específica' : `${range} horas`
              }
              accessibilityRole="button">
              <Text
                style={[
                  styles.timeRangeButtonText,
                  timeRange === range && styles.timeRangeButtonTextActive,
                ]}>
                {config.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Date Selector - Only show when 'custom' is selected */}
      {timeRange === 'custom' && (
        <>
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Seleccionar Fecha</Text>
            <Text style={styles.headerSubtitle}>
              Elige la fecha específica para ver los datos de glucosa
            </Text>
          </View>

          <View style={styles.dateContainer}>
            <TouchableOpacity
              style={styles.navigationButton}
              onPress={goToPreviousDay}
              disabled={loading}
              accessibilityLabel="Día anterior"
              accessibilityRole="button">
              <Text style={styles.navigationText}>‹</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateButton}
              onPress={handleShowDatePicker}
              disabled={loading}
              accessibilityLabel={`Fecha seleccionada: ${formatDisplayDate(
                selectedDate,
              )}`}
              accessibilityRole="button">
              <Text style={styles.dateText}>
                {formatDisplayDate(selectedDate)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.navigationButton,
                isToday() && styles.navigationButtonDisabled,
              ]}
              onPress={goToNextDay}
              disabled={loading || isToday()}
              accessibilityLabel="Día siguiente"
              accessibilityRole="button">
              <Text
                style={[
                  styles.navigationText,
                  isToday() && styles.navigationTextDisabled,
                ]}>
                ›
              </Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={currentDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              maximumDate={new Date()}
              minimumDate={new Date(2020, 0, 1)}
            />
          )}
        </>
      )}

      {loading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando datos...</Text>
        </View>
      )}
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
  headerContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  navigationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigationButtonDisabled: {
    backgroundColor: '#F9FAFB',
  },
  navigationText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#374151',
  },
  navigationTextDisabled: {
    color: '#D1D5DB',
  },
  dateButton: {
    flex: 1,
    marginHorizontal: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dateSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  loadingContainer: {
    marginTop: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  timeRangeContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  timeRangeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  timeRangeButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeRangeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  timeRangeButtonActive: {
    backgroundColor: '#3B82F6',
  },
  timeRangeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  timeRangeButtonTextActive: {
    color: '#FFFFFF',
  },
});
