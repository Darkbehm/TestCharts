/**
 * TestCharts App with Authentication
 *
 * @format
 */

import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Provider} from 'react-redux';
import {store} from './src/store/store';
import {LoginScreen} from './src/features/auth/screens/LoginScreen';
import {HomeScreen} from './src/screens/HomeScreen';
import {useAuth} from './src/features/auth/authActions';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const {isAuthenticated, isLoading, loadStoredAuth, token, user} = useAuth();

  console.log('token', token);
  console.log('user', user);

  useEffect(() => {
    // Load stored authentication on app start
    loadStoredAuth();
  }, [loadStoredAuth]);

  if (isLoading) {
    // You could replace this with a proper loading screen
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          orientation: 'portrait', // Lock to portrait mode
        }}
        initialRouteName={isAuthenticated ? 'Home' : 'Login'}>
        {isAuthenticated ? (
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              gestureEnabled: false, // Prevent swipe back to login
            }}
          />
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              gestureEnabled: false, // Prevent swipe gestures
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};

export default App;
