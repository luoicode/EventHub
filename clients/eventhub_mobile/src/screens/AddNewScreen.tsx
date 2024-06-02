import storage from '@react-native-firebase/storage';
import { BrushSquare, Category, People } from 'iconsax-react-native';
import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { ImageOrVideo } from 'react-native-image-crop-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
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
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
  UploadImagePicker
} from '../components';
import { appColors } from '../constants/appColors';
import { LoadingModal } from '../modals';
import { EventModel } from '../models/EventModel';
import { SelectModel } from '../models/SelectModel';
import { authSelector } from '../redux/reducers/authReducer';
import { Validate } from '../utils/validate';
import { dateTime } from '../utils/dateTime';

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

              handlerPushEvent(eventData);
            });
        },
      );
    } else {
      handlerPushEvent(eventData);
    }
  };

  const handlerPushEvent = async (event: EventModel) => {
    const api = `/add-new`;

    setIsCreating(true);
    try {
      event.startAt = dateTime.getEventTime(event.date, event.startAt)
      event.endAt = dateTime.getEventTime(event.date, event.endAt)

      const res = await eventAPI.HandlerEvent(api, event, 'post');

      setIsCreating(false);
      navigation.navigate('Home', {
        screen: 'HomeScreen',
      });
    } catch (error) {
      setIsCreating(false);
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
    <ContainerComponent back isScroll title="Create New Event">
      <SectionComponent>
        <InputAddNewScreen
          styles={{}}
          placeholder="Add title"
          fontSize={28}
          multiline
          value={eventData.title}
          onChange={val => handlerChangeValue('title', val)}
        />
        <SpaceComponent height={8} />
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
        <SpaceComponent height={8} />
        <RowComponent justify='flex-start' styles={{ alignItems: 'center' }} >
          <MaterialCommunityIcons name='sort-variant'
            color={appColors.primary5} size={30} />
          <InputAddNewScreen
            placeholder="Add description"
            multiline
            numberOfLine={3}
            value={eventData.description}
            onChange={val => {
              handlerChangeValue('description', val);
            }}
          />
        </RowComponent>
        {/* <SpaceComponent height={8} /> */}
        <RowComponent justify='flex-start'>
          <Category
            size="32"
            color="orange"
          />
          <DropdownPicker
            selected={eventData.categories}
            values={categories}
            onSelect={val => handlerChangeValue('categories', val)}
          />
        </RowComponent>
        <SpaceComponent height={20} />
        <RowComponent>
          <DateTimePicker
            type="time"
            onSelect={val => handlerChangeValue('startAt', val)}
            selected={eventData.startAt}
          />
          <TextComponent text='to' />
          <SpaceComponent width={70} />
          <DateTimePicker
            type="time"
            onSelect={val => handlerChangeValue('endAt', val)}
            selected={eventData.endAt}
          />
        </RowComponent>
        <SpaceComponent height={20} />
        <DateTimePicker
          type="date"
          onSelect={val => handlerChangeValue('date', val)}
          selected={eventData.date}
        />
        <SpaceComponent height={8} />
        <RowComponent justify='flex-start' styles={{ alignItems: 'center' }} >
          <BrushSquare
            color={appColors.primary3} size={30} />
          <InputAddNewScreen
            placeholder="Add location title"
            value={eventData.locationTitle}
            onChange={val => {
              handlerChangeValue('locationTitle', val);
            }}
          />
        </RowComponent>
        <SpaceComponent height={8} />
        <ChoiceLocation
          onSelect={val => {
            handlerLocation(val);
          }}
        />
        <SpaceComponent height={12} />

        <RowComponent justify='flex-start'>
          <People
            size="32"
            color={appColors.primary6}
          />
          <DropdownPicker
            values={usersSelects}
            onSelect={(val: string | string[]) =>
              handlerChangeValue('users', val as string[])
            }
            selected={eventData.users}
            multible
          />
        </RowComponent>
        <RowComponent justify='flex-start' styles={{ alignItems: 'center' }} >
          <MaterialIcons name='attach-money' size={30} color={appColors.danger} />
          <InputAddNewScreen
            placeholder="Add price"
            type="number-pad"
            value={eventData.price}
            onChange={val => {
              handlerChangeValue('price', val);
            }}
          />
        </RowComponent>
      </SectionComponent>
      {errorMess.length > 0 && (
        <SectionComponent>
          <TextComponent
            styles={{ marginBottom: 12 }}
            text="Please enter complete information!"
            color={appColors.danger}
          />
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
