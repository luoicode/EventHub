import React, { useEffect, useState } from 'react';
import { FlatList, Image, View } from 'react-native';
import eventAPI from '../../apis/eventApi';
import { ButtonComponent, ContainerComponent, EventItem, SectionComponent, TextComponent } from '../../components';
import { EventModel } from '../../models/EventModel';
import { LoadingModal } from '../../modals';
import { globalStyles } from '../../styles/globalStyles';
import { appColors } from '../../constants/appColors';
import { AuthState, authSelector } from '../../redux/reducers/authReducer';
import { useSelector } from 'react-redux';

const FavouriteScreen = ({ navigation }: any) => {
    const [events, setEvents] = useState<EventModel[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const auth: AuthState = useSelector(authSelector);

    useEffect(() => {
        getEventsWithFollowers(auth.id);
    }, [auth.id]);

    const getEventsWithFollowers = async (userId: string) => {
        const api = `/events-with-followers?userId=${userId}`
        setIsLoading(true);
        try {
            const res = await eventAPI.HandlerEvent(api);
            setEvents(res.data);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderEmptyComponent = (
        <View style={{ flex: 1 }}>
            <View style={[globalStyles.center, { flex: 1 }]}>
                <Image
                    source={require('../../assets/images/empty_event.png')}
                    style={{ width: 202, height: 202 }}
                />
                <TextComponent
                    text="You have not followed any events yet."
                    title
                    size={24}
                    styles={{ marginVertical: 12 }}
                />

                <View style={{ width: '70%' }}>
                    <TextComponent
                        text="Click explore events to see current events."
                        size={18}
                        color={appColors.gray4}
                        styles={{ textAlign: 'center' }}
                    />
                </View>
            </View>
            <SectionComponent styles={{}}>
                <ButtonComponent
                    onPress={() => navigation.navigate('EventsScreen')}
                    text="EXPLORE EVENTS"
                    type="primary"
                />
            </SectionComponent>
        </View>
    );

    return (
        <ContainerComponent title='My Favourite' back isScroll={false}>
            {events && events.length > 0 ? (
                <FlatList
                    data={events}
                    renderItem={({ item }) => (
                        <EventItem
                            item={item}
                            key={item._id}
                            type="list"
                            styles={{ flex: 1, width: undefined }}
                        />
                    )}
                />
            ) : (
                renderEmptyComponent
            )}
            <LoadingModal visible={isLoading} />
        </ContainerComponent>
    );
};

export default FavouriteScreen;
