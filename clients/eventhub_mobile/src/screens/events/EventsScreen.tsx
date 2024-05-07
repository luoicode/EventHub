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

      <FlatList
        contentContainerStyle={{ flex: 1 }}
        ListEmptyComponent={
          <View style={[globalStyles.center, { flex: 1 }]}>
            <Image source={require('../../assets/images/empty_event.png')}
              style={{ width: 302, height: 302 }} />
            <TextComponent text='No Upcoming Event' title size={26} styles={{ marginVertical: 12 }} />
            <View style={{ width: '50%' }}>
              <TextComponent text='No Upcoming Event' size={18} color={appColors.gray} />
            </View>
          </View>
        }
        data={events}
        renderItem={({ item }) => (
          <EventItem
            item={item}
            key={item._id}
            type="list"
            styles={{ flex: 1, width: undefined, backgroundColor: appColors.primary7 }}
          />
        )}
      />

    </ContainerComponent>
  );
};

export default EventsScreen;
