import React, { useEffect, useState } from 'react';
import {
    Image,
    StyleProp,
    TouchableOpacity,
    View,
    ImageStyle,
} from 'react-native';
import { appColors } from '../constants/appColors';
import TextComponent from './TextComponent';
import { globalStyles } from '../styles/globalStyles';
import { fontFamilies } from '../constants/fontFamilies';
import userAPI from '../apis/userApi';

interface Props {
    photoURL?: string;
    uid?: string
    name?: string;
    size?: number;
    styles?: StyleProp<ImageStyle>;
    onPress?: () => void;
}

const AvatarComponent = (props: Props) => {
    const { photoURL, name, size, styles, onPress, uid } = props;
    const [profile, setProfile] = useState<{ name?: string; photoUrl?: string }>({
        name: name ?? '',
        photoUrl: photoURL ?? '',
    });

    useEffect(() => {
        if (!photoURL && uid) {
            getUserProfile();
        }
    }, [photoURL, uid]);

    const getUserProfile = async () => {
        const api = `/get-profile?uid=${uid}`;
        try {
            const res: any = await userAPI.HandlerUser(api);
            setProfile({
                name: res.data.name,
                photoUrl: res.data.photoUrl,
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <TouchableOpacity disabled={!onPress} onPress={onPress}>
            {photoURL ? (
                <Image
                    source={{ uri: photoURL }}
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
                        text={profile.name ? profile.name.substring(0, 1).toLocaleUpperCase() : ''}
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
