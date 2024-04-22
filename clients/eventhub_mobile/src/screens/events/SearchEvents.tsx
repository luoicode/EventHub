import { useIsFocused } from '@react-navigation/native';
import { SearchNormal1 } from 'iconsax-react-native';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
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
  TextComponent,
} from '../../components';
import { appColors } from '../../constants/appColors';
import { EventModel } from '../../models/EventModel';
import { globalStyles } from '../../styles/globalStyles';
import { debounce } from 'lodash'
import { LoadingModal } from '../../modals';

const SearchEvents = ({ navigation, route }: any) => {
  const [events, setEvents] = useState<EventModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const [results, setResults] = useState<EventModel[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    isFocused && getEvents();
  }, [isFocused]);

  useEffect(() => {
    if (!searchKey) {
      setResults(events)
    } else {
      const handerChangeSearchValue = debounce(handlerSearchEvent, 500)

      handerChangeSearchValue();
    }
  }, [searchKey])

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

  const handlerSearchEvent = async () => {
    const api = `/search-events?title=${searchKey}`



    try {
      const res = await eventAPI.HandlerEvent(api)
      if (res.data && res.data.length > 0) {

        setResults(res.data)
      } else {
        setResults([])
      }
      setIsSearching(false)
    } catch (error) {
      console.log(error)
      setIsSearching(false)
    }
  }

  // const handlerUpdateEvent = async () => {
  //   const categories = ['662103c304c2c69a1036c29f']
  //   try {
  //     events.forEach(async item => {
  //       const api = `/update-event?id=${item._id}`

  //       const res = await eventAPI.HandlerEvent(api, { data: { categories }, }, 'put')
  //       console.log(res)
  //     })
  //   } catch (error) {
  //     console.log(error)
  //   }


  // }

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
              value={searchKey}
              onChangeText={val => setSearchKey(val)}
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
      {results.length > 0 ? (
        <ListEventComponent items={results} />
      ) : (
        <LoadingComponent isLoading={isLoading} values={results.length} />
      )}
    </ContainerComponent>
  );
};

export default SearchEvents;
