import {Linking} from 'react-native';

export const handlerLinking = (url: string) => {
  Linking.openURL(url);
};
