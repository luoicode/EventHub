import { useIsFocused } from '@react-navigation/native';
import { SearchNormal1 } from 'iconsax-react-native';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import eventAPI from '../../apis/eventApi';
import {
  ContainerComponent,
  ListEventComponent,
  LoadingComponent,
  RowComponent,
  SectionComponent
} from '../../components';
import { appColors } from '../../constants/appColors';
import { EventModel } from '../../models/EventModel';
import { globalStyles } from '../../styles/globalStyles';
import { LoadingModal, ModalFilterEvents } from '../../modals';

const eventBaseUrl = '/get-events';

const SearchEvents = ({ navigation, route }: any) => {
  const [searchKey, setSearchKey] = useState('');
  const [results, setResults] = useState<EventModel[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isVisibleModalFilter, setIsVisibleModalFilter] = useState(false);

  useEffect(() => {
    handlerSearchEvent(eventBaseUrl)
  }, [])

  useEffect(() => {
    if (route.params) {
      setIsVisibleModalFilter(true);
    }
  }, [route.params]);


  useEffect(() => {
    if (searchKey) {

      const handerChangeSearchValue = debounce(handlerSearchWithTitle, 500)

      handerChangeSearchValue();
    }
  }, [searchKey])

  const handlerSearchWithTitle = () => {
    handlerSearchEvent(`${eventBaseUrl}?title=${searchKey}`);
  }


  const handlerSearchEvent = async (api: string) => {
    setIsSearching(true)
    try {
      const res = await eventAPI.HandlerEvent(api)

      setResults(res.data && res.data.length > 0 ? res.data : []);
      setIsSearching(false)
    } catch (error) {
      console.log(error)
      setIsSearching(false)
    }
  }

  return (
    <ContainerComponent back title="Search">
      <SectionComponent>
        <RowComponent>
          <RowComponent
            styles={{ flex: 1 }}
          >
            <SearchNormal1
              variant="TwoTone"
              size={30}
              color={appColors.primary5}
            />
            <View
              style={{
                width: 1,
                height: 20,
                marginHorizontal: 12,
                backgroundColor: appColors.primary5,
              }}
            />
            <TextInput
              style={[globalStyles.text, { flex: 1 }]}
              placeholder="Search"
              placeholderTextColor={appColors.primary5}
              value={searchKey}
              onChangeText={val => setSearchKey(val)}
            />
          </RowComponent>
          <TouchableOpacity
            onPress={() =>
              setIsVisibleModalFilter(true)
            }
          >
            <MaterialIcons
              name="sort"
              size={30}
              color={appColors.primary5}
            />
          </TouchableOpacity>
        </RowComponent>
      </SectionComponent>
      <ListEventComponent items={results} />
      <LoadingModal visible={isSearching} />
      <ModalFilterEvents
        visible={isVisibleModalFilter}
        onClose={() => setIsVisibleModalFilter(false)}
        onFilter={vals => handlerSearchEvent(vals)}
      />
    </ContainerComponent>
  );
};

export default SearchEvents;
