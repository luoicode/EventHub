import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import {
  ButtonComponent,
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

interface Props {
  profile: ProfileModel;
}

const AboutProfile = (props: Props) => {
  const { profile } = props;
  const [tabSelected, setTabSelected] = useState('about');
  const [isLoading, setIsLoading] = useState(false);

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
          </>
        );
        break;

      default:
        content = <></>;
        break;
    }

    return content;
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
        <RowComponent>
          <TouchableOpacity
            onPress={handlerToggleFollowing}
            style={[
              globalStyles.button,
              {
                flex: 1,
                borderWidth: 1,
                borderColor:
                  auth.following && auth.following.includes(profile.uid)
                    ? appColors.white
                    : appColors.primary,
                backgroundColor:
                  auth.following && auth.following.includes(profile.uid)
                    ? appColors.danger
                    : appColors.white,
              },
            ]}>
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
                  : appColors.primary
              }
            />
            <SpaceComponent width={20} />
            <TextComponent
              size={20}
              text={
                auth.following && auth.following.includes(profile.uid)
                  ? 'Unfollow'
                  : 'Follow'
              }
              color={
                auth.following && auth.following.includes(profile.uid)
                  ? appColors.white
                  : appColors.primary
              }
              font={fontFamilies.medium}
            />
          </TouchableOpacity>
          <SpaceComponent width={20} />

          <TouchableOpacity
            style={[
              globalStyles.button,
              {
                flex: 1,
                borderWidth: 1,
                borderColor: appColors.primary,
                backgroundColor: appColors.white,
              },
            ]}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={26}
              color={appColors.primary}
            />
            <SpaceComponent width={20} />
            <TextComponent
              size={20}
              text="Messages"
              color={appColors.primary}
              font={fontFamilies.medium}
            />
          </TouchableOpacity>
        </RowComponent>
      </SectionComponent>
      <SectionComponent>
        <RowComponent>
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
                  item.key === tabSelected ? appColors.primary : appColors.text
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
                      ? appColors.primary
                      : appColors.white,
                }}
              />
            </TouchableOpacity>
          ))}
        </RowComponent>
        {rednerTabContent(tabSelected)}
      </SectionComponent>
      <LoadingModal visible={isLoading} />
    </>
  );
};

export default AboutProfile;
