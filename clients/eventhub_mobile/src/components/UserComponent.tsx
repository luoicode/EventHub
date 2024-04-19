import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';
import userAPI from '../apis/userApi';
import { ProfileModel } from '../models/ProfileModel';
import SpaceComponent from './SpaceComponent';
import { fontFamilies } from '../constants/fontFamilies';
import { appColors } from '../constants/appColors';
import TagComponent from './TagComponent';

interface Props {
    userId: string;
    types: 'Notification' | 'Invite';
    onPress: () => void;
}

const UserComponent = (props: Props) => {
    const { userId, onPress, types } = props;
    const [profile, setProfile] = useState<ProfileModel>();

    useEffect(() => {
        getProfile();
    }, [userId]);

    const getProfile = async () => {
        const api = `/get-profile?uid=${userId}`;

        try {
            const res = await userAPI.HandlerUser(api);
            res && res.data && setProfile(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        profile && (
            <RowComponent onPress={onPress}>
                <TouchableOpacity>
                    <Image
                        source={{
                            uri: profile.photoUrl
                                ? profile.photoUrl
                                : 'https://img.icons8.com/plasticine/100/user-male-circle.png',
                        }}
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            resizeMode: 'cover',
                        }}
                    />
                </TouchableOpacity>
                <SpaceComponent width={16} />
                <View
                    style={{
                        flex: 1,
                        height: 48,
                        justifyContent: 'space-around',
                    }}>
                    <TextComponent
                        text={profile.name ? profile.name : profile?.email}
                        font={fontFamilies.medium}
                        size={18}
                    />
                    <TextComponent
                        text={profile.type ? profile.type : 'Personal'}
                        color={appColors.gray}
                        size={16}
                    />
                </View>
            </RowComponent>
        )
    );
};

export default UserComponent;
