import { View, Text, Alert } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { NotificationModel } from '../models/NotificationModel'
import RowComponent from './RowComponent'
import AvatarComponent from './AvatarComponent'
import { globalStyles } from '../styles/globalStyles'
import { fontFamilies } from '../constants/fontFamilies'
import SpaceComponent from './SpaceComponent'
import ButtonComponent from './ButtonComponent'
import { appColors } from '../constants/appColors'
import TextComponent from './TextComponent'
import userAPI from '../apis/userApi'
import { ProfileModel } from '../models/ProfileModel'
import { dateTime } from '../utils/dateTime'
import firestore from '@react-native-firebase/firestore'

interface Props {
    item: NotificationModel
}

const NotificationItem = (props: Props) => {
    const { item } = props
    const [profile, setProfile] = useState<ProfileModel>();
    const [isLoading, setIsLoading] = useState(false);

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
            await firestore().collection('notifications').doc(item.id).delete();
            console.log('Done')

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
                photoUrl={profile && profile.photoUrl ? `${profile.photoUrl}` : ''}
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
                        <ButtonComponent text='Reject'
                            onPress={() => Alert.alert('Confirm', 'Are you sure you want to reject?', [{
                                text: 'Cancel',
                                onPress: () => console.log('Cancel remove')
                            },
                            {
                                text: 'Reject',
                                style: 'destructive',
                                onPress: () => handlerRemoveNotification
                            }
                            ])
                            }
                            styles={[globalStyles.center, {
                                borderWidth: 1,
                                backgroundColor: appColors.primary7,
                                borderColor: appColors.gray2,
                                paddingVertical: 10,
                            }]}
                            textColor={appColors.gray}
                            type='primary'
                        />
                        <ButtonComponent text='Accept'
                            type='primary' color=''
                            styles={{ paddingVertical: 10 }} />

                    </RowComponent>
                }
            </View>
            <TextComponent color={appColors.gray} text={dateTime.GetDateUpdate(item.createAt)} />



        </RowComponent>
    )
}

export default NotificationItem