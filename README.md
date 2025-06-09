# TestCharts - Aplicación con Autenticación

Esta es una aplicación React Native con un sistema de autenticación completo implementado usando Redux Toolkit, siguiendo las mejores prácticas y el patrón Flux.

## 🚀 Características

- ✅ **Autenticación completa** con API real
- ✅ **Gestión de estado** con Redux Toolkit
- ✅ **Persistencia de sesión** con AsyncStorage
- ✅ **Navegación conditional** basada en estado de autenticación
- ✅ **Validación de formularios** en tiempo real
- ✅ **Manejo de errores** completo
- ✅ **Orientación portrait** bloqueada
- ✅ **TypeScript** para type safety
- ✅ **Arquitectura feature-based** escalable
- ✅ **Accesibilidad** implementada

## 📱 Credenciales de Prueba

```
Email: postulante@prueba.com
Password: Aa123456.
```

## 🏗️ Arquitectura

```
src/
├── features/
│   └── auth/
│       ├── components/
│       │   └── LoginForm.tsx
│       ├── screens/
│       │   └── LoginScreen.tsx
│       ├── authSlice.ts          # Redux slice
│       ├── authSelectors.ts      # Selectores Redux
│       ├── authActions.ts        # Custom hooks
│       ├── authAPI.ts           # Capa de API
│       ├── types.ts             # Tipos TypeScript
│       └── index.ts             # Barrel exports
├── screens/
│   └── HomeScreen.tsx
└── store/
    └── store.ts                 # Configuración Redux store
```

## 🛠️ Tecnologías Utilizadas

- **React Native CLI** (NO Expo)
- **Redux Toolkit** para gestión de estado
- **React Navigation** para navegación
- **AsyncStorage** para persistencia
- **Axios** para peticiones HTTP
- **TypeScript** para type safety

## 📋 Instalación y Configuración

### Prerequisitos

- Node.js >= 18
- React Native CLI
- Android Studio / Xcode configurado

### Pasos de instalación

1. **Clonar e instalar dependencias:**

```bash
cd TestCharts
npm install
```

2. **Instalar dependencias iOS (solo macOS):**

```bash
cd ios && pod install && cd ..
```

3. **Iniciar Metro Bundler:**

```bash
npm start
```

4. **Ejecutar en simulador:**

```bash
# Android
npm run android

# iOS (solo macOS)
npm run ios
```

## 🔐 Flujo de Autenticación

1. **Pantalla Login** - Primera pantalla por defecto
2. **Validación** - Validación en tiempo real de email y contraseña
3. **API Call** - Autenticación contra `https://qa-api.habitsapi.com/login`
4. **Persistencia** - Token guardado en AsyncStorage
5. **Navegación** - Redirect a HomeScreen usando `navigation.replace()`
6. **Logout** - Limpia token y vuelve a Login

## 🔧 API Integration

La aplicación se integra con la API real:

- **Endpoint:** `https://qa-api.habitsapi.com/login`
- **Método:** POST
- **Body:** `{"mail": "email", "pass": "password"}`
- **Respuesta:** Objeto completo con token, usuario y datos de empresa

## ⚙️ Configuración de Orientación

La aplicación está configurada para funcionar **solo en orientación portrait**:

- **iOS:** Configurado en `Info.plist`
- **Android:** Configurado en `AndroidManifest.xml`
- **React Navigation:** Orientación forzada en opciones

## 🎯 Características Técnicas

### Redux Toolkit Implementation

- `createSlice` para reducers y actions
- `createAsyncThunk` para operaciones asíncronas
- `createSelector` para selectores memoizados
- Custom hooks para abstraer lógica Redux

### Error Handling

- Manejo de errores de red
- Validación de formularios
- Mensajes de error específicos
- Estados de loading apropriados

### TypeScript Integration

- Tipos completos para API responses
- Interfaces para props y state
- Typed Redux hooks
- Type safety en toda la aplicación

## 🚦 Estados de la Aplicación

La aplicación maneja los siguientes estados principales:

```typescript
interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
}
```

## 📱 Navegación

```typescript
type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};
```

- **Login Screen:** Pantalla inicial cuando no hay sesión
- **Home Screen:** Pantalla principal después de autenticarse
- **Navigation Guard:** Previene navegación no autorizada

## 🔍 Testing

Para probar la aplicación:

1. Ejecuta la aplicación en simulador
2. Usa las credenciales de prueba
3. Verifica la navegación automática
4. Prueba el logout y vuelta a login
5. Cierra y reabre la app para verificar persistencia

## 🐛 Troubleshooting

### Problemas comunes:

1. **Metro bundler no inicia:**

```bash
npx react-native start --reset-cache
```

2. **Problemas con AsyncStorage:**

```bash
npx react-native unlink @react-native-async-storage/async-storage
npx react-native link @react-native-async-storage/async-storage
```

3. **Limpiar cache completo:**

```bash
npm run android -- --reset-cache
# o
npm run ios -- --reset-cache
```

## 📚 Estructura de Carpetas Detallada

```
TestCharts/
├── src/
│   ├── features/auth/          # Feature de autenticación
│   ├── screens/               # Pantallas generales
│   └── store/                 # Configuración Redux
├── android/                   # Configuración Android
├── ios/                      # Configuración iOS
└── package.json
```

## 🎨 UI/UX Features

- Diseño moderno y limpio
- Feedback visual para estados de loading
- Manejo de errores visual
- Accesibilidad completa
- KeyboardAvoidingView para mejor UX
- Animaciones suaves de transición

---

**Desarrollado siguiendo las mejores prácticas de React Native y Redux Toolkit** 🚀
