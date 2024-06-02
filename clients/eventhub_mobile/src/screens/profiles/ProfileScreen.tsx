import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import userAPI from '../../apis/userApi';
import {
  AvatarComponent,
  ButtonComponent,
  ContainerComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import { ProfileModel } from '../../models/ProfileModel';
import {
  AuthState,
  addAuth,
  authSelector,
} from '../../redux/reducers/authReducer';
import { globalStyles } from '../../styles/globalStyles';
import AboutProfile from './components/AboutProfile';
import EditProfile from './components/EditProfile';
import { More } from 'iconsax-react-native';
import { appColors } from '../../constants/appColors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ProfileScreen = ({ navigation, route }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<ProfileModel>();
  const [userFollowers, setUserFollowers] = useState<string[]>([]);
  const [profileId, setProfileId] = useState('');

  const dispatch = useDispatch();
  const auth: AuthState = useSelector(authSelector);

  useEffect(() => {
    if (route.params) {
      const { id } = route.params;

      setProfileId(id);

      if (route.params.isUpdated) {
        getProfile();
      }
    } else {
      setProfileId(auth.id);
    }
  }, [route.params]);

  useEffect(() => {
    if (profileId) {
      getProfile();
      getFollowersByUid();
    }
  }, [profileId]);

  const getProfile = async () => {
    const api = `/get-profile?uid=${profileId}`;

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

  const getFollowersByUid = async () => {
    const api = `/get-followers?uid=${profileId}`;

    try {
      const res = await userAPI.HandlerUser(api);
      setUserFollowers(res.data);
    } catch (error) {
      console.log();
    }
  };


  return (
    <ContainerComponent
      back
      title={profile?.name}
      isScroll
      right={
        <ButtonComponent
          color={appColors.primary7}
          icon={
            <MaterialIcons
              name="more-vert"
              size={28}
              color={appColors.primary5}
              onPress={() => { }}
            />
          }
        />
      }>
      {isLoading ? (
        <ActivityIndicator />
      ) : profile ? (
        <>
          <SectionComponent styles={[globalStyles.center]}>
            <RowComponent>
              <AvatarComponent
                photoURL={profile.photoUrl}
                name={profile.name ? profile.name : profile.email}
                size={100}
              />
              <View style={[globalStyles.center, { flex: 1 }]}>
                <TextComponent
                  title
                  text={`${userFollowers.length}`}
                  size={20}
                />
                <SpaceComponent height={8} />
                <TextComponent text="Follower" />
              </View>
              <View style={[globalStyles.center, { flex: 1 }]}>
                <TextComponent
                  title
                  text={`${profile.following.length}`}
                  size={20}
                />
                <SpaceComponent height={8} />
                <TextComponent text="Following" />
              </View>
            </RowComponent>
          </SectionComponent>
          {auth.id !== profileId ? (
            <AboutProfile profile={profile} />
          ) : (
            <EditProfile profile={profile} />
          )}
        </>
      ) : (
        <TextComponent text="profile not found!" />
      )}
    </ContainerComponent>
  );
};

export default ProfileScreen;
