import {View, Text} from 'react-native';
import React, {useState} from 'react';
import {
  ButtonComponent,
  ContainerComponent,
  InputComponent,
  SectionComponent,
  TextComponent,
  ChoiceLocation,
} from '../components';
import {authSelector} from '../redux/reducers/authReducer';
import {useSelector} from 'react-redux';

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

  const handlerChangeValue = (key: string, value: string) => {
    const items = {...eventData};
    items[`${key}`] = value;

    setEventData(items);
  };

  const handlerAddEvent = async () => {
    console.log(eventData);
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
