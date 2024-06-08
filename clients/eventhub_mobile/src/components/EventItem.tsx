import { Heart, Location } from 'iconsax-react-native';
import React from 'react';
import { Image, ImageBackground, StyleProp, View, ViewStyle } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
    AvatarGroup,
    CardComponent,
    RowComponent,
    SpaceComponent,
    TextComponent,
} from '.';
import { appColors } from '../constants/appColors';
import { appInfo } from '../constants/appInfos';
import { fontFamilies } from '../constants/fontFamilies';
import { EventModel } from '../models/EventModel';
import { globalStyles } from '../styles/globalStyles';
import { useNavigation } from '@react-navigation/native';
import { dateTime } from '../utils/dateTime';
import { AuthState, authSelector } from '../redux/reducers/authReducer';
import { useSelector } from 'react-redux';
import { numberToString } from '../utils/numberToString';

interface Props {
    item: EventModel;
    type: 'card' | 'list';
    styles?: StyleProp<ViewStyle>
}

const EventItem = (props: Props) => {
    const { item, type, styles } = props;
    const navigation: any = useNavigation();
    const auth: AuthState = useSelector(authSelector);


    return (
        <CardComponent
            isShadows
            styles={[{ width: appInfo.sizes.WIDTH * 0.7, backgroundColor: appColors.primary7 }, styles]}
            onPress={() => navigation.navigate('EventDetail', { id: item._id })}
        >
            {type === 'card' ? (
                <>
                    <ImageBackground
                        style={{ flex: 1, marginBottom: 12, height: 160, padding: 10 }}
                        source={{ uri: item.photoUrl }}
                        imageStyle={{
                            resizeMode: 'cover',
                            borderRadius: 12,
                        }}>
                        <RowComponent justify="space-between">
                            <CardComponent
                                styles={[globalStyles.noSpaceCard]}
                                color="#ffffffB3">
                                <TextComponent
                                    color={appColors.danger}
                                    font={fontFamilies.bold}
                                    size={18}
                                    text={numberToString(new Date(item.date).getDate())}
                                />
                                <TextComponent
                                    color={appColors.danger}
                                    font={fontFamilies.semiBold}
                                    size={10}
                                    text={appInfo.monthNames[new Date(item.date).getMonth()].substring(0, 3)}
                                />
                            </CardComponent>
                            {
                                auth.follow_events && auth.follow_events.includes(item._id) &&
                                (<CardComponent
                                    styles={[globalStyles.noSpaceCard]}
                                    color="#ffffffB3">
                                    <Heart
                                        color={appColors.danger2}
                                        size='28'
                                        variant='Bold'
                                    />
                                </CardComponent>)
                            }
                        </RowComponent>
                    </ImageBackground>
                    <TextComponent numberOfLine={1} text={item.title} title size={18} />
                    <AvatarGroup userIds={item.users} />
                    <RowComponent>
                        <Location size={18} color={appColors.primary5} variant="Bold" />
                        <SpaceComponent width={8} />
                        <TextComponent
                            flex={1}
                            numberOfLine={1}
                            text={item.locationAddress}
                            size={16}
                            color={appColors.primary5}
                        />
                    </RowComponent>
                </>
            ) : (
                <>
                    <RowComponent>
                        <Image
                            source={{ uri: item.photoUrl }}
                            style={{
                                width: 79,
                                height: 92,
                                borderRadius: 12,
                                resizeMode: 'cover',
                            }}
                        />
                        <SpaceComponent width={12} />
                        <View style={{ flex: 1, alignItems: 'stretch' }}>
                            <TextComponent color={appColors.primary5} text={`${dateTime.GetDayString(item.date)} • ${dateTime.GetTime(new Date(item.startAt))} `} />
                            <TextComponent text={item.title} title size={18} numberOfLine={2} />
                            <RowComponent>
                                <Location size={18} color={appColors.primary5} variant="Bold" />
                                <SpaceComponent width={8} />
                                <TextComponent
                                    flex={1}
                                    numberOfLine={1}
                                    text={item.locationAddress}
                                    size={12}
                                    color={appColors.primary5}
                                />
                                {auth.follow_events && auth.follow_events.includes(item._id) &&

                                    <Heart
                                        color={appColors.danger2}
                                        size='28'
                                        variant='Bold'
                                    />
                                }
                            </RowComponent>

                        </View>
                    </RowComponent>
                </>
            )}
        </CardComponent>
    );
};

export default EventItem;
