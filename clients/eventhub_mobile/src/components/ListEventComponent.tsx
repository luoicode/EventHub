import React from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { appColors } from '../constants/appColors';
import { EventModel } from '../models/EventModel';
import EventItem from './EventItem';

interface Props {
  items: EventModel[];
}

const ListEventComponent = (props: Props) => {
  const { items } = props;
  return (
    <FlatList
      data={items}
      renderItem={({ item }) => (
        <EventItem
          item={item}
          key={item._id}
          type="list"
          styles={{ flex: 1, width: undefined, backgroundColor: appColors.primary7 }}
        />
      )}
    />
  );
};

export default ListEventComponent;
