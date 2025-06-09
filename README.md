# TestCharts - Aplicación React Native con Autenticación y Gráficos de Glucosa

Esta aplicación demuestra una implementación completa de React Native siguiendo las mejores prácticas de arquitectura escalable, gestión de estado con Redux Toolkit, y integración de APIs reales.

## 🎯 Decisiones de Arquitectura y Razonamiento

### 1. **Arquitectura Feature-Based**

**Decisión**: Organización del código por características/features en lugar de por tipo de archivo.

```
src/
├── features/
│   ├── auth/           # Todo lo relacionado con autenticación
│   └── glucose/        # Todo lo relacionado con gráficos de glucosa
├── screens/           # Pantallas compartidas
└── store/            # Configuración Redux global
```

**Razonamiento**:

- **escalabilidad**: Fácil agregar nuevas características sin reestructurar
- **Mantenibilidad**: Lógica relacionada agrupada en un solo lugar
- **Reutilización**: Componentes y lógica encapsulados por dominio
- **Team scalability**: Diferentes desarrolladores pueden trabajar en features independientes

### 2. **Gestión de Autenticación**

**Decisión**: Persistencia con AsyncStorage + navegación condicional.

**Razonamiento**:

- **UX Seamless**: Usuario no necesita re-loguearse en cada apertura
- **Security**: Token almacenado localmente pero con expiración
- **Performance**: Carga inicial rápida con verificación de token existente
- **Navegación inteligente**: `navigation.replace()` para evitar stack de login

#### Flujo implementado:

1. App inicia → Verifica token en AsyncStorage
2. Token válido → Navega directamente a Home
3. Token inválido/ausente → Muestra pantalla de Login
4. Login exitoso → Guarda token y navega con `replace()`

### 3. **Manejo de Errores Robusto**

**Decisión**: Sistema de manejo de errores específico para la API utilizada.

**Razonamiento**:

- **UX Superior**: Mensajes específicos en lugar de errores genéricos
- **Preservación de datos**: No se resetea el formulario en errores
- **Feedback inmediato**: Clear de errores al comenzar a escribir
- **Logging detallado**: Para debugging efectivo en desarrollo

#### Estructura de error manejada:

```json
{
  "error": {
    "title": "Credenciales inválidas",
    "message": "Usuario o contraseña incorrectos"
  }
}
```

### 4. **Feature de Gráficos de Glucosa**

**Decisión**: react-native-gifted-charts para visualización de datos.

**Razonamiento**:

- **Performance nativa**: Renderizado optimizado para móviles
- **Customización**: Control total sobre apariencia y comportamiento
- **Interactividad**: Selección de fechas y navegación temporal
- **Datos estadísticos**: Cálculo automático de min/max/promedio
- **Detección inteligente**: Identificación de picos y bajas de glucosa

#### Características implementadas:

- Selector de fecha nativo (iOS/Android)
- Navegación temporal (anterior/siguiente día)
- Gráfico interactivo con área de relleno
- Estadísticas en tiempo real
- Estados de loading y error

#### Flujo de Datos de Glucosa:

**1. Descarga de Datos (API):**

```typescript
// Endpoint: POST /api/glucose/getByUserAndDateRange?userId={dynamic_user_id}
{
  data: [],          // Lecturas normales de glucosa
  spikes: [],        // Picos altos (>140mg/dL)
  isPickLow: [],     // Valores bajos (<70mg/dL)
  score: [],         // Métricas adicionales
  maxGlucose: number
}
```

**2. Procesamiento Inteligente:**

- **Combinación**: Fusiona los 3 tipos de datos en uno solo
- **Filtrado Temporal**: 6h/12h/24h desde AHORA, o fecha específica
- **Downsampling Inteligente**: Reduce a 20 puntos preservando picos médicos importantes
- **Colorización**: Rojo (<70), Cyan (71-140), Amarillo (>140)

**3. Optimizaciones de Performance:**

- Selectores memoizados para evitar re-cálculos
- Límite de 100 puntos iniciales + reducción a 20 finales
- Procesamiento lazy solo cuando cambian datos
- Preservación automática de spikes y valores bajos críticos

