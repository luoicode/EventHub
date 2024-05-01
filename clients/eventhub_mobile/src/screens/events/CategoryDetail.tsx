import React, { useEffect, useState } from 'react';
import eventAPI from '../../apis/eventApi';
import {
    ContainerComponent,
    ListEventComponent,
    LoadingComponent
} from '../../components';
import { EventModel } from '../../models/EventModel';

const CategoryDetail = ({ navigation, route }: any) => {
    const { id, title }: { id: string; title: string } = route.params;

    const [isLoading, setIsLoading] = useState(false);
    const [events, setEvents] = useState<EventModel[]>([]);

    useEffect(() => {
        id && getData();
    }, [id]);

    const getData = async () => {
        setIsLoading(true);

        await getEventById();

        setIsLoading(false);
    };

    const getEventById = async () => {
        const api = `/get-events-by-categoryid?id=${id}`;

        try {
            const res = await eventAPI.HandlerEvent(api);
            setEvents(res.data);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <ContainerComponent title={title} back isScroll={false}>
            {events.length > 0 ? (
                <ListEventComponent items={events} />

            ) : (
                <LoadingComponent isLoading={isLoading} values={events.length} />
            )}
        </ContainerComponent>
    );
};

export default CategoryDetail;
