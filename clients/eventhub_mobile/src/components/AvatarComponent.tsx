import React from 'react';
import {
    Image,
    ImageProps,
    StyleProp,
    TouchableOpacity,
    View,
} from 'react-native';
import { appColors } from '../constants/appColors';
import TextComponent from './TextComponent';
import { globalStyles } from '../styles/globalStyles';
import { fontFamilies } from '../constants/fontFamilies';

interface Props {
    photoUrl?: string;
    name: string;
    size?: number;
    styles?: StyleProp<ImageProps>;
    onPress?: () => void;
}

const AvatarComponent = (props: Props) => {
    const { photoUrl, name, size, styles, onPress } = props;
    return (
        <TouchableOpacity disabled={!onPress} onPress={onPress}>
            {photoUrl ? (
                <Image
                    source={{ uri: photoUrl }}
                    style={[
                        {
                            width: size ?? 60,
                            height: size ?? 60,
                            borderRadius: 100,
                            borderWidth: 1,
                            borderColor: appColors.white,
                        },
                        styles,
                    ]}
                />
            ) : (
                <View
                    style={[
                        globalStyles.center,
                        {
                            width: size ?? 60,
                            height: size ?? 60,
                            borderRadius: 100,
                            borderWidth: 1,
                            borderColor: appColors.white,
                            backgroundColor: appColors.gray2,
                        },
                    ]}>
                    <TextComponent
                        text={name.substring(0, 1).toLocaleUpperCase()}
                        font={fontFamilies.bold}
                        color={appColors.white}
                        size={size ? size / 3 : 14}
                    />
                </View>
            )}
        </TouchableOpacity>
    );
};

export default AvatarComponent;
