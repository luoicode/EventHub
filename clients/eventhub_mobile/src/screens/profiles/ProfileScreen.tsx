import {View, Text} from 'react-native';
import React from 'react';
import {ButtonComponent, ContainerComponent} from '../../components';
import {LoginManager} from 'react-native-fbsdk-next';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useDispatch} from 'react-redux';
import {removeAuth} from '../../redux/reducers/authReducer';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  return (
    <ContainerComponent back>
      <View>
        <Text>ProfileScreen</Text>
        <ButtonComponent
          type="primary"
          text="logout"
          onPress={async () => {
            await GoogleSignin.signOut();
            await LoginManager.logOut();

            dispatch(removeAuth({}));
          }}
        />
      </View>
    </ContainerComponent>
  );
};

export default ProfileScreen;
