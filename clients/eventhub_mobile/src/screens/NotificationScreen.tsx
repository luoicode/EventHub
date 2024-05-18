import firestore from '@react-native-firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useSelector } from 'react-redux';
import {
    ButtonComponent,
    ContainerComponent,
    NotificationItem,
    SectionComponent,
    SpaceComponent,
    TextComponent
} from '../components';
import { appColors } from '../constants/appColors';
import { fontFamilies } from '../constants/fontFamilies';
import { LoadingModal } from '../modals';
import { NotificationModel } from '../models/NotificationModel';
import { authSelector } from '../redux/reducers/authReducer';
import { globalStyles } from '../styles/globalStyles';

const NotificationScreen = () => {
    const [notifications, setNotification] = useState<NotificationModel[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const user = useSelector(authSelector);

    useEffect(() => {
        setIsLoading(true)
        firestore()
            .collection('notifications')
            .where('uid', '==', user.id)
            .onSnapshot(snap => {
                if (snap.empty) {
                    setNotification([]);
                    setIsLoading(false)
                } else {
                    const items: any = [];

                    snap.forEach(item =>
                        items.push({
                            id: item.id,
                            ...item.data(),
                        }),
                    );

                    setNotification(items);
                    setIsLoading(false)
                }
            });

    }, [])

    const handlerChecktoReadAllNotification = () => {
        setIsUpdating(true)
        try {
            notifications.forEach(async item => {
                await firestore().collection('notifications').doc(item.id).update({
                    isRead: true
                })
            })
            setIsUpdating(false)
        } catch (error) {

            setIsUpdating(false)
        }
    }

    return (
        <ContainerComponent
            isScroll={false}
            back
            title="Notification"
            right={
                <ButtonComponent
                    onPress={handlerChecktoReadAllNotification}
                    icon={
                        <AntDesign name="checkcircleo" size={20} color={appColors.text} />
                    }
                />
            }>
            {isLoading ? <SectionComponent styles={[globalStyles.center, { flex: 1 }]}>
                <ActivityIndicator color={appColors.gray2} />
                <TextComponent text='Loading...' color={appColors.gray} />
            </SectionComponent> : notifications.length > 0 ? (
                <>
                    <FlatList
                        style={{ paddingTop: 20 }}
                        data={notifications}
                        renderItem={({ item, index }) => (
                            <NotificationItem item={item} key={item.id} />
                        )}
                    />
                </>
            ) : (
                <SectionComponent styles={[globalStyles.center, { flex: 1 }]}>
                    <Image
                        source={require('../assets/images/emptyNotification.png')}
                        style={{ width: '70%' }}
                    />
                    <TextComponent
                        text="No Notification!"
                        size={24}
                        font={fontFamilies.medium}
                        color="#344B67"
                    />
                    <SpaceComponent height={16} />
                    <TextComponent
                        text="Nothing to notify you about at the moment. Stay tuned for any updates!"
                        size={18}
                        color={appColors.gray4}
                        styles={{ textAlign: 'center' }}
                    />
                </SectionComponent>
            )}
            <LoadingModal visible={isLoading} />
        </ContainerComponent>
    );
};

export default NotificationScreen;
