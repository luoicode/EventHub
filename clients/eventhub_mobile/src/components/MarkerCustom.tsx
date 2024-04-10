import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import React from 'react';
import TextComponent from './TextComponent';
import { globalStyles } from '../styles/globalStyles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { appColors } from '../constants/appColors';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Props {
    onPress: () => void;
    type: string;
}

const MarkerCustom = (props: Props) => {
    const { type, onPress } = props;

    const renderIcon = (type: string) => {
        let icon;

        switch (type) {
            case 'art':
                icon = <Ionicons name="color-palette-outline" size={24} color="#46CDFB" />;
                break;
            case 'sport':
                icon = <FontAwesome5 name="basketball-ball" size={24} color="#F0635A" />;
                break;
            case 'food':
                icon = <FontAwesome6 name="bowl-food" size={24} color="#29D697" />;
                break;
            case 'game':
                icon = <Ionicons name="game-controller" size={24} color="#E1AFD1" />;
                break;
            default:
                icon = <FontAwesome6 name="bowl-food" size={24} color="#29D697" />;
                break;
        }

        return icon;
    };

    return (
        <TouchableOpacity onPress={onPress}>
            <ImageBackground
                source={require('../assets/images/Union.png')}
                style={[
                    globalStyles.shadow,
                    {
                        width: 56,
                        height: 56,
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                ]}
                imageStyle={{
                    resizeMode: 'contain',
                    width: 56,
                    height: 56,
                }}>
                {renderIcon(type)}
            </ImageBackground>
        </TouchableOpacity>
    );
};

export default MarkerCustom;
