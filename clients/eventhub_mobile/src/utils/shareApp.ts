import {Alert, Share} from 'react-native';
import {appInfo} from '../constants/appInfos';

export const ShareApp = async () => {
  try {
    const result = await Share.share({
      message: `Hey, check out this amazing app: ${appInfo.name}\n\nYou can download it from: ${appInfo.dowloadapp}`,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Error', 'An unknown error occurred');
    }
  }
};
