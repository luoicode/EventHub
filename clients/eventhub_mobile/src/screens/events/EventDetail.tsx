import { ArrowLeft, ArrowRight, Calendar, Location } from 'iconsax-react-native';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  AvatarGroup,
  ButtonComponent,
  CardComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TabBarComponent,
  TextComponent,
} from '../../components';
import { appColors } from '../../constants/appColors';
import { EventModel } from '../../models/EventModel';
import { globalStyles } from '../../styles/globalStyles';
import { fontFamilies } from '../../constants/fontFamilies';
import { useDispatch, useSelector } from 'react-redux';
import { AuthState, authSelector } from '../../redux/reducers/authReducer';
import eventAPI from '../../apis/eventApi';
import { LoadingModal } from '../../modals';
import { UserHandler } from '../../utils/UserHandlers';
import { dateTime } from '../../utils/dateTime';
import { appInfo } from '../../constants/appInfos';

const EventDetail = ({ navigation, route }: any) => {
  const { item }: { item: EventModel } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [followers, setFollowers] = useState<string[]>([]);

  const auth: AuthState = useSelector(authSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    item && getFollowersByID();
  }, [item]);

  const getFollowersByID = async () => {
    const api = `/followers?id=${item._id}`;

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
          id: item._id,
          followers: data,
        },
        'post',
      );
    } catch (error) {
      console.log(`Can not update followers in Event detail line 63, ${error}`);
    }
  };

  return (
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
                onPress={() => navigation.goBack()}
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
          {item.users.length > 0 ? (
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

            <RowComponent
              styles={{ marginBottom: 20 }}
              onPress={() =>
                navigation.navigate('ProfileScreen',
                  {
                    id: item.authorId,
                  },)
              }>
              <TouchableOpacity>
                <Image
                  source={{
                    uri: 'data:image/jpeg;base64,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',
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
                  text="The Weeknd"
                  font={fontFamilies.medium}
                  size={18}
                />
                <TextComponent
                  text="Organizer"
                  color={appColors.gray}
                  size={16}
                />
              </View>
              <TouchableOpacity
                style={[
                  globalStyles.button,
                  {
                    backgroundColor: '#EBEDFF',
                    paddingVertical: 8,
                    marginRight: 8,
                  },
                ]}>
                <TextComponent text="Follow" color={appColors.primary} />
              </TouchableOpacity>
            </RowComponent>
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
    </View>
  );
};

export default EventDetail;
