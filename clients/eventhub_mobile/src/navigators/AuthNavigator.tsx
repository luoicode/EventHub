import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {
  //   ForgottenPassword,
  OnboardingScreen,
  SignInScreen,
} from '../screens';
// import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
      <Stack.Screen name="SignInScreen" component={SignInScreen} />
    </Stack.Navigator>
  );
};
export default AuthNavigator;
