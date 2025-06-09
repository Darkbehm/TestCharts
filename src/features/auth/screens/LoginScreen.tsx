import React from 'react';
import {View, StyleSheet, StatusBar, SafeAreaView} from 'react-native';
import {LoginForm} from '../components/LoginForm';

interface LoginScreenProps {
  onLoginSuccess?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({onLoginSuccess}) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />
      <View style={styles.content}>
        <LoginForm onLoginSuccess={onLoginSuccess} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
});
