import { Image, StyleSheet, View } from 'react-native';
import { ButtonComponent, RowComponent } from '../../components';
import { appColors } from '../../constants/appColors';
import { appInfo } from '../../constants/appInfos';
import { fontFamilies } from '../../constants/fontFamilies';
import { globalStyles } from '../../styles/globalStyles';

const OnboardingScreen = ({ navigation }: any) => {
  return (
    <View style={[globalStyles.container]}>
      <Image
        source={require('../../assets/images/Onboarding.png')}
        style={{
          flex: 1,
          width: appInfo.sizes.WIDTH,
          height: appInfo.sizes.HEIGHT,
          resizeMode: 'cover',
        }}
      />
      <RowComponent
        styles={[
          {
            paddingHorizontal: 16,
            paddingVertical: 20,
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0,
          },
        ]}>
        <ButtonComponent
          color={appColors.primary7}
          text="Get Started"
          textFont={fontFamilies.semiBold}
          type="primary"
          textColor={appColors.primary5}
          onPress={() => navigation.navigate('SignInScreen')}
        />
      </RowComponent>
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
