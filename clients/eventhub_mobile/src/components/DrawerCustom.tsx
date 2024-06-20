import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
    Calendar,
    Heart,
    Lock1,
    Logout,
    MessageQuestion,
    Sms,
    Ticket,
    User
} from 'iconsax-react-native';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    Modal,
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
    const [upgradeModalVisible, setUpgradeModalVisible] = useState(false);

    const profileMenu = [
        {
            key: 'MyProfile',
            title: 'My Profile',
            icon: <User size={size} color={color} />,
        },
        {
            key: 'MyTicket',
            title: 'My Ticket',
            icon: <Ticket
                size={size}
                color={color}
            />,
        },
        {
            key: 'Chatbot',
            title: 'EventHub Bot',
            icon: <MaterialCommunityIcons name="robot-confused-outline" size={size} color={color} />,
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
            key: 'Privacy',
            title: 'Privacy',
            icon: <Lock1 size={size} color={color} />,
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
        // Hiển thị thông báo xác nhận trước khi đăng xuất
        Alert.alert(
            "Xác nhận đăng xuất",
            "Bạn có chắc chắn muốn đăng xuất?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: async () => {
                        // Lấy fcmtoken từ AsyncStorage
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
                        // Đăng xuất khỏi Google và Facebook
                        await GoogleSignin.signOut();
                        LoginManager.logOut();
                        // Xóa thông tin auth từ AsyncStorage
                        await AsyncStorage.removeItem('auth');
                        // Gọi dispatch để xóa thông tin auth khỏi Redux store
                        dispatch(removeAuth({}));
                    }
                }
            ],
            { cancelable: false }
        );
    };

    const handlerNavigation = (key: string) => {
        switch (key) {
            case 'HelpAndFAQs':
                navigation.navigate('HelpAndFAQsScreen')
                break;
            case 'ContactUs':
                navigation.navigate('ContactScreen')
                break;
            case 'Privacy':
                navigation.navigate('Privacy')
                break;
            case 'Calendar':
                navigation.navigate('Calendar')
                break;
            case 'Chatbot':
                navigation.navigate('ChatBot')
                break;
            case 'Favourite':
                navigation.navigate('FavouriteScreen')
                break;
            case 'MyTicket':
                navigation.navigate('MyTicket')
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
            <SpaceComponent height={16} />
            <TextComponent text={auth.name} title size={22} />
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
                        { backgroundColor: appColors.primary3, height: 'auto' },
                    ]}
                    onPress={() => setUpgradeModalVisible(true)} // Mở modal khi ấn vào nút
                >
                    <MaterialCommunityIcons name="crown" size={22} color="yellow" />
                    <SpaceComponent width={8} />
                    <TextComponent color={appColors.primary7} font={fontFamilies.medium} text="Upgrade Pro" />
                </TouchableOpacity>
            </RowComponent>
            <Modal
                animationType="slide"
                transparent={true}
                visible={upgradeModalVisible}
                onRequestClose={() => {
                    setUpgradeModalVisible(!upgradeModalVisible);
                }}
            >
                <View style={localStyles.centeredView}>
                    <View style={[globalStyles.shadow, localStyles.modalView]}>
                        <Image
                            source={require('../assets/images/maintenance.png')}
                            style={localStyles.image}
                        />
                        <TextComponent styles={localStyles.modalText} text='The system is under upgrade!' />

                        <TouchableOpacity
                            style={[localStyles.button, localStyles.buttonClose]}
                            onPress={() => setUpgradeModalVisible(!upgradeModalVisible)}
                        >
                            <TextComponent styles={localStyles.textStyle} text='Close' />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: appColors.primary7,
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonClose: {
        backgroundColor: appColors.primary5,
    },
    textStyle: {
        color: appColors.primary7,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 15,
    },
});
