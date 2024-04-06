import { View, Text, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
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
  DropdownPicker,
  UploadImagePicker,
} from '../components';
import { authSelector } from '../redux/reducers/authReducer';
import { useSelector } from 'react-redux';
import userAPI from '../apis/userApi';
import { SelectModel } from '../models/SelectModel';
import { ImageOrVideo } from 'react-native-image-crop-picker';

const initValues = {
  title: '',
  description: '',
  location: {
    title: '',
    address: '',
  },
  users: [],
  imageUrl: '',
  authorID: '',
  startAt: Date.now(),
  endAt: Date.now(),
  date: Date.now(),
};

const AddNewScreen = () => {
  const auth = useSelector(authSelector);
  const [eventData, setEventData] = useState<any>({
    ...initValues,
    authorID: auth.id,
  });
  const [usersSelects, setUsersSelects] = useState<SelectModel[]>([]);
  const handlerChangeValue = (key: string, value: string | Date | string[]) => {
    const items = { ...eventData };
    items[`${key}`] = value;

    setEventData(items);
  };

  const [fileSelected, setFileSelected] = useState<any>();

  useEffect(() => {
    handlerGetAllUsers();
  }, []);

  const handlerGetAllUsers = async () => {
    const api = `/get-all`;

    try {
      const res: any = await userAPI.HandlerUser(api);

      if (res && res.data) {
        const items: SelectModel[] = [];

        res.data.forEach(
          (item: any) =>
            item.email &&
            items.push({
              label: item.email,
              value: item.id,
            }),
        );

        setUsersSelects(items);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handlerAddEvent = async () => {
    console.log(eventData);
  };

  const handlerFileSelected = (val: ImageOrVideo) => {
    setFileSelected(val);
    handlerChangeValue('photoUrl', val.path);
  };

  return (
    <ContainerComponent isScroll>
      <SectionComponent>
        <TextComponent text="Add New" title />
      </SectionComponent>
      <SectionComponent>
        {eventData.photoUrl || fileSelected ? (
          <Image
            resizeMode="cover"
            style={{ width: '100%', height: 250, marginBottom: 12 }}
            source={{
              uri: eventData.photoUrl ? eventData.photoUrl : fileSelected.uri,
            }}
          />
        ) : (
          <></>
        )}
        <UploadImagePicker
          onSelect={(val: any) =>
            val.type === 'url'
              ? handlerChangeValue('photoUrl', val.value as string)
              : handlerFileSelected(val.value)
          }
        />
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
        <DropdownPicker
          selected={eventData.category}
          values={[
            {
              label: 'Sport',
              value: 'sport',
            },
            {
              label: 'Food',
              value: 'food',
            },
            {
              label: 'Art',
              value: 'art',
            },
            {
              label: 'Music',
              value: 'music',
            },
            {
              label: 'Game',
              value: 'game',
            },
          ]}
          onSelect={val => handlerChangeValue('category', val)}
        />
        <RowComponent>
          <DateTimePicker
            label="Start at:"
            type="time"
            onSelect={val => handlerChangeValue('startAt', val)}
            selected={eventData.startAt}
          />
          <SpaceComponent width={20} />
          <DateTimePicker
            label="End at:"
            type="time"
            onSelect={val => handlerChangeValue('endAt', val)}
            selected={eventData.endAt}
          />
        </RowComponent>
        <DateTimePicker
          label="Date :"
          type="date"
          onSelect={val => handlerChangeValue('date', val)}
          selected={eventData.date}
        />
        <DropdownPicker
          label="Invited users"
          values={usersSelects}
          onSelect={(val: string | string[]) =>
            handlerChangeValue('users', val as string[])
          }
          selected={eventData.users}
          multible
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
        <InputComponent
          placeholder="Price"
          allowClear
          type="number-pad"
          value={eventData.price}
          onChange={val => {
            handlerChangeValue('price', val);
          }}
        />
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
