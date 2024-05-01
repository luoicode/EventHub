import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Switch, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import authenticationAPI from '../../apis/authApi';
import { appColors } from '../../constants/appColors';
import { addAuth } from '../../redux/reducers/authReducer';
import { Validate } from '../../utils/validate';
import {
  ButtonComponent,
  ContainerComponent,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from './../../components/';
import SocialLogin from './components/SocialLogin';

const SignInScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRemember, setIsRemember] = useState(true);
  const [isDissable, setIsDissable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const emailValidation = Validate.email(email);
    if (!email || !password) {
      setIsDissable(true);
    } else {
      setIsDissable(false);
    }
  }, [email, password]);

  const handlerLogin = async () => {
    const emailValidation = Validate.email(email);
    setIsLoading(true);
    if (emailValidation) {
      setIsLoading(true);
      try {
        const res = await authenticationAPI.HandlerAuthentication(
          '/login',
          { email, password },
          'post',
        );
        dispatch(addAuth(res.data));

        await AsyncStorage.setItem(
          'auth',
          isRemember ? JSON.stringify(res.data) : email,
        );

        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    } else {
      Alert.alert('Email is incorrect');
    }
  };

  return (
    <ContainerComponent isImageBackground isScroll styles={{ backgroundColor: appColors.primary4 }}>
      <SectionComponent
        styles={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 75,
        }}>
        <Image
          source={require('../../assets/images/textLogo.png')}
          style={{
            width: 162,
            height: 114,
            marginBottom: 30,
          }}
        />
      </SectionComponent>
      <SectionComponent >
        <TextComponent text="Sign In" size={24} title />
        <SpaceComponent height={21} />
        <InputComponent
          value={email}
          placeholder="Email"
          onChange={val => setEmail(val)}
          allowClear
        />
        <InputComponent
          value={password}
          placeholder="Password"
          onChange={val => setPassword(val)}
          isPassword
          allowClear
        />
        <RowComponent justify="space-between">
          <RowComponent onPress={() => setIsRemember(!isRemember)}>
            <Switch
              trackColor={{ true: appColors.primary3, false: appColors.white }}
              thumbColor={appColors.white}
              value={isRemember}
              onChange={() => setIsRemember(!isRemember)}
            />
            <SpaceComponent width={4} />
            <TextComponent text="Remember me" />
          </RowComponent>

          <TouchableOpacity onPress={() => navigation.navigate('ForgottenPassword')}>
            <TextComponent text='Forgotten Password?' />
          </TouchableOpacity>
        </RowComponent>
      </SectionComponent>
      <SpaceComponent height={16} />
      <SectionComponent>
        <ButtonComponent
          text="Sign In"
          disabled={isLoading || isDissable}
          onPress={handlerLogin}
          type="primary"
        />
      </SectionComponent>
      <SocialLogin />
      <SectionComponent>
        <RowComponent justify="center">
          <TextComponent text="Don't have an account? " />
          <ButtonComponent
            text="Sign Up"
            onPress={() => navigation.navigate('SignUpScreen')}
            type="link"
          />
        </RowComponent>
      </SectionComponent>
    </ContainerComponent>
  );
};
export default SignInScreen;
