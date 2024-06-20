import { View, Text, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import eventAPI from '../../apis/eventApi';
import { ContainerComponent, EventItem, RowComponent, TextComponent } from '../../components';
import { appColors } from '../../constants/appColors';
import { fontFamilies } from '../../constants/fontFamilies';
import { EventModel } from '../../models/EventModel';

const MyTicket = () => {
    const [bills, setBills] = useState<EventModel[]>([]);

    useEffect(() => {
        handlerPaySuccessfully();
    }, []);

    const handlerPaySuccessfully = async () => {
        const api = `/success-bills`;

        try {
            const res = await eventAPI.HandlerEvent(api);

            setBills(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <ContainerComponent back title='My Ticket'>
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
        </ContainerComponent>
    );
};

export default MyTicket;
