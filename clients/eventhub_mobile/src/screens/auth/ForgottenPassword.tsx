import { ArrowCircleRight2, Sms } from 'iconsax-react-native';
import React, { useState } from 'react';
import { Alert } from 'react-native';
import authenticationAPI from '../../apis/authApi';
import {
  ButtonComponent,
  ContainerComponent,
  InputComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import { appColors } from '../../constants/appColors';
import { LoadingModal } from '../../modals';
import { Validate } from '../../utils/validate';

const ForgottenPassword = () => {
  const [email, setEmail] = useState('');
  const [isDissble, setIsDissable] = useState(true);
  const [isLoading, setiIsLoading] = useState(false);

  const handlerCheckEmail = () => {
    const isValidEmail = Validate.email(email);
    setIsDissable(!isValidEmail);
  };

  const handlerForgottenPassword = async () => {
    const api = `/forgottenPassword`;

    setiIsLoading(true);
    try {
      const res: any = await authenticationAPI.HandlerAuthentication(
        api,
        { email },
        'post',
      );
      console.log(res);

      Alert.alert('Send mail', 'We sended a email includes new password');

      setiIsLoading(false);
    } catch (error) {
      setiIsLoading(false);
      console.log(`We couln't find your accoun, ${error}`);
    }
  };

  return (
    <ContainerComponent back isImageBackground isScroll>
      <SectionComponent>
        <TextComponent text="Resset Password" title />
        <SpaceComponent height={12} />
        <TextComponent text="Please enter your email address to request a password reset" />
        <SpaceComponent height={26} />
        <InputComponent
          value={email}
          onChange={val => setEmail(val)}
          affix={<Sms size={20} color={appColors.gray} />}
          placeholder="abcd123@gmail.com"
          onEnd={handlerCheckEmail}
        />
      </SectionComponent>
      <SectionComponent>
        <ButtonComponent
          onPress={handlerForgottenPassword}
          disabled={isDissble}
          text="Send"
          type="primary"
          icon={<ArrowCircleRight2 size={30} color={appColors.white} />}
          iconFlex="right"
        />
      </SectionComponent>
      <LoadingModal visible={isLoading} />
    </ContainerComponent>
  );
};

export default ForgottenPassword;
