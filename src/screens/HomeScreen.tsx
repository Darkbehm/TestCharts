import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {useAuth} from '../features/auth/authActions';

export const HomeScreen: React.FC = () => {
  const {user, logout} = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.content}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.title}>¡Bienvenido!</Text>
          <Text style={styles.subtitle}>Has iniciado sesión correctamente</Text>

          {user && (
            <View style={styles.userInfo}>
              <Text style={styles.userInfoTitle}>Información del usuario:</Text>
              <Text style={styles.userInfoText}>
                <Text style={styles.label}>Email: </Text>
                {user.email}
              </Text>
              <Text style={styles.userInfoText}>
                <Text style={styles.label}>Usuario: </Text>
                {user.user}
              </Text>
              <Text style={styles.userInfoText}>
                <Text style={styles.label}>ID: </Text>
                {user.id}
              </Text>
              <Text style={styles.userInfoText}>
                <Text style={styles.label}>Empresa: </Text>
                {user.company.name}
              </Text>
              <Text style={styles.userInfoText}>
                <Text style={styles.label}>Survey Iniciado: </Text>
                {user.surveyStart ? 'Sí' : 'No'}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          accessibilityLabel="Cerrar sesión"
          accessibilityHint="Toca para cerrar tu sesión actual"
          accessibilityRole="button">
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    justifyContent: 'space-between',
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 40,
  },
  userInfo: {
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    width: '100%',
    maxWidth: 300,
  },
  userInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    textAlign: 'center',
  },
  userInfoText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  label: {
    fontWeight: '600',
    color: '#374151',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
