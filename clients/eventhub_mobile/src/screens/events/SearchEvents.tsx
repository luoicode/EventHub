import { useIsFocused } from '@react-navigation/native';
import { SearchNormal1 } from 'iconsax-react-native';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import eventAPI from '../../apis/eventApi';
import {
  CircleComponent,
  ContainerComponent,
  ListEventComponent,
  LoadingComponent,
  RowComponent,
  SectionComponent,
  TagComponent,
} from '../../components';
import { appColors } from '../../constants/appColors';
import { EventModel } from '../../models/EventModel';
import { globalStyles } from '../../styles/globalStyles';

const SearchEvents = ({ navigation, route }: any) => {
  const [events, setEvents] = useState<EventModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    isFocused && getEvents();
  }, [isFocused]);

  const getEvents = async () => {
    const api = `/get-events`;

    if (events.length === 0) {
      setIsLoading(true);
    }

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
    <ContainerComponent back title="Search">
      <SectionComponent>
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
              color={appColors.primary}
            />
            <View
              style={{
                width: 1,
                height: 20,
                marginHorizontal: 12,
                backgroundColor: appColors.primary,
              }}
            />
            <TextInput
              style={[globalStyles.text, { flex: 1 }]}
              placeholder="Search"
              value=""
              onChangeText={val => console.log(val)}
            />
          </RowComponent>
          <TagComponent
            label="Filters"
            bgColor={appColors.primary}
            icon={
              <CircleComponent size={20} color={appColors.white}>
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
      </SectionComponent>
      {events.length > 0 ? (
        <ListEventComponent items={events} />
      ) : (
        <LoadingComponent isLoading={isLoading} values={events.length} />
      )}
    </ContainerComponent>
  );
};

export default SearchEvents;
