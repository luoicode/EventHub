import {NotFound} from './screens';

const config = {
  screens: {
    NotFound: '*',
  },
};

const linking: any = {
  prefixes: ['eventhub://app', 'https://abc.xyz'],
  config,
};
export default linking;
