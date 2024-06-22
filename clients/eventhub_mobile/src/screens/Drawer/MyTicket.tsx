import React, { useEffect, useState } from 'react';
import { FlatList, Image, View } from 'react-native';
import { useSelector } from 'react-redux';
import eventAPI from '../../apis/eventApi';
import { ButtonComponent, ContainerComponent, EventItem, SectionComponent, TextComponent } from '../../components';
import { appColors } from '../../constants/appColors';
import { LoadingModal } from '../../modals';
import { EventModel } from '../../models/EventModel';
import { authSelector } from '../../redux/reducers/authReducer';
import { globalStyles } from '../../styles/globalStyles';

const MyTicket = ({ navigation }: any) => {
    const [bills, setBills] = useState<EventModel[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const auth = useSelector(authSelector);

    useEffect(() => {
        handlerPaySuccessfully();
    }, [auth.id]);

    const handlerPaySuccessfully = async () => {
        const api = `/success-bills?userId=${auth.id}`;
        setIsLoading(true);
        try {
            const res = await eventAPI.HandlerEvent(api);
            const sortedBills = res.data.sort((a: any, b: any) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
            setBills(sortedBills);
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
                    text="You have not purchased any tickets yet."
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
        <ContainerComponent back title='My Ticket'>
            {bills && bills.length > 0 ? (
                <FlatList
                    data={bills}
                    renderItem={({ item }) => (
                        <EventItem
                            item={item}
                            key={item._id}
                            type="list"
                            styles={{ flex: 1, width: undefined }}
                            disabled={true}
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

export default MyTicket;
