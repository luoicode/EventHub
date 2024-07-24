import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { AddCategoryScreen, AddNewScreen, CalendarScreen, ChatBot, ContactScreen, EventDetail, EventsScreen, ExploreEvents, FavouriteScreen, HelpAndFAQsScreen, MyTicket, NearbyScreen, NotFound, NotificationScreen, PaymentScreen, Privacy, ProfileScreen, SearchEvents } from '../screens';
import DrawerNavigator from './DrawerNavigator';

const MainNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={DrawerNavigator} />
      <Stack.Screen name="EventDetail" component={EventDetail} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="NotFound" component={NotFound} />
      <Stack.Screen name="ExploreEvents" component={ExploreEvents} />
      <Stack.Screen name="SearchEvents" component={SearchEvents} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
      <Stack.Screen name="NearbyScreen" component={NearbyScreen} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="HelpAndFAQsScreen" component={HelpAndFAQsScreen} />
      <Stack.Screen name="ContactScreen" component={ContactScreen} />
      <Stack.Screen name="Privacy" component={Privacy} />
      <Stack.Screen name="Calendar" component={CalendarScreen} />
      <Stack.Screen name="AddNewScreen" component={AddNewScreen} />
      <Stack.Screen name="ChatBot" component={ChatBot} />
      <Stack.Screen name="EventsScreen" component={EventsScreen} />
      <Stack.Screen name="FavouriteScreen" component={FavouriteScreen} />
      <Stack.Screen name="MyTicket" component={MyTicket} />
      {/* <Stack.Screen name="AddCategoryScreen" component={AddCategoryScreen} /> */}



    </Stack.Navigator>

  );
};

export default MainNavigator;
