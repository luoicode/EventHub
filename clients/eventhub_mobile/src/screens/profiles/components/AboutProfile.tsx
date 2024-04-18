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
import { useSelector } from 'react-redux';
import { authSelector } from '../../../redux/reducers/authReducer';
import { ProfileModel } from '../../../models/ProfileModel';
import userAPI from '../../../apis/userApi';

interface Props {
  profile: ProfileModel;
}

const AboutProfile = (props: Props) => {
  const { profile } = props;
  const [tabSelected, setTabSelected] = useState('about');

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
    const api = `/update-following`

    try {
      const res = await userAPI.HandlerUser(api, {
        uid: auth.id,
        authorId: profile.uid
      }, 'put')

      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

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
                borderColor: appColors.primary,
                backgroundColor: appColors.white,
              },
            ]}>
            <Feather name="user-plus" size={26} color={appColors.primary} />
            <SpaceComponent width={20} />
            <TextComponent
              size={20}
              text="Follow"
              color={appColors.primary}
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
    </>
  );
};

export default AboutProfile;
