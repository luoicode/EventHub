import {View, Text, Button} from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ButtonComponent} from '../../components';
import {globalStyles} from '../../styles/globalStyles';

const SignInScreen = () => {
  return (
    <View style={[globalStyles.container]}>
      <Text>LoginScreen</Text>

      <ButtonComponent
        type="primary"
        text="Login"
        onPress={() => console.log('Login')}
        icon={
          <View>
            <Text>N</Text>
          </View>
        }
      />
    </View>
  );
};
export default SignInScreen;
