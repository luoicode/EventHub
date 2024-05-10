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

const EventsScreen = ({ navigation }: any) => {
  const [events, setEvents] = useState<EventModel[]>([]);
  const [filterKey, setfilterKey] = useState('upcoming');
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
      // setEvents(res.data)
    } catch (error) {
      console.log(error);
    }
  };
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
      }>
      <RadioButton selected={filterKey} onSelect={(id: string) => setfilterKey(id)} data={[
        {
          label: "Upcoming", value: 'upcoming'
        },
        {
          label: "Past event", value: 'pastEvent'
        },
      ]} />
      <FlatList
        contentContainerStyle={{ flex: 1 }}
        ListEmptyComponent={
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
                size={16}
                color={appColors.gray4}
                styles={{ textAlign: 'center' }}
              />
            </View>
          </View>
        }
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
      {events.length === 0 && (
        <SectionComponent styles={{}}>
          <ButtonComponent
            onPress={() => navigation.navigate('ExploreEvents')}
            text="EXPLORE EVENTS"
            type="primary"
          />
        </SectionComponent>
      )}
    </ContainerComponent>
  );
};

export default EventsScreen;
