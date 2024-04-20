/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import { handlerLinking } from './src/utils/handlerLinking';

messaging().setBackgroundMessageHandler(async mess => {
    handlerLinking(`eventhub://app/nguyenhuy123456`)


});

messaging().onNotificationOpenedApp(mess => {
    handlerLinking(`eventhub://app/nguyenhuy123456`)
});

AppRegistry.registerComponent(appName, () => App);
