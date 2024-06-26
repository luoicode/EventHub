import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  ButtonComponent,
  ContainerComponent,
  EventItem,
  ListEventComponent,
  LoadingComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../../components';
import Feather from 'react-native-vector-icons/Feather';
import { appColors } from '../../../constants/appColors';
import { globalStyles } from '../../../styles/globalStyles';
import { fontFamilies } from '../../../constants/fontFamilies';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import {
  authSelector,
  updateFollowing,
} from '../../../redux/reducers/authReducer';
import { ProfileModel } from '../../../models/ProfileModel';
import userAPI from '../../../apis/userApi';
import { LoadingModal } from '../../../modals';
import eventAPI from '../../../apis/eventApi';
import { EventModel } from '../../../models/EventModel';
import Review from './Review';
import Interest from './Interest';

interface Props {
  profile: ProfileModel;
}

const AboutProfile = (props: Props) => {
  const { profile } = props;
  const [events, setEvents] = useState<EventModel[]>([]);
  const [tabSelected, setTabSelected] = useState('about');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    setIsLoading(true);
    await getEvents();

    setIsLoading(false)
  }
  const tabs = [
    {
      key: 'about',
      title: 'ABOUT',
    },
    {
      key: 'event',
      title: 'EVENT',
    },
    {
      key: 'reviews',
      title: 'REVIEWS',
    },
  ];

  const auth = useSelector(authSelector);
  const dispatch = useDispatch();

  const rednerTabContent = (id: string) => {
    let content = <></>;

    switch (id) {
      case 'about':
        content = (
          <>
            <TextComponent text={profile.bio} />
            <Interest profile={profile || {}} />
          </>
        );
        break;
      case 'event':
        content = (
          <>
            {events.length > 0 ? (
              <FlatList
                showsHorizontalScrollIndicator={false}
                horizontal
                data={events.filter(event => event.authorId === profile.uid)}
                renderItem={({ item, index }) => (
                  <EventItem key={`event${index}`} item={item} type="card" />
                )}
              />
            ) : (
              <LoadingComponent isLoading={isLoading} values={events.length} />
            )}
          </>
        );
        break;
      case 'reviews':
        content = (
          <>
            <Review />
          </>
        );
        break;
      default:
        content = <></>;
        break;
    }

    return content;
  };
  const getEvents = async () => {
    const api = `/get-events`;

    try {
      const res = await eventAPI.HandlerEvent(api);
      setEvents(res.data)
    } catch (error) {
      console.log(error);
    }
  };
  const handlerToggleFollowing = async () => {
    const api = `/update-following`;
    setIsLoading(true);

    try {
      const res = await userAPI.HandlerUser(
        api,
        {
          uid: auth.id,
          authorId: profile.uid,
        },
        'put',
      );

      dispatch(updateFollowing(res.data));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      console.log(error);
    }
  };

  return (
    <>
      <SectionComponent>
        <RowComponent >
          <ButtonComponent
            type='primary'
            iconFlex='left'
            onPress={handlerToggleFollowing}
            styles={[
              globalStyles.button,
              {
                marginLeft: 50,
                width: 'auto',
                flex: 1,
                borderWidth: 1,
                borderColor:
                  auth.following && auth.following.includes(profile.uid)
                    ? appColors.danger
                    : appColors.primary5,
                backgroundColor:
                  auth.following && auth.following.includes(profile.uid)
                    ? appColors.danger
                    : appColors.white,
              },
            ]}
            icon={
              <Feather
                name={
                  auth.following && auth.following.includes(profile.uid)
                    ? 'user-minus'
                    : 'user-plus'
                }
                size={26}
                color={
                  auth.following && auth.following.includes(profile.uid)
                    ? appColors.white
                    : appColors.primary5
                }
              />
            }
          />
          <SpaceComponent width={20} />
          <ButtonComponent
            type='primary'
            iconFlex='left'
            text='Message'
            textColor={appColors.primary5}
            onPress={() => { }}
            styles={[globalStyles.button, {
              flex: 1,
              borderWidth: 1,
              borderColor: appColors.primary5,
              backgroundColor: appColors.primary7
            },
            ]}
            icon={
              <Ionicons
                name='chatbubbles-outline'
                size={26}
                color={appColors.primary5}
              />
            }
          />
        </RowComponent>
      </SectionComponent>


      {/* About event reviews */}

      <SectionComponent >
        <RowComponent >
          {tabs.map(item => (
            <TouchableOpacity
              onPress={() => setTabSelected(item.key)}
              style={[
                globalStyles.center,
                {
                  flex: 1,
                },
              ]}
              key={item.key}>
              <TextComponent
                color={
                  item.key === tabSelected ? appColors.primary3 : appColors.text
                }
                text={item.title}
                size={18}
                font={
                  item.key === tabSelected
                    ? fontFamilies.medium
                    : fontFamilies.regular
                }
              />
              <View
                style={{
                  width: 80,
                  flex: 0,
                  marginTop: 6,
                  borderRadius: 100,
                  height: 3,
                  backgroundColor:
                    item.key === tabSelected
                      ? appColors.primary3
                      : appColors.white,
                }}
              />
            </TouchableOpacity>
          ))}

        </RowComponent>
        <SpaceComponent height={20} />
        {rednerTabContent(tabSelected)}
      </SectionComponent>
      <LoadingModal visible={isLoading} />
    </>
  );
};

export default AboutProfile;
