import Geolocation from '@react-native-community/geolocation';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import {
    HambergerMenu,
    Notification,
    SearchNormal1
} from 'iconsax-react-native';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    ImageBackground,
    ScrollView,
    StatusBar,
    TouchableOpacity,
    View
} from 'react-native';
import Geocoder from 'react-native-geocoding';
import Toast from 'react-native-toast-message';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import eventAPI from '../../apis/eventApi';
import {
    ButtonComponent,
    CategoriesList,
    CircleComponent,
    EventItem,
    LoadingComponent,
    RowComponent,
    SectionComponent,
    SpaceComponent,
    TabBarComponent,
    TagComponent,
    TextComponent
} from '../../components';
import { appColors } from '../../constants/appColors';
import { fontFamilies } from '../../constants/fontFamilies';
import { AddressModel } from '../../models/AddressModel';
import { EventModel } from '../../models/EventModel';
import { globalStyles } from '../../styles/globalStyles';
import { handlerLinking } from '../../utils/handlerLinking';
import { useIsFocused } from '@react-navigation/native';

Geocoder.init(process.env.MAP_API_KEY as string);

const HomeScreen = ({ navigation }: any) => {
    const [currentLocation, setCurrentLocation] = useState<AddressModel>();
    const [events, setEvents] = useState<EventModel[]>([]);
    const [nearbyEvents, setNearbyEvents] = useState<EventModel[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [eventsData, seteventsData] = useState<EventModel[]>([]);

    const isFocused = useIsFocused();

    useEffect(() => {
        Geolocation.getCurrentPosition(
            (position: any) => {
                if (position.coords) {
                    reverseGeoCode({
                        lat: position.coords.latitude,
                        long: position.coords.longitude,
                    });
                }
            },
            (error: any) => {
                console.log(error);
            },
        );

        getEvents();
        getEventsData();
        messaging().onMessage(async (mess: any) => {
            Toast.show({
                text1: mess.notification.title,
                text2: mess.notification.body,
                onPress: () => {
                    const id = mess.data ? mess.data.id : '';
                    // console.log(id);
                    id && navigation.navigate('EventDetail', { id });
                },
            });
        });
        messaging()
            .getInitialNotification()
            .then((mess: any) => {
                const id = mess && mess.data ? mess.data.id : '';

                id && handlerLinking(`eventhub://app/detail/${mess.data.id}`)

            })

    }, []);

    useEffect(() => {
        getNearByEvents();
    }, [currentLocation]);

    useEffect(() => {
        if (isFocused) {
            getEvents();
            getNearByEvents();
        }
    }, [isFocused])

    const getNearByEvents = () => {
        currentLocation &&
            currentLocation.postion &&
            getEvents(currentLocation.postion.lat, currentLocation.postion.long);
    }

    const reverseGeoCode = async ({ lat, long }: { lat: number; long: number }) => {
        const api = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat},${long}&leng=vi-VI&apiKey=9xtPpCx-_XvOPAIXkPFPAn-fXs2HOa9mvitLme7Mit4`;

        try {
            const res = await axios(api);
            if (res && res.status === 200 && res.data) {
                const items = res.data.items;
                setCurrentLocation(items[0]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getEvents = async (lat?: number, long?: number, distance?: number) => {
        const api = `${lat && long
            ? `/get-events?lat=${lat}&long=${long}&distance=${distance ?? 5
            }&limit=5`
            : `/get-events?limit=5`
            }`;

        if (events.length === 0 || nearbyEvents.length === 0) {
            setIsLoading(true);

        }

        try {
            const res = await eventAPI.HandlerEvent(api);
            setIsLoading(false);
            res &&
                res.data &&
                (lat && long ? setNearbyEvents(res.data) : setEvents(res.data));
        } catch (error) {
            setIsLoading(false);
            console.log(`Get event error in home screen line 74 ${error}`);
        }
    };
    const getEventsData = async (lat?: number, long?: number, distance?: number) => {
        const api = `/get-events`;

        try {
            const res = await eventAPI.HandlerEvent(api)

            const data = res.data

            const items: EventModel[] = []

            data.forEach((item: any) => items.push(item))

            seteventsData(items)
        } catch (error) {
            console.log(error)
        }

    };

    const categories = [
        { "label": "Music", "value": "662103c304c2c69a1036c29f" }, { "label": "Sports", "value": "662103c304c2c69a1036c2a1" }, { "label": "Food", "value": "662103c304c2c69a1036c2a3" }, { "label": "Games", "value": "662103c304c2c69a1036c2a7" }, { "label": "Arts", "value": "662103c304c2c69a1036c2a5" }
    ]

    const handlerFixDataEvent = async () => {
        if (eventsData.length > 0)
            eventsData.forEach(async event => {
                const api = `/update-event?id=${event._id}`

                const data = {
                    categories: categories[Math.floor(Math.random() * 4)].value
                }

                const res = await eventAPI.HandlerEvent(api, data, 'put')

                console.log(res.data)
            })
    }

    return (
        <View style={[globalStyles.container, { backgroundColor: appColors.primary6 }]}>
            <StatusBar barStyle={'light-content'} />

            <View
                style={{
                    backgroundColor: appColors.primary5,
                    height: 180,
                    borderBottomLeftRadius: 40,
                    borderBottomRightRadius: 40,
                    paddingTop: StatusBar.currentHeight,
                }}>
                <View style={{ paddingHorizontal: 16 }}>
                    <RowComponent>
                        <TouchableOpacity onPress={() => navigation.openDrawer()}>
                            <HambergerMenu size={40} color={appColors.primary7} />
                        </TouchableOpacity>
                        <View style={[{ flex: 1, alignItems: 'center' }]}>
                            <RowComponent>
                                <TextComponent
                                    text="Current Location"
                                    color={appColors.primary7}
                                    size={16}
                                />
                                <MaterialIcons
                                    name="arrow-drop-down"
                                    size={24}
                                    color={appColors.primary7}
                                />
                            </RowComponent>
                            {currentLocation && (
                                <TextComponent
                                    text={`${currentLocation.address.city},${currentLocation.address.countryName} `}
                                    flex={0}
                                    color={appColors.primary7}
                                    font={fontFamilies.medium}
                                    size={14}
                                />
                            )}
                        </View>

                        <CircleComponent size={40} color={appColors.primary5}>
                            <View>
                                <Notification size={28} color={appColors.primary7} />
                                <View
                                    style={{
                                        backgroundColor: appColors.danger,
                                        width: 6,
                                        height: 6,
                                        borderRadius: 4,
                                        borderWidth: 2,
                                        borderColor: appColors.danger,
                                        position: 'absolute',
                                        top: 0,
                                        right: 1,
                                    }}
                                />
                            </View>
                        </CircleComponent>
                    </RowComponent>
                    <SpaceComponent height={20} />
                    <RowComponent>
                        <RowComponent
                            styles={{ flex: 1 }}
                            onPress={() =>
                                navigation.navigate('SearchEvents', {
                                    isFilter: false,
                                })
                            }>
                            <SearchNormal1
                                variant="TwoTone"
                                size={30}
                                color={appColors.primary7}
                            />
                            <View
                                style={{
                                    width: 1,
                                    height: 20,
                                    marginHorizontal: 12,
                                    backgroundColor: appColors.primary7,
                                }}
                            />
                            <TextComponent
                                size={24}
                                text="Search..."
                                color={appColors.primary7}
                                flex={1}
                            />
                        </RowComponent>
                        <TagComponent
                            label="Filters"
                            icon={
                                <CircleComponent size={20} color={appColors.primary6} >
                                    <MaterialIcons
                                        name="sort"
                                        size={20}
                                        color={appColors.primary7}
                                    />
                                </CircleComponent>
                            }
                            onPress={() =>
                                navigation.navigate('SearchEvents', {
                                    isFilter: true,
                                })
                            }
                        />
                    </RowComponent>
                    <SpaceComponent height={30} />
                </View>
                <View style={{ marginBottom: -20 }}>
                    <CategoriesList isFill />
                </View>
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={[
                    {
                        flex: 1,
                        marginTop: 18,
                        backgroundColor: appColors.primary6
                    },
                ]}>
                <SectionComponent styles={{ paddingHorizontal: 16, paddingTop: 20 }}>
                    <TabBarComponent
                        title="Upcoming Events"

                        onPress={() => navigation.navigate('ExploreEvents')}
                    />
                    {events.length > 0 ? (
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            horizontal
                            data={events}
                            renderItem={({ item, index }) => (
                                <EventItem key={`event${index} `} item={item} type="card" />
                            )}
                        />
                    ) : (
                        <LoadingComponent isLoading={isLoading} values={events.length} />
                    )}
                </SectionComponent>
                <SectionComponent>
                    <ImageBackground
                        source={require('./../../assets/images/invite-image.png')}
                        style={{ flex: 1, padding: 16, minHeight: 127 }}
                        imageStyle={{
                            resizeMode: 'cover',
                            borderRadius: 12,
                        }}>
                        <TextComponent text="Invite your friends" title />
                        <TextComponent text="Get $20 for ticket" />

                        <RowComponent justify="flex-start">
                            <TouchableOpacity
                                onPress={() => console.log('asdasdasd')}
                                style={[
                                    globalStyles.button,
                                    {
                                        marginTop: 12,
                                        backgroundColor: appColors.primary6,
                                        paddingHorizontal: 28,
                                    },
                                ]}>
                                <TextComponent
                                    text="INVITE"
                                    font={fontFamilies.bold}
                                    color={appColors.primary7}
                                />
                            </TouchableOpacity>
                        </RowComponent>
                    </ImageBackground>
                </SectionComponent>
                <SectionComponent styles={{ paddingHorizontal: 16, paddingTop: 20 }}>
                    <TabBarComponent title="Nearby You" onPress={() => { }} />
                    {nearbyEvents.length > 0 ? (
                        <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={nearbyEvents}
                            renderItem={({ item, index }) => (
                                <EventItem key={`event${index} `} item={item} type="card" />
                            )}
                        />
                    ) : (
                        <LoadingComponent
                            isLoading={isLoading}
                            values={nearbyEvents.length}
                        />
                    )}
                </SectionComponent>
            </ScrollView>
            <ButtonComponent text='FixData' type='primary' onPress={handlerFixDataEvent} />
        </View>
    );
};

export default HomeScreen;
