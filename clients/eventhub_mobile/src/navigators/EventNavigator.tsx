import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useStatusBar } from '../hooks/useStatusBar';
import { EventsScreen } from '../screens';

const EventNavigator = () => {
    const Stack = createNativeStackNavigator();
    useStatusBar('dark-content')
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen name="EventsScreen" component={EventsScreen} />
        </Stack.Navigator>
    );
};

export default EventNavigator;
