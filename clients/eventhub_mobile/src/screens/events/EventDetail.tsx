import { ArrowLeft, Calendar, Location, Trash } from 'iconsax-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import eventAPI from '../../apis/eventApi';
import userAPI from '../../apis/userApi';
import {
  AvatarGroup,
  ButtonComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TabBarComponent,
  TagComponent,
  TextComponent
} from '../../components';
import { appColors } from '../../constants/appColors';
import { fontFamilies } from '../../constants/fontFamilies';
import { LoadingModal, ModalInvite } from '../../modals';
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
import { ShareEvent } from '../../utils/shareEvent';

const EventDetail = ({ navigation, route }: any) => {
  const { id }: { id: string } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [followers, setFollowers] = useState<string[]>([]);
  const [profile, setProfile] = useState<ProfileModel>();
  const [isVisibleModalInvite, setIsVisibleModalInvite] = useState(false);
  const [item, setItem] = useState<EventModel>();
  const [isUpdating, setIsUpdating] = useState(false);

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
    setIsUpdating(true);

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
      setIsUpdating(false);
    } catch (error) {
      setIsUpdating(false);

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
  const deleteEventById = async () => {
    setIsLoading(true);
    try {
      Alert.alert(
        'Confirm Delete',
        'Are you sure you want to delete this event?',
        [
          {
            text: 'Cancel',
            onPress: () => setIsLoading(false),
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: async () => {
              await eventAPI.deleteEvent(id);
              setIsLoading(false);
              navigation.navigate('Home');
            },
            style: 'destructive',
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.log(`Error deleting event: ${error}`);
      setIsLoading(false);
    }
  };

  const handlerCreateBillPayment = async () => {
    const data = {
      createdAt: Date.now(),
      createdBy: auth.id,
      eventId: id,
      price: item?.price,
      authorId: item?.authorId,
      photoUrl: item?.photoUrl,
      title: item?.title,
      locationTitle: item?.locationTitle,
      startAt: item?.startAt,
      date: item?.date
    };

    const api = `/buy-ticket`;
    setIsUpdating(true)

    try {
      const res = await eventAPI.HandlerEvent(api, data, 'post');
      navigation.navigate('PaymentScreen', { billDetail: res.data });
      setIsUpdating(false)

    } catch (error) {
      setIsUpdating(false)
      console.log(error);

    }
  };
  const isEventOver = item && new Date(item.startAt) < new Date();

  return isLoading ? (
    <View style={[globalStyles.container, globalStyles.center, { flex: 1 }]}>
      <ActivityIndicator />
    </View>
  ) : item ? (
    <View style={{ flex: 1, backgroundColor: appColors.primary7 }}>
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
                onPress={() =>
                  navigation.canGoBack()
                    ? navigation.goBack()
                    : navigation.navigate('Main')
                }
                style={{ width: 48, height: 48, justifyContent: 'center' }}>
                <ArrowLeft size={28} color={appColors.primary7} />
              </TouchableOpacity>
              <TextComponent
                flex={1}
                text="Event Details"
                title
                color={appColors.primary7}
              />
              <ButtonComponent onPress={() => ShareEvent({
                title: item.title,
                description: item.description,
                id,

              })} icon={<AntDesign name='sharealt' size={28} color='white' />} />
              <SpaceComponent width={16} />
              {auth.id === item.authorId && (
                <TouchableOpacity onPress={deleteEventById}>
                  <Trash size={28} color={appColors.primary7} variant='Bold' />
                </TouchableOpacity>
              )}
              {/* <CardComponent
                onPress={handlerFollower}
                styles={[globalStyles.noSpaceCard, { width: 36, height: 36 }]}
                color={
                  auth.follow_events && auth.follow_events.includes(item._id)
                    ? '#ffffffB3'
                    : '#ffffff4D'
                }>
                <Heart
                  size="28"
                  color={
                    auth.follow_events && auth.follow_events.includes(item._id)
                      ? appColors.danger2
                      : appColors.primary7
                  }
                  variant="Bold"
                />

              </CardComponent> */}
            </RowComponent>
          </RowComponent>
        </LinearGradient>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          backgroundColor: `${appColors.gray2}33`,
        }}>
        <View
          style={{
            backgroundColor: appColors.primary7,
            margin: 5,
            borderRadius: 40,
            flex: 1,
          }}>
          <Image
            source={{ uri: item.photoUrl }}
            style={{
              width: 'auto',
              height: 300,
              resizeMode: 'cover',
              borderBottomLeftRadius: 40,
              borderBottomRightRadius: 40,
            }}
          />
          <RowComponent justify="space-between">
            <SectionComponent styles={{ width: '70%' }}>
              <SpaceComponent height={20} />
              <TextComponent
                text={item.title}
                title
                size={26}
                font={fontFamilies.medium}
              />
              <SpaceComponent height={16} />
              <RowComponent justify="flex-start">
                <Calendar variant="Bold" color={appColors.gray2} size={20} />
                <SpaceComponent width={5} />
                <TextComponent
                  text={`${dateTime.GetDate(new Date(item.date))}`}
                  size={14}
                  color={appColors.gray}
                />
                <SpaceComponent width={16} />
                <Location variant="Bold" color={appColors.gray2} size={20} />
                <SpaceComponent width={5} />
                <TextComponent
                  text={item.locationTitle}
                  size={14}
                  color={appColors.gray}
                />
              </RowComponent>
            </SectionComponent>
            <SectionComponent
              styles={[globalStyles.shadow, {
                padding: 20,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: appColors.danger,
                borderRadius: 20,
              }]}>
              <TextComponent
                text={`$${parseFloat(item.price).toLocaleString()}`}
                title
                color={appColors.primary7}
              />
            </SectionComponent>
          </RowComponent>
        </View>

        <View
          style={{
            backgroundColor: appColors.primary7,
            marginHorizontal: 5,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
          }}>
          <SectionComponent>

            {profile && (
              <RowComponent styles={{ marginVertical: 20 }}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('ProfileScreen', {
                      id: item.authorId,
                    })
                  }>
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
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('ProfileScreen', {
                        id: item.authorId,
                      })
                    }>
                    <TextComponent
                      text={profile.name ? profile.name : profile?.email}
                      font={fontFamilies.medium}
                      size={18}
                    />
                  </TouchableOpacity>
                  <TextComponent
                    text={profile.type ? profile.type : 'Personal'}
                    color={appColors.gray}
                    size={16}
                  />
                </View>
                {item && auth.id !== item.authorId ? (<TagComponent
                  onPress={() => handlerToggleFollowing(item.authorId)}
                  label={
                    auth.following && auth.following.includes(item.authorId)
                      ? 'Unfollow'
                      : 'Follow'
                  }
                  textColor={
                    auth.following && auth.following.includes(item.authorId)
                      ? appColors.danger
                      : appColors.primary3
                  }
                  styles={[
                    globalStyles.button,
                    {
                      backgroundColor: auth.following && auth.following.includes(item.authorId)
                        ? `${appColors.danger}33`
                        : appColors.primary,
                      paddingVertical: 8,
                      marginRight: 8,
                      borderRadius: 12,
                    },
                  ]}
                />) : <></>}

              </RowComponent>
            )}
          </SectionComponent>
          <TabBarComponent title="Members" />
          <SectionComponent styles={{}}>
            {item.joined && item.joined.length > 0 ? (
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
                      backgroundColor: appColors.primary7,
                      borderRadius: 40,
                      padding: 30,
                      width: '100%',
                    },
                  ]}>
                  <AvatarGroup userIds={item.joined} size={50} />
                  <SpaceComponent width={16} />
                  <TouchableOpacity
                    onPress={() => setIsVisibleModalInvite(true)}
                    style={[
                      globalStyles.button,
                      {
                        backgroundColor: '#8E8FFA',
                        paddingVertical: 8,
                      },
                    ]}>
                    <TextComponent text="Invite" color={appColors.primary7} />
                  </TouchableOpacity>
                </RowComponent>
              </View>
            ) : (
              <>
                <ButtonComponent
                  onPress={() => setIsVisibleModalInvite(true)}
                  text="Invite your friend"
                  color="#8E8FFA"
                  styles={{ borderRadius: 100, width: '50%' }}
                  type="primary"
                />
              </>
            )}
          </SectionComponent>
          <TabBarComponent title="About Event" />
          <SectionComponent>
            <TextComponent text={item.description} />
          </SectionComponent>

        </View>
        <SpaceComponent height={80} />
      </ScrollView>
      {
        !isEventOver && item && auth.id !== item.authorId ? (
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
              onPress={handlerCreateBillPayment}
              text="BUY TICKET "
              type="primary"
            />
          </LinearGradient>
        ) : <></>
      }


      <LoadingModal visible={isUpdating} />

      <ModalInvite
        title={item.title}
        visible={isVisibleModalInvite}
        onClose={() => setIsVisibleModalInvite(false)}
        eventId={item._id}
        joined={item.joined}
      />
    </View>
  ) : (
    <></>
  );
};

export default EventDetail;
