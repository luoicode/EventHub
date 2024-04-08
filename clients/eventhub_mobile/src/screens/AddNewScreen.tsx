import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { ImageOrVideo } from 'react-native-image-crop-picker';
import { useSelector } from 'react-redux';
import userAPI from '../apis/userApi';
import {
  ButtonComponent,
  ChoiceLocation,
  ContainerComponent,
  DateTimePicker,
  DropdownPicker,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
  UploadImagePicker,
} from '../components';
import { SelectModel } from '../models/SelectModel';
import { authSelector } from '../redux/reducers/authReducer';
import { Validate } from '../utils/validate';
import { appColors } from '../constants/appColors';
import storage from '@react-native-firebase/storage';
import { EventModel } from '../models/EventModel';
import eventAPI from '../apis/eventApi';

const initValues = {
  title: '',
  description: '',
  locationTitle: '',
  locationAddress: '',
  position: {
    lat: '',
    long: '',
  },
  photoUrl: '',
  users: [],
  authorID: '',
  startAt: Date.now(),
  endAt: Date.now(),
  date: Date.now(),
  price: '',
  category: '',
};

const AddNewScreen = () => {
  const auth = useSelector(authSelector);
  const [eventData, setEventData] = useState<any>({
    ...initValues,
    authorID: auth.id,
  });
  const [usersSelects, setUsersSelects] = useState<SelectModel[]>([]);

  const [fileSelected, setFileSelected] = useState<any>();
  const [errorMess, setErrorMess] = useState<string[]>([]);

  useEffect(() => {
    handlerGetAllUsers();
  }, []);

  useEffect(() => {
    const mess = Validate.EventValidation(eventData);
    setErrorMess(mess);
  }, [eventData]);

  const handlerChangeValue = (key: string, value: string | Date | string[]) => {
    const items = { ...eventData };
    items[`${key}`] = value;

    setEventData(items);
  };
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
    if (fileSelected) {
      const filename = `${fileSelected.filename ?? `image-${Date.now()}`}.${fileSelected.path.split('.')[1]
        }`;
      const path = `images/${filename}`;

      const res = storage().ref(path).putFile(fileSelected.path);

      res.on(
        'state_changed',
        snap => {
          console.log(snap.bytesTransferred);
        },
        error => {
          console.log(error);
        },
        () => {
          storage()
            .ref(path)
            .getDownloadURL()
            .then(url => {
              eventData.photoUrl = url;

              handlePustEvent(eventData);
            });
        },
      );
    } else {
      handlePustEvent(eventData);
    }
  };

  const handlePustEvent = async (event: EventModel) => {
    const api = `/add-new`;
    try {
      const res = await eventAPI.HandlerEvent(api, event, 'post');

      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handlerFileSelected = (val: ImageOrVideo) => {
    setFileSelected(val);
    handlerChangeValue('photoUrl', val.path);
  };

  const handlerLocation = (val: any) => {
    const items = { ...eventData };
    items.position = val.position;
    items.locationAddress = val.address;

    setEventData(items);
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
          onChange={val => handlerChangeValue('title', val)}
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
          value={eventData.locationTitle}
          onChange={val => {
            handlerChangeValue('locationTitle', val);
          }}
        />
        <ChoiceLocation
          onSelect={val => {
            handlerLocation(val);
          }}
        />
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
      {errorMess.length > 0 && (
        <SectionComponent>
          {errorMess.map(mess => (
            <TextComponent
              styles={{ marginBottom: 12 }}
              text={mess}
              key={mess}
              color={appColors.danger}
            />
          ))}
        </SectionComponent>
      )}
      <SectionComponent>
        <ButtonComponent
          disabled={errorMess.length > 0}
          text="Add New"
          type="primary"
          onPress={handlerAddEvent}
        />
      </SectionComponent>
    </ContainerComponent>
  );
};

export default AddNewScreen;
