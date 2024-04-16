import { View, Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  AvatarComponent,
  ButtonComponent,
  ContainerComponent,
  RowComponent,
  SectionComponent,
  TextComponent,
} from '../../components';
import { LoginManager } from 'react-native-fbsdk-next';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useDispatch, useSelector } from 'react-redux';
import {
  AuthState,
  authSelector,
  removeAuth,
} from '../../redux/reducers/authReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HandlerNotification } from '../../utils/handlerNotification';
import { LoadingModal } from '../../modals';
import userAPI from '../../apis/userApi';
import { ProfileModel } from '../../models/ProfileModel';

const ProfileScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<ProfileModel>();

  const dispatch = useDispatch();

  const auth: AuthState = useSelector(authSelector);

  useEffect(() => {
    if (auth) {
      getProfile();
    }
  }, []);

  const getProfile = async () => {
    const api = `/get-profile?uid=${auth.id}`;

    setIsLoading(true);

    try {
      const res = await userAPI.HandlerUser(api);
      res && res.data && setProfile(res.data);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ContainerComponent back title="Profile">
      {isLoading ? (
        <ActivityIndicator />
      ) : profile ? (
        <>
          <SectionComponent>
            <RowComponent>
              <AvatarComponent
                photoUrl={profile.photoUrl}
                name={profile.name ? profile.name : profile.email}
                size={120}
              />
            </RowComponent>
          </SectionComponent>
        </>
      ) : (
        <TextComponent text="Profile not found" />
      )}
    </ContainerComponent>
  );
};

export default ProfileScreen;
