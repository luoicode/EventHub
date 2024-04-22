import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import {
    HambergerMenu,
    Notification,
    SearchNormal1,
    Sort,
} from 'iconsax-react-native';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    ImageBackground,
    Linking,
    Platform,
    ScrollView,
    StatusBar,
    ToastAndroid,
    TouchableOpacity,
    View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
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
    TextComponent,
} from '../../components';
import { appColors } from '../../constants/appColors';
import { fontFamilies } from '../../constants/fontFamilies';
import { AddressModel } from '../../models/AddressModel';
import { authSelector } from '../../redux/reducers/authReducer';
import { globalStyles } from '../../styles/globalStyles';
import Geocoder from 'react-native-geocoding';
import eventAPI from '../../apis/eventApi';
import { EventModel } from '../../models/EventModel';
import messaging, {
    FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';

Geocoder.init(process.env.MAP_API_KEY as string);

const HomeScreen = ({ navigation }: any) => {
    const [currentLocation, setCurrentLocation] = useState<AddressModel>();
    const [events, setEvents] = useState<EventModel[]>([]);
    const [nearbyEvents, setNearbyEvents] = useState<EventModel[]>([]);
    const [isLoading, setIsLoading] = useState(false);

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

        messaging().onMessage(async (mess: any) => {
            Toast.show({
                text1: mess.notification.title,
                text2: mess.notification.body,
                onPress: () => {
                    console.log(mess);
                    const id = mess.data.id;
                    console.log(id);
                    navigation.navigate('EventDetail', { id });
                },
            });
        });
    }, []);

    useEffect(() => {
        currentLocation &&
            currentLocation.postion &&
            getEvents(currentLocation.postion.lat, currentLocation.postion.long);
    }, [currentLocation]);

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

        setIsLoading(true);
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

    return (
        <View style={[globalStyles.container]}>
            <StatusBar barStyle={'light-content'} />

            <View
                style={{
                    backgroundColor: appColors.primary,
                    height: 180,
                    borderBottomLeftRadius: 40,
                    borderBottomRightRadius: 40,
                    paddingTop: StatusBar.currentHeight,
                }}>
                <View style={{ paddingHorizontal: 16 }}>
                    <RowComponent>
                        <TouchableOpacity onPress={() => navigation.openDrawer()}>
                            <HambergerMenu size={40} color={appColors.white} />
                        </TouchableOpacity>
                        <View style={[{ flex: 1, alignItems: 'center' }]}>
                            <RowComponent>
                                <TextComponent
                                    text="Current Location"
                                    color={appColors.white2}
                                    size={16}
                                />
                                <MaterialIcons
                                    name="arrow-drop-down"
                                    size={24}
                                    color={appColors.white}
                                />
                            </RowComponent>
                            {currentLocation && (
                                <TextComponent
                                    text={`${currentLocation.address.city},${currentLocation.address.countryName}`}
                                    flex={0}
                                    color={appColors.white}
                                    font={fontFamilies.medium}
                                    size={14}
                                />
                            )}
                        </View>

                        <CircleComponent color="#524CE0" size={40}>
                            <View>
                                <Notification size={28} color={appColors.white} />
                                <View
                                    style={{
                                        backgroundColor: '#02E9FE',
                                        width: 10,
                                        height: 10,
                                        borderRadius: 4,
                                        borderWidth: 2,
                                        borderColor: '#524CE0',
                                        position: 'absolute',
                                        top: -2,
                                        right: -2,
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
                                color={appColors.white}
                            />
                            <View
                                style={{
                                    width: 1,
                                    height: 20,
                                    marginHorizontal: 12,
                                    backgroundColor: '#A29EF0',
                                }}
                            />
                            <TextComponent
                                size={24}
                                text="Search..."
                                color='#A29EF0'
                                flex={1}
                            />
                        </RowComponent>
                        <TagComponent
                            label="Filters"
                            bgColor={'#5D56F3'}
                            icon={
                                <CircleComponent size={20} color={'#A29EF0'} >
                                    <MaterialIcons
                                        name="sort"
                                        size={20}
                                        color={appColors.primary}
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
                                <EventItem key={`event${index}`} item={item} type="card" />
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
                                        backgroundColor: appColors.primary3,
                                        paddingHorizontal: 28,
                                    },
                                ]}>
                                <TextComponent
                                    text="INVITE"
                                    font={fontFamilies.bold}
                                    color={appColors.white}
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
                                <EventItem key={`event${index}`} item={item} type="card" />
                            )}
                        />
                    ) : (
                        <LoadingComponent
                            isLoading={isLoading}
                            values={nearbyEvents.length}
                        />
                    )}
                </SectionComponent>
                <ButtonComponent
                    text="Test linking"
                    type="primary"
                    onPress={() => Linking.openURL('eventhub://app/asdasd')}
                />
            </ScrollView>
        </View>
    );
};

export default HomeScreen;
