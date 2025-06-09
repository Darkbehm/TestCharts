# Changelog - TestCharts Auth App

## [v1.1.0] - Error Handling Improvements

### ✅ **Manejo de Errores de API Mejorado**

#### 🔧 **Cambios técnicos:**
1. **Nuevo tipo `APIErrorResponse`** - Maneja el formato específico de error de la API
2. **Lógica mejorada en `authAPI.ts`** - Extrae mensajes específicos del error de la API
3. **Mejor logging** - Información detallada de errores para debugging

#### 🎯 **Formato de Error Manejado:**
```json
{
  "code": 401,
  "message": "Unauthorized", 
  "success": false,
  "error": {
    "title": "Credenciales inválidas",
    "message": "Usuario o contraseña incorrectos"
  },
  "i18n": "unauthorized",
  "global": {}
}
```

#### 🎨 **Mejoras de UX:**
- **Mensajes específicos**: Muestra "Usuario o contraseña incorrectos" instead of generic message
- **Botones de copiar**: Para credenciales demo con feedback visual
- **Mejor diseño**: Credenciales organizadas en filas con botones de copia
- **Feedback inmediato**: Alerts cuando se copian credenciales

#### 🛠️ **Casos de Error Manejados:**
1. **401 Unauthorized** - Credenciales incorrectas → Mensaje específico de la API
2. **Network errors** - Sin conexión → "Error de conexión. Verifica tu conexión a internet."
3. **Unknown errors** - Otros errores → "Error inesperado. Inténtalo de nuevo."

#### 📱 **Flujo de Prueba:**
1. Ingresar credenciales incorrectas → Ver mensaje específico "Usuario o contraseña incorrectos"
2. Usar botones de copia → Ver alerts de confirmación
3. Probar sin conexión → Ver mensaje de error de red

---

## [v1.0.0] - Initial Release

### ✅ **Características Principales**
- Autenticación completa con API real
- Redux Toolkit para gestión de estado
- Persistencia de sesión con AsyncStorage
- Navegación condicional
- Validación de formularios en tiempo real
- Orientación portrait bloqueada
- TypeScript completo
- Arquitectura feature-based escalable 