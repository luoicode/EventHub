import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { TextComponent } from '../../components';

const EventsScreen = ({ navigation }: any) => {
  return (
    <View>
      <Text>EventsScreen</Text>
      <TouchableOpacity onPress={() => navigation.navigate('EventDetail', { id: '6617cf1df4a12ba294bd970c' })}>
        <TextComponent text='asdasd' />
      </TouchableOpacity>
    </View>
  );
};

export default EventsScreen;
