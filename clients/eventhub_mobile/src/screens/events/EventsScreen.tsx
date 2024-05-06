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

const EventsScreen = ({ navigation }: any) => {
  const [events, setEvents] = useState<EventModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setIsLoading(true);
    await getEvents();

    setIsLoading(false)
  }

  const getEvents = async () => {
    const api = `/get-events`;

    try {
      const res = await eventAPI.HandlerEvent(api);
      setEvents(res.data)
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <ContainerComponent
      back
      title="Events"
      right={
        <RowComponent >
          <ButtonComponent onPress={() => navigation.navigate('SearchEvents')}
            icon={<SearchNormal1 size={26} color={appColors.primary5} />}
          />
          <SpaceComponent width={16} />
          <ButtonComponent
            icon={
              <MaterialIcons
                name="more-vert"
                size={26}
                color={appColors.primary5}
              />
            }
          />
        </RowComponent>
      }
    >
      {events.length > 0 ? (
        <ListEventComponent items={events} />
      ) : (
        <LoadingComponent isLoading={isLoading} mess='Loading....' values={events.length} />
      )}
    </ContainerComponent>
  );
};

export default EventsScreen;
