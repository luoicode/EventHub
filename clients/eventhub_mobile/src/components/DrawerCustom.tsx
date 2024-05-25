import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
    Bookmark2,
    Calendar,
    Heart,
    Logout,
    Message2,
    MessageQuestion,
    Setting2,
    Sms,
    User,
} from 'iconsax-react-native';
import React from 'react';
import {
    FlatList,
    Image,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { LoginManager } from 'react-native-fbsdk-next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { AvatarComponent, RowComponent, SpaceComponent, TextComponent } from '.';
import { appColors } from '../constants/appColors';
import { fontFamilies } from '../constants/fontFamilies';
import { authSelector, removeAuth } from '../redux/reducers/authReducer';
import { globalStyles } from '../styles/globalStyles';
import { HandlerNotification } from '../utils/handlerNotification';

const DrawerCustom = ({ navigation }: any) => {
    const auth = useSelector(authSelector);
    const dispatch = useDispatch();
    const size = 32;
    const color = appColors.primary5;
    const profileMenu = [
        {
            key: 'MyProfile',
            title: 'My Profile',
            icon: <User size={size} color={color} />,
        },
        {
            key: 'Message',
            title: 'Message',
            icon: <Message2 size={size} color={color} />,
        },
        {
            key: 'Calendar',
            title: 'Calendar',
            icon: <Calendar size={size} color={color} />,
        },
        {
            key: 'Favourite',
            title: 'Favourite',
            icon: <Heart size={size} color={color} />,
        },
        {
            key: 'ContactUs',
            title: 'Contact Us',
            icon: <Sms size={size} color={color} />,
        },
        {
            key: 'Settings',
            title: 'Settings',
            icon: <Setting2 size={size} color={color} />,
        },
        {
            key: 'HelpAndFAQs',
            title: 'Help & FAQs',
            icon: <MessageQuestion size={size} color={color} />,
        },
        {
            key: 'SignOut',
            title: 'Sign Out',
            icon: <Logout size={size} color={color} />,
        },
    ];
    const handlerLogout = async () => {
        const fcmtoken = await AsyncStorage.getItem('fcmtoken');
        if (fcmtoken) {
            if (auth.fcmTokens && auth.fcmTokens.length > 0) {
                const items = [...auth.fcmTokens];
                const index = items.findIndex(element => element === fcmtoken);
                if (index !== -1) {
                    items.splice(index, 1);
                }
                await HandlerNotification.Update(auth.id, items);
            }
        }
        await GoogleSignin.signOut();
        LoginManager.logOut();
        await AsyncStorage.removeItem('auth');
        dispatch(removeAuth({}));
    };
    const handlerNavigation = (key: string) => {
        switch (key) {
            case 'HelpAndFAQs':
                navigation.navigate('HelpAndFAQsScreen')
                break;
            case 'SignOut':
                handlerLogout();
                break;
            case 'MyProfile':
                navigation.navigate('Profile', {
                    screen: 'ProfileScreen',
                    params: {
                        id: auth.id,
                    },
                });
                break;
            default:
                console.log(key);
                break;
        }
        navigation.closeDrawer();
    };
    return (
        <View style={[localStyles.container, { backgroundColor: appColors.primary7, marginTop: 30 }]}>
            <AvatarComponent
                onPress={() => handlerNavigation('MyProfile')}
                photoURL={auth.photo}
                name={auth.name ? auth.name : auth.email}
            />
            <FlatList
                showsVerticalScrollIndicator={false}
                data={profileMenu}
                style={{ flex: 1, marginVertical: 20 }}
                renderItem={({ item, index }) => (
                    <RowComponent
                        styles={[localStyles.listItem]}
                        onPress={() => handlerNavigation(item.key)}>
                        {item.icon}
                        <TextComponent
                            text={item.title}
                            styles={localStyles.listItemText}
                        />
                    </RowComponent>
                )}
            />
            <RowComponent justify="flex-start">
                <TouchableOpacity
                    style={[
                        globalStyles.button,
                        { backgroundColor: appColors.primary5, height: 'auto' },
                    ]}>
                    <MaterialCommunityIcons name="crown" size={22} color="yellow" />
                    <SpaceComponent width={8} />
                    <TextComponent color={appColors.primary7} font={fontFamilies.medium} text="Upgrade Pro" />
                </TouchableOpacity>
            </RowComponent>
        </View>
    );
};

export default DrawerCustom;

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingVertical: StatusBar.currentHeight,
    },

    avatar: {
        width: 52,
        height: 52,
        borderRadius: 100,
        marginBottom: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },

    listItem: {
        paddingVertical: 12,
        justifyContent: 'flex-start',
    },

    listItemText: {
        paddingLeft: 12,
    },
});
