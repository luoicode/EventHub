import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
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

const AboutProfile = () => {
  return (
    <>
      <SectionComponent>
        <RowComponent>
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
            <Feather name="user-plus" size={26} color={appColors.primary} />
            <SpaceComponent width={20} />
            <TextComponent
              // size={20}
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
              // size={20}
              text="Messages"
              color={appColors.primary}
              font={fontFamilies.medium}
            />
          </TouchableOpacity>
        </RowComponent>
      </SectionComponent>
    </>
  );
};

export default AboutProfile;
