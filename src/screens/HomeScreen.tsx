import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import {useAuth} from '../features/auth/authActions';
import {DateSelector, GlucoseChart} from '../features/glucose';

export const HomeScreen: React.FC = () => {
  console.log('🏠 HomeScreen component rendered');
  const {user, logout} = useAuth();
  console.log('👤 User state:', user ? 'logged in' : 'not logged in');

  const handleLogout = () => {
    logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.title}>¡Bienvenido!</Text>
            <Text style={styles.subtitle}>Monitoreo de Glucosa</Text>

            {/* Date Selector */}
            <DateSelector />

            {/* Glucose Chart */}
            <GlucoseChart />

            {user && (
              <View style={styles.userInfo}>
                <Text style={styles.userInfoTitle}>
                  Información del usuario:
                </Text>
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  welcomeContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  userInfo: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
