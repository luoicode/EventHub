import { View, Text } from 'react-native'
import React from 'react'
import { Key } from 'iconsax-react-native';
import { appColors } from '../constants/appColors';

const DrawerSetting = () => {
    const size = 32;
    const color = appColors.primary5;

    const profileMenu = [
        {
            key: 'changepassword',
            title: 'Cange Password',
            icon: <Key size={size} color={color} />,
        },

    ];
    return (
        <View>
            <Text>DrawerSetting</Text>
        </View>
    )
}

export default DrawerSetting