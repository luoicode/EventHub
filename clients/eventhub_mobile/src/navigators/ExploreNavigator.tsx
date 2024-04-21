import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useStatusBar } from '../hooks/useStatusBar';
import { HomeScreen } from '../screens';

const ExploreNavigator = () => {
    const Stack = createNativeStackNavigator();
    useStatusBar('Light-content')
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            {/* <Stack.Screen name="EventDetail" component={EventDetail} /> */}

        </Stack.Navigator>
    );
};

export default ExploreNavigator;
