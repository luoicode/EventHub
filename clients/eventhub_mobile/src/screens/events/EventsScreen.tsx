import { SearchNormal1 } from 'iconsax-react-native';
import React, { useEffect, useState } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import eventAPI from '../../apis/eventApi';
import {
  ButtonComponent,
  ContainerComponent,
  EventItem,
  ListEventComponent,
  LoadingComponent,
  RadioButton,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent
} from '../../components';
import { appColors } from '../../constants/appColors';
import { EventModel } from '../../models/EventModel';
import { FlatList } from 'react-native-gesture-handler';
import { globalStyles } from '../../styles/globalStyles';
import { Image, View } from 'react-native';
import { LoadingModal } from '../../modals';

const EventsScreen = ({ navigation }: any) => {
  const [events, setEvents] = useState<EventModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [eventType, setEventType] = useState<string>('upcoming');
  useEffect(() => {
    getData();
  }, [eventType]);

  const getData = async () => {
    setIsLoading(true);
    await getEvents();

    setIsLoading(false)
  }

  const getEvents = async () => {
    const api = `/get-events${eventType === 'upcoming' ? '?isUpcoming=true' : '?isPastEvents=true'}`;

    try {
      const res = await eventAPI.HandlerEvent(api);
      setEvents(res.data)
    } catch (error) {
      console.log(error);
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
          text="No Upcoming Event"
          title
          size={24}
          styles={{ marginVertical: 12 }}
        />

        <View style={{ width: '70%' }}>
          <TextComponent
            text="There Are Currently No Events in the Calendar"
            size={18}
            color={appColors.gray4}
            styles={{ textAlign: 'center' }}
          />
        </View>
      </View>
      <SectionComponent styles={{}}>
        <ButtonComponent
          onPress={() => navigation.navigate('ExploreEvents')}
          text="EXPLORE EVENTS"
          type="primary"
        />
      </SectionComponent>
    </View>)

  return (
    <ContainerComponent
      title="Events"
      back
      right={

        <ButtonComponent
          icon={
            <MaterialIcons
              name="more-vert"
              size={26}
              color={appColors.primary5}
            />
          }
        />
      }
      isScroll={false}>
      <RadioButton selected={eventType} onSelect={(id: string) => setEventType(id)} data={[
        {
          label: "Upcoming", value: 'upcoming'
        },
        {
          label: "Past event", value: 'pastEvent'
        },
      ]} />
      {events.length > 0 ? (
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

export default EventsScreen;
