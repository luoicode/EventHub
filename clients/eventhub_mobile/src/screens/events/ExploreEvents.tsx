import { SearchNormal1 } from 'iconsax-react-native';
import React, { useEffect, useState } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import eventAPI from '../../apis/eventApi';
import {
    ButtonComponent,
    ContainerComponent,
    ListEventComponent,
    LoadingComponent,
    RowComponent,
    SpaceComponent
} from '../../components';
import { appColors } from '../../constants/appColors';
import { EventModel } from '../../models/EventModel';

const ExploreEvents = ({ navigation }: any) => {
    const [events, setEvents] = useState<EventModel[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getEvents();
    }, []);

    const getEvents = async () => {
        const api = `/get-events`;

        setIsLoading(true);

        try {
            const res = await eventAPI.HandlerEvent(api);

            if (res.data) {
                setEvents(res.data);
            }
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    return (
        <ContainerComponent
            back
            title="Events"
            right={
                <RowComponent>
                    <ButtonComponent onPress={() => navigation.navigate('SearchEvents')}
                        icon={<SearchNormal1 size={26} color={appColors.text} />}
                    />
                    <SpaceComponent width={16} />
                    <ButtonComponent
                        icon={
                            <MaterialIcons
                                name="more-vert"
                                size={26}
                                color={appColors.text}
                            />
                        }
                    />
                </RowComponent>
            }>
            {events.length > 0 ? (
                <ListEventComponent items={events} />
            ) : (
                <LoadingComponent isLoading={isLoading} values={events.length} />
            )}
        </ContainerComponent>
    );
};

export default ExploreEvents;
