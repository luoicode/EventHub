import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
    Bookmark2,
    Calendar,
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
    View
} from 'react-native';
import { LoginManager } from 'react-native-fbsdk-next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { RowComponent, SpaceComponent, TextComponent } from '.';
import { appColors } from '../constants/appColors';
import { authSelector, removeAuth } from '../redux/reducers/authReducer';
import { globalStyles } from '../styles/globalStyles';
import { fontFamilies } from '../constants/fontFamilies';

const DrawerCustom = ({ navigation }: any) => {
    const user = useSelector(authSelector);
    const dispatch = useDispatch();
    const size = 36;
    const color = appColors.gray;
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
            key: 'Bookmark',
            title: 'Bookmark',
            icon: <Bookmark2 size={size} color={color} />,
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

    const handlerSignOut = async () => {
        await GoogleSignin.signOut();
        await LoginManager.logOut();
        dispatch(removeAuth({}));
        await AsyncStorage.clear();
    };

    return (
        <View style={[localStyles.container]}>
            <TouchableOpacity
                onPress={() => {
                    navigation.closeDrawer();

                    navigation.navigate('Profile', {
                        screen: 'ProfileScreen',
                    });
                }}>
                {user.photo ? (
                    <Image source={{ uri: user.photo }} style={[localStyles.avatar]} />
                ) : (
                    <View
                        style={[localStyles.avatar, { backgroundColor: appColors.gray2 }]}>
                        <TextComponent
                            title
                            size={38}
                            color={appColors.white}
                            text={
                                user.name
                                    ? user.name
                                        .split(' ')
                                    [user.name.split(' ').length - 1].substring(0, 1)
                                    : ''
                            }
                        />
                    </View>
                )}
                <TextComponent text={user.name} title size={24} />
            </TouchableOpacity>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={profileMenu}
                style={{ flex: 1, marginVertical: 20 }}
                renderItem={({ item, index }) => (
                    <RowComponent
                        styles={[localStyles.listItem]}
                        onPress={
                            item.key === 'SignOut'
                                ? () => handlerSignOut()
                                : () => {
                                    console.log(item.key);
                                    navigation.closeDrawer();
                                }
                        }>
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
                        { backgroundColor: '#DFF5FF', height: 'auto' },
                    ]}>
                    <MaterialCommunityIcons name="crown" size={28} color={'#FFC700'} />
                    <SpaceComponent width={8} />
                    <TextComponent color="#378CE7" size={20} font={fontFamilies.bold} text="Upgrade Pro" />
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