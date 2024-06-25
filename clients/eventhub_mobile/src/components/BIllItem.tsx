import React from 'react';
import { View, ImageBackground, Image, StyleProp, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { CardComponent, RowComponent, SpaceComponent, TextComponent } from '.';
import { Heart, Location, Ticket } from 'iconsax-react-native';
import { appColors } from '../constants/appColors';
import { appInfo } from '../constants/appInfos';
import { fontFamilies } from '../constants/fontFamilies';
import { AuthState, authSelector } from '../redux/reducers/authReducer';
import { globalStyles } from '../styles/globalStyles';
import { dateTime } from '../utils/dateTime';
import { numberToString } from '../utils/numberToString';
import { BillModel } from '../models/BillModel';

interface Props {
    item: BillModel;
    type: 'card' | 'list';
    styles?: StyleProp<ViewStyle>;
    disabled?: boolean;
    hideLocationAddress?: boolean;
    isMyTicket?: boolean;
}

const BillItem = (props: Props) => {
    const { item, type, styles, disabled, hideLocationAddress, isMyTicket } = props;
    const navigation: any = useNavigation();
    const auth: AuthState = useSelector(authSelector);

    return (
        <CardComponent
            isShadows
            styles={[{ width: appInfo.sizes.WIDTH * 0.7, backgroundColor: appColors.primary7 }, styles]}
            onPress={() => navigation.navigate('EventDetail', { id: item.eventId })}
            disabled={disabled}
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
                            {isMyTicket && (
                                <RowComponent >
                                    <Ticket
                                        color='red'
                                        size='28'
                                        variant='Bold'
                                    />
                                    <SpaceComponent width={12} />
                                    <TextComponent title text={item.quantity.toString()} size={28} color='red'
                                    />
                                </RowComponent>
                            )}
                            {!isMyTicket && (
                                auth.follow_events && auth.follow_events.includes(item.eventId) &&
                                (<CardComponent
                                    styles={[globalStyles.noSpaceCard]}
                                    color="#ffffffB3">
                                    <Heart
                                        color={appColors.danger2}
                                        size='28'
                                        variant='Bold'
                                    />
                                </CardComponent>)
                            )}
                        </RowComponent>
                    </ImageBackground>
                    <TextComponent numberOfLine={1} text={item.title} title size={18} />
                    {!hideLocationAddress && (
                        <RowComponent>
                            <Location size={18} color={appColors.primary5} variant="Bold" />
                            <SpaceComponent width={8} />
                            <TextComponent
                                flex={1}
                                numberOfLine={1}
                                text={item.locationTitle}
                                size={16}
                                color={appColors.primary5}
                            />
                        </RowComponent>
                    )}
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
                            {!hideLocationAddress && (
                                <RowComponent>
                                    <Location size={18} color={appColors.primary5} variant="Bold" />
                                    <SpaceComponent width={8} />
                                    <TextComponent
                                        flex={1}
                                        numberOfLine={1}
                                        text={item.locationTitle}
                                        size={12}
                                        color={appColors.primary5}
                                    />
                                    {isMyTicket && (
                                        <View>
                                            <Ticket
                                                color={appColors.danger2}
                                                size='28'
                                                variant='Bold'
                                            />
                                        </View>
                                    )}
                                    {!isMyTicket && (
                                        auth.follow_events && auth.follow_events.includes(item.eventId) &&
                                        <Heart
                                            color={appColors.danger2}
                                            size='28'
                                            variant='Bold'
                                        />
                                    )}
                                </RowComponent>
                            )}
                            {isMyTicket && (
                                <RowComponent>
                                    <TextComponent text={item.quantity.toString()} size={18} color={appColors.primary5} />
                                </RowComponent>
                            )}
                        </View>
                    </RowComponent>
                </>
            )}
        </CardComponent>
    );
};

export default BillItem;
