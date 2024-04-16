import { View, Text, Button, Image, Switch, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ButtonComponent,
  InputComponent,
  TextComponent,
  ContainerComponent,
  SectionComponent,
  SpaceComponent,
  RowComponent,
} from './../../components/';
import { globalStyles } from '../../styles/globalStyles';
import { Lock1, Sms } from 'iconsax-react-native';
import { appColors } from '../../constants/appColors';
import { fontFamilies } from '../../constants/fontFamilies';
import SocialLogin from './components/SocialLogin';
import authenticationAPI from '../../apis/authApi';
import { Validate } from '../../utils/validate';
import { useDispatch } from 'react-redux';
import { addAuth } from '../../redux/reducers/authReducer';

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
    <ContainerComponent isImageBackground isScroll>
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
      <SectionComponent>
        <TextComponent text="Sign In" size={24} title />
        <SpaceComponent height={21} />
        <InputComponent
          value={email}
          placeholder="Email"
          onChange={val => setEmail(val)}
          allowClear
          affix={<Sms size={22} color={appColors.gray} />}
        />
        <InputComponent
          value={password}
          placeholder="Password"
          onChange={val => setPassword(val)}
          isPassword
          allowClear
          affix={<Lock1 size={22} color={appColors.gray} />}
        />
        <RowComponent justify="space-between">
          <RowComponent onPress={() => setIsRemember(!isRemember)}>
            <Switch
              trackColor={{ true: appColors.primary }}
              thumbColor={appColors.white}
              value={isRemember}
              onChange={() => setIsRemember(!isRemember)}
            />
            <SpaceComponent width={4} />
            <TextComponent text="Remember me" />
          </RowComponent>
          <ButtonComponent
            text="Forgotten Password?"
            onPress={() => navigation.navigate('ForgottenPassword')}
            type="text"
          />
        </RowComponent>
      </SectionComponent>
      <SpaceComponent height={16} />
      <SectionComponent>
        <ButtonComponent
          text="Login"
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
