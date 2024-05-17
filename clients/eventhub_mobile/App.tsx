import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { LogBox, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import AppRouters from './src/navigators/AppRouters';
import store from './src/redux/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Host } from 'react-native-portalize';
import { HandlerNotification } from './src/utils/handlerNotification';
import Toast from 'react-native-toast-message';
import linking from './src/linking';
import Geocoder from 'react-native-geocoding';
import DeviceInfo from 'react-native-device-info'
import Orientation from 'react-native-orientation-locker';

Geocoder.init(process.env.MAP_API_KEY as string);

const deviceType = DeviceInfo.getDeviceType();


const App = () => {

  useEffect(() => {
    HandlerNotification.checkNotificationPersion();
  }, []);


  useEffect(() => {
    deviceType === 'Handset' && Orientation.lockToPortrait();
  }, [deviceType])
  LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
  LogBox.ignoreAllLogs();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent
        />
        <Host>
          <NavigationContainer linking={linking}>
            <AppRouters />
          </NavigationContainer>
        </Host>
      </Provider>
      <Toast />
    </GestureHandlerRootView>

  );
};

export default App;
