import storage from '@react-native-firebase/storage';
import React, { useEffect, useState } from 'react';
import { Image, TextInput, TouchableOpacity } from 'react-native';
import { ImageOrVideo } from 'react-native-image-crop-picker';
import { useSelector } from 'react-redux';
import eventAPI from '../apis/eventApi';
import userAPI from '../apis/userApi';
import {
  ButtonComponent,
  ChoiceLocation,
  ContainerComponent,
  DateTimePicker,
  DropdownPicker,
  InputAddNewScreen,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
  UploadImagePicker,
} from '../components';
import { appColors } from '../constants/appColors';
import { EventModel } from '../models/EventModel';
import { SelectModel } from '../models/SelectModel';
import { authSelector } from '../redux/reducers/authReducer';
import { Validate } from '../utils/validate';
import { LoadingModal } from '../modals';
import { Sort } from 'iconsax-react-native';

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
  authorId: '',
  startAt: Date.now(),
  endAt: Date.now(),
  date: Date.now(),
  price: '',
  categories: '',
};

const AddNewScreen = ({ navigation }: any) => {
  const auth = useSelector(authSelector);
  const [eventData, setEventData] = useState<any>({
    ...initValues,
    authorId: auth.id,
  });
  const [usersSelects, setUsersSelects] = useState<SelectModel[]>([]);

  const [fileSelected, setFileSelected] = useState<any>();
  const [errorMess, setErrorMess] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [categories, setCategories] = useState<SelectModel[]>([]);

  useEffect(() => {
    handlerGetAllUsers();
    getCategories();
  }, []);

  useEffect(() => {
    const mess = Validate.EventValidation(eventData);
    setErrorMess(mess);
  }, [eventData]);

  const getCategories = async () => {
    const api = `/get-categories`;

    try {
      const res = await eventAPI.HandlerEvent(api);
      if (res.data) {
        const items: SelectModel[] = []

        const data = res.data
        data.forEach((item: any) =>
          items.push({
            label: item.title,
            value: item._id
          })
        )
        setCategories(items)

      }

    } catch (error) {
      console.log(error);
    }
  };
  const handlerChangeValue = (key: string, value: string | number | string[]) => {
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
          // console.log(snap.bytesTransferred);
        },
        error => {
          // console.log(error);
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

    setIsCreating(true)
    try {
      const res = await eventAPI.HandlerEvent(api, event, 'post');
      setIsCreating(false)

      navigation.navigate('Explore', {
        screen: 'HomeScreen',
      });
    } catch (error) {
      setIsCreating(false)

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
        <TextComponent text="Create New Event" title />
      </SectionComponent>
      <SectionComponent>

        <InputAddNewScreen
          styles={{}}
          placeholder="Add title"
          fontSize={30}
          value={eventData.title}
          onChange={val => handlerChangeValue('title', val)}
        />
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
        {/* <InputComponent
          placeholder="Add title"
          value={eventData.title}
          allowClear
          onChange={val => handlerChangeValue('title', val)}
        /> */}
        <RowComponent justify='center' styles={{ backgroundColor: "coral" }}>
          <Sort color='red' size={20} />
          <InputAddNewScreen
            placeholder="Add description"
            multiline
            value={eventData.description}
            onChange={val => {
              handlerChangeValue('description', val);
            }}
          />
        </RowComponent>
        <InputAddNewScreen
          placeholder="Add location"
          styles={{ height: 56 }}
          value={eventData.locationTitle}
          onChange={val => {
            handlerChangeValue('locationTitle', val);
          }}
        />
        <SpaceComponent height={5} />
        <ChoiceLocation
          onSelect={val => {
            handlerLocation(val);
          }}
        />
        <TouchableOpacity>

        </TouchableOpacity>
        <DropdownPicker
          selected={eventData.categories}
          values={categories}
          onSelect={val => handlerChangeValue('categories', val)}
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

        <SpaceComponent height={5} />
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
      <LoadingModal visible={isCreating} />
    </ContainerComponent>
  );
};

export default AddNewScreen;
