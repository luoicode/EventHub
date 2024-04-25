import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AddSquare, Calendar, Location, User } from 'iconsax-react-native';
import React, { ReactNode } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { CircleComponent, TextComponent } from '../components';
import { appColors } from '../constants/appColors';
import { AddNewScreen } from '../screens';
import EventNavigator from './EventNavigator';
import ExploreNavigator from './ExploreNavigator';
import MapNavigator from './MapNavigator';
import ProfileNavigator from './ProfileNavigator';

import { globalStyles } from '../styles/globalStyles';

const TabNavigator = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 68,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: appColors.primary5,
        },
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ focused, color, size }) => {
          let icon: ReactNode;
          color = focused ? appColors.primary6 : appColors.gray5;
          size = 32;
          switch (route.name) {
            case 'Explore':
              icon = <MaterialIcons name="explore" size={size} color={color} />;
              break;

            case 'Events':
              icon = <Calendar size={size} variant="Bold" color={color} />;
              break;
            case 'Map':
              icon = <Location size={size} variant="Bold" color={color} />;
              break;
            case 'Profile':
              icon = <User size={size} variant="Bold" color={color} />;
              break;
            case 'Add':
              icon = (
                <CircleComponent
                  size={70}
                  styles={[globalStyles.shadow, { marginTop: -60, backgroundColor: appColors.primary8 }]}>
                  <AddSquare size={46} color={appColors.primary7} variant="Bold" />
                </CircleComponent>
              );
              break;
          }
          return icon;
        },
        tabBarIconStyle: {
          marginTop: 8,
        },
        tabBarLabel({ focused }) {
          return route.name === 'Add' ? null : (
            <TextComponent
              text={route.name}
              flex={0}
              size={12}
              color={focused ? appColors.primary6 : appColors.gray5}
              styles={{
                marginBottom: 12,
              }}
            />
          );
        },
      })}>
      <Tab.Screen name="Explore" component={ExploreNavigator} />
      <Tab.Screen name="Events" component={EventNavigator} />
      <Tab.Screen name="Add" component={AddNewScreen} />
      <Tab.Screen name="Map" component={MapNavigator} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
