/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import { handlerLinking } from './src/utils/handlerLinking';
import { appInfo } from './src/constants/appInfos';

messaging().setBackgroundMessageHandler(async mess => {
    handlerLinking(`${appInfo.domain}/detail/${mess.data.eventId}`);


});

messaging().onNotificationOpenedApp(mess => {

    handlerLinking(`${appInfo.domain}/detail/${mess.data.eventId}`);
});

AppRegistry.registerComponent(appName, () => App);
