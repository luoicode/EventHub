import { View, Text } from 'react-native';
import React, { useState } from 'react';
import {
  ButtonComponent,
  ContainerComponent,
  InputComponent,
  SectionComponent,
  TextComponent,
  ChoiceLocation,
  RowComponent,
  DateTimePicker,
  SpaceComponent,
} from '../components';
import { authSelector } from '../redux/reducers/authReducer';
import { useSelector } from 'react-redux';
import userAPI from '../apis/userApi';

const initValues = {
  title: '',
  description: '',
  location: {
    title: '',
    address: '',
  },
  users: [''],
  imageUrl: '',
  authorID: '',
  startAt: Date.now(),
  endAt: Date.now(),
  date: Date.now(),
  image: '',
  tags: [],
};

const AddNewScreen = () => {
  const auth = useSelector(authSelector);
  const [eventData, setEventData] = useState<any>({
    ...initValues,
    authorID: auth.id,
  });

  const handlerChangeValue = (key: string, value: string | Date) => {
    const items = { ...eventData };
    items[`${key}`] = value;

    setEventData(items);
  };

  const handlerAddEvent = async () => {
    const res = await userAPI.HandlerUser('/')
  };

  return (
    <ContainerComponent isScroll>
      <SectionComponent>
        <TextComponent text="Add New" title />
      </SectionComponent>
      <SectionComponent>
        <InputComponent
          placeholder="Title"
          value={eventData.title}
          allowClear
          onChange={val => {
            handlerChangeValue('title', val);
          }}
        />
        <InputComponent
          placeholder="Description"
          multiline
          numberOfLine={3}
          allowClear
          value={eventData.description}
          onChange={val => {
            handlerChangeValue('description', val);
          }}
        />
        <RowComponent>
          <DateTimePicker
            label='Start at:'
            type="time"
            onSelect={val => handlerChangeValue('startAt', val)}
            selected={eventData.startAt}
          />
          <SpaceComponent width={20} />
          <DateTimePicker
            label='End at:'
            type="time"
            onSelect={val => handlerChangeValue('endAt', val)}
            selected={eventData.endAt}
          />

        </RowComponent>
        <DateTimePicker
          label='Date :'
          type="date"
          onSelect={val => handlerChangeValue('date', val)}
          selected={eventData.date}
        />
        <InputComponent
          placeholder="Title Address"
          styles={{ height: 56 }}
          allowClear
          value={eventData.location.title}
          onChange={val => {
            handlerChangeValue('location', { ...eventData.location, title: val });
          }}
        />
        <ChoiceLocation />
      </SectionComponent>
      <SectionComponent>
        <ButtonComponent
          text="Add New"
          type="primary"
          onPress={handlerAddEvent}
        />
      </SectionComponent>
    </ContainerComponent>
  );
};

export default AddNewScreen;
