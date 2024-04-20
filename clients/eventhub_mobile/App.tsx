import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import AppRouters from './src/navigators/AppRouters';
import store from './src/redux/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Host } from 'react-native-portalize';
import { HandlerNotification } from './src/utils/handlerNotification';
import Toast from 'react-native-toast-message';
import linking from './src/linking';

const App = () => {

  useEffect(() => {
    HandlerNotification.checkNotificationPersion();
  }, []);


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