**4. Algoritmo de Downsampling:**

- Calcula promedio y desviación estándar
- Identifica puntos críticos (>1.5 desviaciones estándar)
- Preserva automáticamente todos los `spikes` y `isPickLow`
- Muestrea uniformemente el resto de datos
- Garantiza información médicamente relevante

### 5. **Configuración de Orientación**

**Decisión**: Aplicación bloqueada en orientación portrait únicamente.

**Razonamiento**:

- **UX Consistente**: Diseño optimizado para uso vertical
- **Simplicidad**: Menos casos de prueba y complejidad de layout
- **Mejor para formularios**: Especialmente login y entry de datos
- **Configuración nativa**: Aplicado tanto en iOS como Android

### 6. **Integración de API Real**

**Decisión**: Integración con API de producción desde el desarrollo inicial.

**Razonamiento**:

- **Realismo**: Comportamiento idéntico al ambiente de producción
- **Error handling real**: Manejo de casos edge reales de la API
- **Performance testing**: Identificación temprana de issues de latencia
- **Security**: Implementación correcta de headers y autenticación

#### API Endpoints utilizados:

- `POST /login` - Autenticación
- `POST /api/glucose/getByUserAndDateRange` - Datos de glucosa

### 7. **Estructura de Dependencias**

**Decisión**: Dependencias mínimas pero bien seleccionadas.

#### Core Dependencies:

- `@reduxjs/toolkit` - Estado global
- `@react-navigation/native-stack` - Navegación
- `@react-native-async-storage/async-storage` - Persistencia
- `axios` - HTTP client
- `react-native-gifted-charts` - Visualización de datos

**Razonamiento**:

- **Bundle size**: Mantener el APK/IPA lo más pequeño posible
- **Mantenimiento**: Menos dependencias = menos vulnerabilidades
- **Performance**: Cada librería seleccionada por su eficiencia específica

## 📱 Credenciales de Prueba

```
Email: postulante@prueba.com
Password: Aa123456.
```

## 📦 APK de Instalación Directa

### Descarga la aplicación compilada

El APK de la aplicación está disponible en el repositorio para instalación directa en dispositivos Android:

- **Archivo**: [`releases/TestCharts-v1.0.0.apk`](./releases/TestCharts-v1.0.0.apk)
- **Tamaño**: ~102MB
- **Versión**: 1.0.0
- **Tipo**: Release (optimizado para producción)

### Instalación en Android

#### Método 1: Instalación directa
1. Descarga el archivo `TestCharts-v1.0.0.apk` desde el repositorio
2. En tu dispositivo Android, ve a **Configuración > Seguridad**
3. Habilita **Fuentes desconocidas** o **Instalar aplicaciones desconocidas**
4. Abre el archivo APK descargado y sigue las instrucciones de instalación

#### Método 2: Usando ADB (para desarrolladores)
```bash
# Conecta tu dispositivo Android y habilita la depuración USB
adb install releases/TestCharts-v1.0.0.apk
```

### Características de la aplicación
- ✅ Autenticación de usuario
- ✅ Gráficos interactivos de glucosa
- ✅ Selector de fechas nativo
- ✅ Estadísticas en tiempo real
- ✅ Interfaz optimizada para móvil

## 🚀 Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# iOS (solo macOS)
cd ios && pod install && cd ..

# Ejecutar
npm run android  # o npm run ios
```

## 🔄 Flujo de Desarrollo

El proyecto sigue un flujo de desarrollo estructurado:

1. **Feature development** en carpetas independientes
2. **Testing** de integración con APIs reales
3. **Error handling** específico por caso de uso
4. **Performance optimization** mediante selectors y memoización
5. **Type safety** con TypeScript estricto

## 🏗️ Escalabilidad Futura

La arquitectura permite:

- **Nuevas features** sin modificar código existente
- **Team scaling** con ownership claro por feature
- **Performance** con lazy loading y code splitting
- **Testing** con separación clara de responsabilidades
- **Maintenance** con bajo acoplamiento entre componentes

---

**Desarrollado siguiendo React Native CLI, Redux Toolkit, y principios de Clean Architecture** 🚀
