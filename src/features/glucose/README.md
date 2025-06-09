# Glucose Feature Configuration

Este documento describe las constantes configurables del módulo de glucosa para facilitar el mantenimiento y personalización.

## Archivos de Configuración

### `constants.ts`

Contiene todas las constantes configurables del sistema de glucosa.

### `utils.ts`

Funciones utilitarias que usan las constantes para procesar datos de glucosa.

## Constantes Disponibles

### Rangos de Glucosa (`GLUCOSE_RANGES`)

```typescript
GLUCOSE_RANGES = {
  LOW_THRESHOLD: 70, // Umbral para glucosa baja
  NORMAL_MIN: 71, // Mínimo para rango normal
  NORMAL_MAX: 140, // Máximo para rango normal
  HIGH_THRESHOLD: 141, // Umbral para glucosa alta
};
```

### Colores (`GLUCOSE_COLORS`)

```typescript
GLUCOSE_COLORS = {
  LOW: '#EF4444', // Rojo para glucosa baja
  NORMAL: '#06B6D4', // Cian para glucosa normal
  HIGH: '#F59E0B', // Amarillo para glucosa alta
  TREND_LINE: '#3B82F6', // Azul para línea de tendencia
};
```

### Nombres de Colores (`GLUCOSE_COLOR_NAMES`)

```typescript
GLUCOSE_COLOR_NAMES = {
  LOW: 'Bajo', // Etiqueta para rango bajo
  NORMAL: 'Normal', // Etiqueta para rango normal
  HIGH: 'Alto', // Etiqueta para rango alto
};
```

### Configuración del Gráfico (`CHART_CONFIG`)

```typescript
CHART_CONFIG = {
  MAX_VALUE: 200, // Valor máximo del eje Y
  MIN_VALUE: 0, // Valor mínimo del eje Y
  NO_OF_SECTIONS: 5, // Número de secciones del eje Y
  STEP_VALUE: 30, // Valor del paso entre secciones
  HEIGHT: 250, // Altura del gráfico en píxeles
  DEFAULT_POINT_RADIUS: 5, // Radio por defecto de los puntos
  SELECTED_POINT_RADIUS: 8, // Radio del punto seleccionado
  MIN_SPACING: 60, // Espaciado mínimo entre puntos
  STRIP_HEIGHT: 200, // Altura de la línea indicadora
};
```

### Configuración de Rangos de Tiempo (`TIME_RANGE_CONFIG`)

```typescript
TIME_RANGE_CONFIG = {
  6: {intervalMinutes: 15, label: '6h'}, // 6 horas, intervalos de 15 min
  12: {intervalMinutes: 30, label: '12h'}, // 12 horas, intervalos de 30 min
  24: {intervalMinutes: 60, label: '24h'}, // 24 horas, intervalos de 60 min
  custom: {label: 'Otro'}, // Fecha personalizada
};
```

### Otras Constantes

```typescript
CHART_SECTIONS = 24; // Secciones fijas del eje X (tiempo)
DEFAULT_TIMEZONE = 'America/Caracas'; // Zona horaria por defecto
SAMPLE_DATA_LIMIT = 100; // Límite de datos de muestra
DOWNSAMPLING_TARGET = 20; // Objetivo de reducción de datos
```

## Funciones Utilitarias

### `getGlucoseColor(value: number): string`

Retorna el color correspondiente basado en el valor de glucosa.

### `getGlucoseColorName(value: number): string`

Retorna el nombre del rango de glucosa para mostrar al usuario.

### `getGlucoseStatus(value: number): 'low' | 'normal' | 'high'`

Retorna el estado de la glucosa como string.

### `generateMockChartData(count: number): ChartDataPoint[]`

Genera datos de prueba usando las constantes configuradas.

## Personalización

Para personalizar el comportamiento del sistema de glucosa:

1. **Cambiar rangos de glucosa**: Modificar `GLUCOSE_RANGES` en `constants.ts`
2. **Cambiar colores**: Modificar `GLUCOSE_COLORS` en `constants.ts`
3. **Ajustar gráfico**: Modificar `CHART_CONFIG` en `constants.ts`
4. **Cambiar intervalos de tiempo**: Modificar `TIME_RANGE_CONFIG` en `constants.ts`

Todos los componentes y funciones se actualizarán automáticamente al cambiar estas constantes.

## Ejemplos de Uso

```typescript
// Verificar si un valor está en rango normal
import {isGlucoseNormal} from './utils';
const isNormal = isGlucoseNormal(120); // true

// Obtener color para un valor
import {getGlucoseColor} from './utils';
const color = getGlucoseColor(65); // '#EF4444' (rojo)

// Generar datos de prueba
import {generateMockChartData} from './utils';
const mockData = generateMockChartData(5); // 5 puntos de datos
```
