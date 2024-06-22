import firestore from '@react-native-firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Alert, Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import eventAPI from '../apis/eventApi'
import userAPI from '../apis/userApi'
import { appColors } from '../constants/appColors'
import { fontFamilies } from '../constants/fontFamilies'
import { NotificationModel } from '../models/NotificationModel'
import { ProfileModel } from '../models/ProfileModel'
import { authSelector } from '../redux/reducers/authReducer'
import { globalStyles } from '../styles/globalStyles'
import { dateTime } from '../utils/dateTime'
import AvatarComponent from './AvatarComponent'
import ButtonComponent from './ButtonComponent'
import RowComponent from './RowComponent'
import SpaceComponent from './SpaceComponent'
import TextComponent from './TextComponent'

interface Props {
    item: NotificationModel
}

const NotificationItem = (props: Props) => {
    const { item } = props
    const [profile, setProfile] = useState<ProfileModel>();
    const [isLoading, setIsLoading] = useState(false);

    const ref = firestore().collection('notifications').doc(item.id)

    const user = useSelector(authSelector)

    useEffect(() => {
        getUserDetail();
    }, [item.from])


    const getUserDetail = async () => {
        const api = `/get-profile?uid=${item.from}`
        setIsLoading(true)

        try {
            const res: any = await userAPI.HandlerUser(api)

            setProfile(res.data)
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)

            console.log(error)
        }
    }


    const handlerRemoveNotification = async () => {
        try {
            await ref.delete();
            console.log('Done')

        } catch (error) {
            console.log(error)
        }
    }

    const handlerJoinEvent = async () => {
        const api = `/join-event?eventId=${item.eventId}&uid=${user.id}`


        try {
            const res = await eventAPI.HandlerEvent(api)

            await ref.update({
                isRead: true
            })

        } catch (error) {
            console.log(error)
        }
    }


    return (
        <RowComponent
            styles={{
                backgroundColor: item.isRead ? 'white' : appColors.gray2,
                marginBottom: item.isRead ? 20 : 0,
                paddingHorizontal: 16,
                alignItems: 'flex-start',
            }}>

            <AvatarComponent
                size={45}
                name={profile && profile.name ? `${profile.name} ` : ' '}
                photoURL={profile && profile.photoUrl ? `${profile.photoUrl}` : ''}
            />

            <View
                style={{ flex: 1, paddingHorizontal: 12, paddingRight: 28 }}>
                <Text
                    style={[
                        globalStyles.text,
                        { fontFamily: fontFamilies.medium },
                    ]}>
                    {profile && profile.name ? `${profile.name} ` : ' '}
                    <TextComponent text={item.content}
                    />
                </Text>
                <SpaceComponent height={16} />
                {
                    !item.isRead &&
                    <RowComponent justify='center' styles={{ alignItems: 'center' }}>
                        <ButtonComponent
                            text='Reject'
                            onPress={() =>
                                Alert.alert(
                                    'Confirm',
                                    'Are you sure you want to reject?',
                                    [
                                        {
                                            text: 'Cancel',
                                            onPress: () => console.log('Cancel remove')
                                        },
                                        {
                                            text: 'Reject',
                                            style: 'destructive',
                                            onPress: handlerRemoveNotification // Thêm dấu ngoặc tròn sau tên hàm
                                        }
                                    ]
                                )
                            }
                            styles={[
                                globalStyles.center,
                                {
                                    borderWidth: 1,
                                    backgroundColor: appColors.primary7,
                                    borderColor: appColors.gray2,
                                    paddingVertical: 10
                                }
                            ]}
                            textColor={appColors.gray}
                            type='primary'
                        />
                        <ButtonComponent text='Accept'
                            onPress={handlerJoinEvent}
                            type='primary' color=''
                            styles={{ paddingVertical: 10 }} />

                    </RowComponent>
                }
            </View>
            <View >
                <TextComponent color={appColors.gray} text={dateTime.GetDateUpdate(item.createAt)} />
                <SpaceComponent height={8} />
                <View style={{ marginLeft: 80, width: 10, height: 10, borderRadius: 100, backgroundColor: item.isRead ? 'white' : appColors.primary3, }} />
            </View>




        </RowComponent>
    )
}

export default NotificationItem