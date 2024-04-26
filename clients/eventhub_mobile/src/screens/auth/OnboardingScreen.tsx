import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { globalStyles } from '../../styles/globalStyles';
import Swiper from 'react-native-swiper';
import { appInfo } from '../../constants/appInfos';
import { appColors } from '../../constants/appColors';
import { TextComponent } from '../../components';
import { fontFamilies } from '../../constants/fontFamilies';

const OnboardingScreen = ({ navigation }: any) => {
  const [index, setIndex] = useState(0);
  return (
    <View style={[globalStyles.container]}>
      <Swiper
        style={{}}
        loop={false}
        onIndexChanged={num => setIndex(num)}
        index={index}
        activeDotColor={appColors.white}>
        <Image
          source={require('../../assets/images/Onboarding_1.png')}
          style={{
            flex: 1,
            width: appInfo.sizes.WIDTH,
            height: appInfo.sizes.HEIGHT,
            resizeMode: 'cover',
          }}
        />
        <Image
          source={require('../../assets/images/Onboarding_2.png')}
          style={{
            flex: 1,
            width: appInfo.sizes.WIDTH,
            height: appInfo.sizes.HEIGHT,
            resizeMode: 'cover',
          }}
        />
        <Image
          source={require('../../assets/images/Onboarding_3.png')}
          style={{
            flex: 1,
            width: appInfo.sizes.WIDTH,
            height: appInfo.sizes.HEIGHT,
            resizeMode: 'cover',
          }}
        />
      </Swiper>
      <View
        style={[
          {
            paddingHorizontal: 16,
            paddingVertical: 20,
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
        ]}>
        <TouchableOpacity onPress={() => navigation.navigate('SignInScreen')}>
          <TextComponent
            text="Skip"
            size={24}
            color={appColors.primary8}
            font={fontFamilies.medium}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            index < 2
              ? setIndex(index + 1)
              : navigation.navigate('SignInScreen')
          }>
          <TextComponent
            text="Next"
            size={24}
            color={appColors.primary7}
            font={fontFamilies.medium}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  text: {
    color: appColors.white,
    fontSize: 18,
    fontWeight: '500',
  },
});
