const config = {
  screens: {
    NotFound: '*',
    EventDetail: {
      path: 'detail/:id',
    },
    DrawerNavigator: {
      path: 'main',
      screens: {
        TabNavigator: {
          path: 'home',
          screens: {
            AddNewScreen: {path: 'add'},
          },
        },
      },
    },
  },
};

const linking: any = {
  prefixes: ['eventhub://app'],
  config,
};
export default linking;
