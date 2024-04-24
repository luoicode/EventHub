import { ArrowLeft, ArrowRight, Calendar, Location } from 'iconsax-react-native';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  TouchableOpacity,
  View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import eventAPI from '../../apis/eventApi';
import userAPI from '../../apis/userApi';
import {
  AvatarGroup,
  ButtonComponent,
  CardComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TabBarComponent,
  TagComponent,
  TextComponent,
} from '../../components';
import { appColors } from '../../constants/appColors';
import { appInfo } from '../../constants/appInfos';
import { fontFamilies } from '../../constants/fontFamilies';
import { LoadingModal } from '../../modals';
import ModalInvite from '../../modals/ModalInvite';
import { EventModel } from '../../models/EventModel';
import { ProfileModel } from '../../models/ProfileModel';
import {
  AuthState,
  authSelector,
  updateFollowing,
} from '../../redux/reducers/authReducer';
import { globalStyles } from '../../styles/globalStyles';
import { UserHandler } from '../../utils/UserHandlers';
import { dateTime } from '../../utils/dateTime';

const EventDetail = ({ navigation, route }: any) => {
  const { id }: { id: string } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [followers, setFollowers] = useState<string[]>([]);
  const [profile, setProfile] = useState<ProfileModel>();
  const [isVisibleModalInvite, setIsVisibleModalInvite] = useState(false);
  const [item, setItem] = useState<EventModel>();


  const auth: AuthState = useSelector(authSelector);
  const dispatch = useDispatch();


  useEffect(() => {
    if (id) {
      getEventById();
      getFollowersByID();
    }
  }, [id]);

  useEffect(() => {
    if (item) {
      getProfile(item.authorId);
    }
  }, [item]);

  const getFollowersByID = async () => {
    const api = `/followers?id=${id}`;

    try {
      const res = await eventAPI.HandlerEvent(api);
      res && res.data && setFollowers(res.data);
    } catch (error) {
      console.log(`Cann't get followers by event id ${error}`);
    }
  };

  const handlerFollower = () => {
    const items = [...followers];

    if (items.includes(auth.id)) {
      const index = items.findIndex(element => element === auth.id);

      if (index !== -1) {
        items.splice(index, 1);
      }
    } else {
      items.push(auth.id);
      handlerUpdateFollowers(items);
    }
    setFollowers(items);
  };

  const handlerUpdateFollowers = async (data: string[]) => {
    await UserHandler.getFollowersById(auth.id, dispatch);

    const api = `/update-followers`;

    try {
      await eventAPI.HandlerEvent(
        api,
        {
          id,
          followers: data,
        },
        'post',
      );
    } catch (error) {
      console.log(`Can not update followers in Event detail line 63, ${error}`);
    }
  };
  const getProfile = async (id: string) => {
    const api = `/get-profile?uid=${id}`;

    setIsLoading(true);
    try {
      const res = await userAPI.HandlerUser(api);
      res && res.data && setProfile(res.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handlerToggleFollowing = async (id: string) => {
    const api = `/update-following`;
    setIsLoading(true);

    try {
      const res = await userAPI.HandlerUser(
        api,
        {
          uid: auth.id,
          authorId: id,
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

  const getEventById = async () => {
    const api = `/get-event?id=${id}`;


    try {
      const res: any = await eventAPI.HandlerEvent(api);

      setItem(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return item ? (
    <View style={{ flex: 1, backgroundColor: appColors.white }}>
      <View
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          zIndex: 3,
        }}>
        <LinearGradient colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0)']}>
          <RowComponent
            styles={{
              padding: 16,
              alignItems: 'flex-end',
              paddingTop: 42,
            }}>
            <RowComponent styles={{ flex: 1 }}>
              <TouchableOpacity
                onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Main')}
                style={{ width: 48, height: 48, justifyContent: 'center' }}>
                <ArrowLeft size={28} color={appColors.white} />
              </TouchableOpacity>
              <TextComponent
                flex={1}
                text="Event Details"
                title
                color={appColors.white}
              />
              <CardComponent
                onPress={handlerFollower}
                styles={[globalStyles.noSpaceCard, { width: 36, height: 36 }]}
                color={
                  auth.follow_events && auth.follow_events.includes(item._id)
                    ? '#ffffffB3'
                    : '#ffffff4D'
                }>
                <MaterialIcons
                  name="bookmark"
                  color={
                    auth.follow_events && auth.follow_events.includes(item._id)
                      ? appColors.danger2
                      : appColors.white
                  }
                  size={28}
                />
              </CardComponent>
            </RowComponent>
          </RowComponent>
        </LinearGradient>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
        }}>
        <Image
          source={{ uri: item.photoUrl }}
          style={{ width: appInfo.sizes.WIDTH, height: 240, resizeMode: 'cover' }}
        />
        <SectionComponent styles={{ marginTop: -20 }}>
          {item.users && item.users.length > 0 ? (
            <View
              style={{
                justifyContent: 'center',
                flex: 1,
                alignItems: 'center',
              }}>
              <RowComponent
                justify="space-between"
                styles={[
                  globalStyles.shadow,
                  {
                    backgroundColor: appColors.white,
                    borderRadius: 100,
                    paddingHorizontal: 12,
                    width: '90%',
                  },
                ]}>
                <AvatarGroup userIds={item.users} size={36} />
                <TouchableOpacity
                  onPress={() => setIsVisibleModalInvite(true)}
                  style={[
                    globalStyles.button,
                    {
                      backgroundColor: appColors.primary,
                      paddingVertical: 8,
                    },
                  ]}>
                  <TextComponent text="Invite" color={appColors.white} />
                </TouchableOpacity>
              </RowComponent>
            </View>
          ) : (
            <>
              <ButtonComponent
                onPress={() => setIsVisibleModalInvite(true)}
                text="Invite"
                styles={{ borderRadius: 100, width: '30%' }}
                type="primary"
              />
            </>
          )}
        </SectionComponent>
        <View style={{ backgroundColor: appColors.white }}>
          <SectionComponent>
            <TextComponent
              text={item.title}
              title
              size={34}
              font={fontFamilies.medium}
            />
          </SectionComponent>
          <SectionComponent>
            <RowComponent styles={{ marginBottom: 20 }}>
              <CardComponent
                styles={[globalStyles.noSpaceCard, { width: 48, height: 48 }]}
                color={`${appColors.primary}33`}>
                <Calendar variant="Bold" color={appColors.primary} size={30} />
              </CardComponent>
              <SpaceComponent width={16} />
              <View
                style={{
                  flex: 1,
                  height: 48,
                  justifyContent: 'space-around',
                }}>
                <TextComponent
                  text={`${dateTime.GetDate(new Date(item.date))}`}
                  font={fontFamilies.medium}
                  size={18}
                />
                <TextComponent
                  text={`${appInfo.dayNames[new Date(item.date).getDay()]
                    }, ${dateTime.GetStartAndEnd(item.startAt, item.endAt)}`}
                  color={appColors.gray}
                  size={16}
                />
              </View>
            </RowComponent>

            <RowComponent styles={{ marginBottom: 20, alignItems: 'flex-start' }}>
              <CardComponent
                styles={[globalStyles.noSpaceCard, { width: 48, height: 48 }]}
                color={`${appColors.primary}33`}>
                <Location variant="Bold" color={appColors.primary} size={30} />
              </CardComponent>
              <SpaceComponent width={16} />
              <View
                style={{
                  flex: 1,
                  minHeight: 48,
                  justifyContent: 'space-around',
                }}>
                <TextComponent
                  numberOfLine={1}
                  text={item.locationTitle}
                  font={fontFamilies.medium}
                  size={18}
                />
                <TextComponent
                  text={item.locationAddress}
                  color={appColors.gray}
                  size={16}
                />
              </View>
            </RowComponent>
            {profile && (
              <RowComponent
                styles={{ marginBottom: 20 }}
                onPress={() =>
                  navigation.navigate('ProfileScreen', {
                    id: item.authorId,
                  })
                }>
                <TouchableOpacity>
                  <Image
                    source={{
                      uri: profile.photoUrl
                        ? profile.photoUrl
                        : 'https://img.icons8.com/plasticine/100/user-male-circle.png',
                    }}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      resizeMode: 'cover',
                    }}
                  />
                </TouchableOpacity>
                <SpaceComponent width={16} />
                <View
                  style={{
                    flex: 1,
                    height: 48,
                    justifyContent: 'space-around',
                  }}>
                  <TextComponent
                    text={profile.name ? profile.name : profile?.email}
                    font={fontFamilies.medium}
                    size={18}
                  />
                  <TextComponent
                    text={profile.type ? profile.type : 'Personal'}
                    color={appColors.gray}
                    size={16}
                  />
                </View>
                <TagComponent
                  onPress={() => handlerToggleFollowing(item.authorId)}
                  label={
                    auth.following && auth.following.includes(item.authorId)
                      ? 'Unfollow'
                      : 'Follow'
                  }
                  textColor={
                    auth.following && auth.following.includes(item.authorId)
                      ? appColors.danger
                      : appColors.primary
                  }
                  styles={[
                    globalStyles.button,
                    {
                      backgroundColor:
                        auth.following && auth.following.includes(item.authorId)
                          ? appColors.white
                          : '#EBEDFF',
                      paddingVertical: 8,
                      marginRight: 8,
                      borderRadius: 12,
                    },
                  ]}
                />
              </RowComponent>
            )}
          </SectionComponent>
          <TabBarComponent title="About Event" />
          <SectionComponent>
            <TextComponent text={item.description} />
          </SectionComponent>
        </View>
        <SpaceComponent height={80} />
      </ScrollView>

      <LinearGradient
        colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,1)']}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 12,
        }}>
        <ButtonComponent
          text="BUY TICKET $120"
          type="primary"
          iconFlex="right"
          icon={
            <View
              style={[
                globalStyles.iconContainer,
                {
                  backgroundColor: '#3D56F0',
                },
              ]}>
              <ArrowRight size={18} color={appColors.white} />
            </View>
          }
        />
      </LinearGradient>

      <LoadingModal visible={isLoading} />

      <ModalInvite
        visible={isVisibleModalInvite}
        onClose={() => setIsVisibleModalInvite(false)}
        eventId={item._id}
      />
    </View>
  ) : <></>;
};

export default EventDetail;
