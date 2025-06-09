# Error Testing Guide - TestCharts Auth

## 🧪 **Testing Error Scenarios**

### ✅ **Test Cases Implementados:**

#### 1. **Credenciales Incorrectas (401)**

**Input:**

```
Email: test@invalid.com
Password: wrongpassword
```

**Expected Response:**

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

**Expected UI Behavior:**

- ❌ **NO** borrar el formulario
- ✅ Mantener el email ingresado
- ✅ Limpiar solo la contraseña (opcional para seguridad)
- ✅ Mostrar título del error: "Credenciales inválidas" (en rojo, bold)
- ✅ Mostrar mensaje del error: "Usuario o contraseña incorrectos" (en rojo, normal)
- ✅ Mostrar hint: "Por favor, verifica tus credenciales e inténtalo de nuevo."

#### 2. **Credenciales Correctas**

**Input:**

```
Email: postulante@prueba.com
Password: Aa123456.
```

**Expected UI Behavior:**

- ✅ Login exitoso
- ✅ Navegación a HomeScreen
- ✅ Token guardado en AsyncStorage

#### 3. **Error de Conexión (Network)**

**Test:** Desconectar WiFi/datos

**Expected UI Behavior:**

- ❌ **NO** borrar el formulario
- ✅ Mantener todos los valores
- ✅ Mostrar título del error: "Error de Conexión" (en rojo, bold)
- ✅ Mostrar mensaje del error: "Error de conexión. Verifica tu conexión a internet." (en rojo, normal)

#### 4. **Otros Errores de API**

La API puede devolver diferentes códigos de error. El sistema debe:

- ✅ Extraer `error.title` y `error.message` de la respuesta
- ✅ Mostrar título y mensaje **por separado** tal como vienen de la API
- ✅ Título con estilo bold, mensaje con estilo normal
- ✅ Fallback a mensaje genérico si no hay estructura de error
- ✅ **NUNCA** resetear el formulario

---

## 🎯 **Comportamientos Clave Verificados:**

### ✅ **Preservación del Formulario:**

- El email siempre se mantiene
- Los valores NO se resetean en error
- Solo se limpia en login exitoso

### ✅ **Manejo de Errores Robusto:**

- Diferentes códigos HTTP manejados
- Estructura de error específica de la API
- Fallbacks para errores inesperados
- Logging detallado para debugging

### ✅ **UX Mejorada:**

- Mensajes específicos en lugar de genéricos
- Hints adicionales para el usuario
- Clear error cuando el usuario empieza a escribir
- Botones de copia para credenciales demo

---

## 🚀 **Testing Steps:**

1. **Test Error de Credenciales:**

   - Ingresar email válido + password incorrecto
   - Verificar que email se mantiene
   - Verificar mensaje específico

2. **Test Error de Conexión:**

   - Desconectar internet
   - Intentar login
   - Verificar que formulario se mantiene

3. **Test Login Exitoso:**

   - Usar credenciales correctas
   - Verificar navegación
   - Verificar persistencia

4. **Test Clear Error:**
   - Generar error
   - Empezar a escribir en cualquier campo
   - Verificar que error se limpia
