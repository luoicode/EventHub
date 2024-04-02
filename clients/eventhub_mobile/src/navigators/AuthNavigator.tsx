import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  ForgottenPassword,
  OnboardingScreen,
  SignInScreen,
  SignUpScreen,
  Verification,
} from '../screens';
import AsyncStorage from '@react-native-async-storage/async-storage';
const AuthNavigator = () => {
  const Stack = createNativeStackNavigator();

  // const [isExistingUser, setIsExistingUser] = useState(false);

  // useEffect(() => {
  //   checkUserExisting();
  // }, []);

  // const checkUserExisting = async () => {
  //   const res = await AsyncStorage.getItem('auth');
  //   res && setIsExistingUser(true);
  // };

  // console.log(isExistingUser);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
      <Stack.Screen name="SignInScreen" component={SignInScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="Verification" component={Verification} />
      <Stack.Screen name="ForgottenPassword" component={ForgottenPassword} />
    </Stack.Navigator>
  );
};
export default AuthNavigator;
