import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Clipboard,
  Alert,
} from 'react-native';
import {useAuth} from '../authActions';
import {LoginCredentials} from '../types';

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({onLoginSuccess}) => {
  const {login, isLoading, error, errorTitle, errorMessage, clearError} =
    useAuth();

  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });

  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const [showPassword, setShowPassword] = useState(false);

  const validateForm = useCallback((): boolean => {
    const errors: {email?: string; password?: string} = {};

    // Email validation
    if (!credentials.email.trim()) {
      errors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      errors.email = 'Por favor ingresa un correo electrónico válido';
    }

    // Password validation
    if (!credentials.password.trim()) {
      errors.password = 'La contraseña es obligatoria';
    } else if (credentials.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [credentials]);

  const handleInputChange = useCallback(
    (field: keyof LoginCredentials, value: string) => {
      setCredentials(prev => ({...prev, [field]: value}));

      // Clear validation error for this field
      if (validationErrors[field]) {
        setValidationErrors(prev => ({...prev, [field]: undefined}));
      }

      // Clear global error when user starts typing
      if (error) {
        clearError();
      }
    },
    [validationErrors, error, clearError],
  );

  const handleLogin = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const result = await login(credentials);
      console.log('Login result:', result);

      if (result.meta.requestStatus === 'fulfilled') {
        // Only clear the form on successful login
        onLoginSuccess?.();
      }
      // If login fails, the error will be shown via Redux state
      // and the form values will be preserved
    } catch (err) {
      console.error('Unexpected login error:', err);
      // Don't reset the form, let the user try again with the same values
    }
  }, [credentials, validateForm, login, onLoginSuccess]);

  const handleTogglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Iniciar Sesión</Text>
        <Text style={styles.subtitle}>
          Ingresa tus credenciales para continuar
        </Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Correo Electrónico</Text>
          <TextInput
            style={[styles.input, validationErrors.email && styles.inputError]}
            placeholder=""
            value={credentials.email}
            onChangeText={value => handleInputChange('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            accessibilityLabel="Campo de correo electrónico"
            accessibilityHint="Ingresa tu dirección de correo electrónico"
            editable={!isLoading}
          />
          {validationErrors.email && (
            <Text style={styles.errorText}>{validationErrors.email}</Text>
          )}
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[
                styles.passwordInput,
                validationErrors.password && styles.inputError,
              ]}
              placeholder=""
              value={credentials.password}
              onChangeText={value => handleInputChange('password', value)}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password"
              textContentType="password"
              accessibilityLabel="Campo de contraseña"
              accessibilityHint="Ingresa tu contraseña"
              editable={!isLoading}
            />
            <TouchableOpacity
              style={styles.passwordToggle}
              onPress={handleTogglePasswordVisibility}
              accessibilityLabel={
                showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
              }
              accessibilityRole="button">
              <Text style={styles.passwordToggleText}>
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </Text>
            </TouchableOpacity>
          </View>
          {validationErrors.password && (
            <Text style={styles.errorText}>{validationErrors.password}</Text>
          )}
        </View>

        {/* Global Error Message */}
        {error && (
          <View style={styles.globalErrorContainer}>
            {errorTitle && <Text style={styles.errorTitle}>{errorTitle}</Text>}
            {errorMessage && (
              <Text style={styles.globalErrorText}>{errorMessage}</Text>
            )}
          </View>
        )}

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
          accessibilityLabel="Botón de iniciar sesión"
          accessibilityHint="Toca para iniciar sesión con las credenciales ingresadas"
          accessibilityRole="button">
          <Text
            style={[
              styles.loginButtonText,
              isLoading && styles.loginButtonTextDisabled,
            ]}>
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Text>
        </TouchableOpacity>

        {/* Demo Credentials Helper */}
        <View style={styles.demoContainer}>
          <Text style={styles.demoTitle}>Credenciales de prueba:</Text>

          <View style={styles.credentialRow}>
            <Text style={styles.demoText}>Email: postulante@prueba.com</Text>
            <TouchableOpacity
              onPress={() => {
                Clipboard.setString('postulante@prueba.com');
                Alert.alert('Copiado', 'Email copiado al portapapeles');
              }}
              style={styles.copyButton}
              accessibilityLabel="Copiar email"
              accessibilityHint="Toca para copiar el email de prueba"
              accessibilityRole="button">
              <Text style={styles.copyButtonText}>📋</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.credentialRow}>
            <Text style={styles.demoText}>Password: Aa123456.</Text>
            <TouchableOpacity
              onPress={() => {
                Clipboard.setString('Aa123456.');
                Alert.alert('Copiado', 'Contraseña copiada al portapapeles');
              }}
              style={styles.copyButton}
              accessibilityLabel="Copiar contraseña"
              accessibilityHint="Toca para copiar la contraseña de prueba"
              accessibilityRole="button">
              <Text style={styles.copyButtonText}>📋</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  passwordToggle: {
    position: 'absolute',
    right: 12,
    padding: 4,
  },
  passwordToggleText: {
    fontSize: 18,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 4,
  },
  globalErrorContainer: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  errorTitle: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  globalErrorText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  errorHint: {
    color: '#6B7280',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  loginButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loginButtonTextDisabled: {
    color: '#D1D5DB',
  },
  demoContainer: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  demoText: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  copyButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginLeft: 8,
  },
  copyButtonText: {
    fontSize: 16,
  },
  credentialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
});
