import {Dimensions} from 'react-native';
export const appInfo = {
  sizes: {
    WIDTH: Dimensions.get('window').width,
    HEIGHT: Dimensions.get('window').height,
  },
  BASE_URL: 'http://192.168.0.101:3001',
  // BASE_URL: 'http://192.168.1.5:3001',
  // BASE_URL: 'http://localhost:3001',
  // BASE_URL: 'https://eventhub-server.onrender.com',

  domain: 'https://comfy-belekoy-415395.netlify.app',
  name: 'Event Hub',
  dowloadapp:
    'https://play.google.com/store/apps/details?id=net.crystalinteractive.ahapp&hl=en_US',
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
};
