import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React, { useState } from 'react';
import {
  LoginManager,
  Profile,
  Settings
} from 'react-native-fbsdk-next';
import { useDispatch } from 'react-redux';
import authenticationAPI from '../../../apis/authApi';
import { Facebook, Google } from '../../../assets/svgs';
import {
  ButtonComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../../components';
import { appColors } from '../../../constants/appColors';
import { fontFamilies } from '../../../constants/fontFamilies';
import LoadingModal from '../../../modals/LoadingModal';
import { addAuth } from '../../../redux/reducers/authReducer';

GoogleSignin.configure({
  webClientId:
    '212993360539-blc5b6o1v0ddqtuv8c6qrujmhu9gtvbp.apps.googleusercontent.com',
});

Settings.setAppID('3832591553635448');

const SocialLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const api = `/google-signin`;
  const dispatch = useDispatch();

  const handlerLoginWithGoogle = async () => {

    setIsLoading(true)
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const user = userInfo.user;
      const res: any = await authenticationAPI.HandlerAuthentication(
        api,
        user,
        'post',
      );

      // console.log(res.data)
      dispatch(addAuth(res.data));
      await AsyncStorage.setItem('auth', JSON.stringify(res.data));
      setIsLoading(false)

    } catch (error) {
      setIsLoading(false)

      console.log(error);
    }
  };
  const handlerLoginWithFacebook = async () => {
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
      ]);
      if (result.isCancelled) {
        console.log('Login cancel');
      } else {
        const profile = await Profile.getCurrentProfile();
        if (profile) {
          setIsLoading(true);
          const data = {
            name: profile.name,
            givenName: profile.firstName,
            familyName: profile.lastName,
            email: profile.userID,
            photo: profile.imageURL,
          };
          const res: any = await authenticationAPI.HandlerAuthentication(
            api,
            data,
            'post',
          );
          dispatch(addAuth(res.data));
          await AsyncStorage.setItem('auth', JSON.stringify(res.data));
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SectionComponent>
      <TextComponent
        styles={{ textAlign: 'center' }}
        text="OR"
        color={appColors.gray4}
        size={16}
        font={fontFamilies.medium}
      />
      <SpaceComponent height={16} />
      <RowComponent>
        <ButtonComponent
          styles={{ width: 'auto', borderRadius: 100 }}
          onPress={handlerLoginWithGoogle}
          color={appColors.white}
          iconFlex="left"
          icon={<Google />}
        />
        <SpaceComponent width={30} />
        <ButtonComponent
          styles={{ width: 'auto', borderRadius: 100 }}
          onPress={handlerLoginWithGoogle}
          color={appColors.white}
          iconFlex="left"
          icon={<Facebook />}
        />
      </RowComponent>
      <LoadingModal visible={isLoading} />
    </SectionComponent>
  );
};

export default SocialLogin;
