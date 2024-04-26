import { View, Text } from 'react-native';
import React from 'react';
import { EventModel } from '../models/EventModel';
import { FlatList } from 'react-native-gesture-handler';
import EventItem from './EventItem';
import { appColors } from '../constants/appColors';

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
          styles={{ flex: 1, width: undefined, backgroundColor: appColors.primary6 }}
        />
      )}
    />
  );
};

export default ListEventComponent;
