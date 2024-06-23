import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowCircleRight2 } from 'iconsax-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useDispatch } from 'react-redux';
import authenticationAPI from '../../apis/authApi';
import {
  ButtonComponent,
  ContainerComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import { appColors } from '../../constants/appColors';
import { fontFamilies } from '../../constants/fontFamilies';
import { LoadingModal } from '../../modals';
import { addAuth } from '../../redux/reducers/authReducer';
import { globalStyles } from '../../styles/globalStyles';

const Verification = ({ navigation, route }: any) => {
  const { code, email, password, username } = route.params;

  const [currentCode, setCurrentCode] = useState<string>(code);
  const [codeValues, setCodeValues] = useState<string[]>([]);
  const [newCode, setNewCode] = useState('');
  const [limit, setLimit] = useState(120);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const ref1 = useRef<any>();
  const ref2 = useRef<any>();
  const ref3 = useRef<any>();
  const ref4 = useRef<any>();

  const dispatch = useDispatch();

  useEffect(() => {
    ref1.current.focus();
  }, []);

  useEffect(() => {
    if (limit > 0) {
      const interval = setInterval(() => {
        setLimit(limit => limit - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [limit]);

  useEffect(() => {
    let item = ``;

    codeValues.forEach(val => (item += val));

    setNewCode(item);
  }, [codeValues]);

  const handlerChangeCode = (val: string, index: number) => {
    const data = [...codeValues];
    data[index] = val;

    setCodeValues(data);
  };

  const handlerResendVerification = async () => {
    setCodeValues(['', '', '', '']);
    setNewCode('');

    const api = `/verification`;
    setIsLoading(true);
    try {
      const res: any = await authenticationAPI.HandlerAuthentication(
        api,
        { email },
        'post',
      );

      setLimit(120);
      setCurrentCode(res.data.code);
      setIsLoading(false);

      console.log(res.data.code);
    } catch (error) {
      setIsLoading(false);
      console.log(`Can not send verification code ${error}`);
    }
  };

  const handlerVerification = async () => {
    if (limit > 0) {
      if (parseInt(newCode) !== parseInt(currentCode)) {
        setErrorMessage('Invalid code!!!');
      } else {
        setErrorMessage('');

        const api = `/register`;
        const data = {
          email,
          password,
          username: username,
        };

        try {
          const res: any = await authenticationAPI.HandlerAuthentication(
            api,
            data,
            'post',
          );
          dispatch(addAuth(res.data));
          await AsyncStorage.setItem('auth', JSON.stringify(res.data));
        } catch (error) {
          setErrorMessage('User has already exist!!!');
          console.log(`Can not create new user ${error}`);
        }
      }
    } else {
      setErrorMessage('Time out verification code, please resend new code!!!');
    }
  };

  return (
    <ContainerComponent back isImageBackground isScroll>
      <SectionComponent>
        <TextComponent text="Verification" title />
        <SpaceComponent height={12} />
        <TextComponent
          text={`We’ve send you the verification code on ${email.replace(
            /.{1,5}/,
            (m: any) => '*'.repeat(m.length),
          )}`}
        />
        <SpaceComponent height={26} />
        <RowComponent justify="space-around">
          <TextInput
            keyboardType="number-pad"
            value={codeValues[0]}
            ref={ref1}
            style={styles.input}
            maxLength={1}
            onChangeText={val => {
              val.length > 0 && ref2.current.focus();
              handlerChangeCode(val, 0);
            }}
            placeholder="-"
          />
          <TextInput
            keyboardType="number-pad"
            value={codeValues[1]}
            ref={ref2}
            style={styles.input}
            maxLength={1}
            onChangeText={val => {
              val.length > 0 && ref3.current.focus();
              handlerChangeCode(val, 1);
            }}
            placeholder="-"
          />
          <TextInput
            keyboardType="number-pad"
            value={codeValues[2]}
            ref={ref3}
            style={styles.input}
            maxLength={1}
            onChangeText={val => {
              val.length > 0 && ref4.current.focus();
              handlerChangeCode(val, 2);
            }}
            placeholder="-"
          />
          <TextInput
            keyboardType="number-pad"
            value={codeValues[3]}
            ref={ref4}
            style={styles.input}
            maxLength={1}
            onChangeText={val => {
              handlerChangeCode(val, 3);
            }}
            placeholder="-"
          />
        </RowComponent>
      </SectionComponent>
      <SectionComponent styles={{ marginTop: 40 }}>
        <ButtonComponent
          disabled={newCode.length !== 4}
          onPress={handlerVerification}
          text="Continue"
          type="primary"
          icon={
            <View
              style={[
                globalStyles.iconContainer,
                {
                  backgroundColor:
                    newCode.length !== 4 ? appColors.gray : appColors.primary5,
                },
              ]}>
              <ArrowCircleRight2 size={30} color={appColors.white} />
            </View>
          }
          iconFlex="right"
        />
      </SectionComponent>
      {errorMessage && (
        <SectionComponent>
          <TextComponent
            styles={{ textAlign: 'center' }}
            text={errorMessage}
            color={appColors.danger}
          />
        </SectionComponent>
      )}
      <SectionComponent>
        {limit > 0 ? (
          <RowComponent justify="center">
            <TextComponent text="Re-send code in" flex={0} />
            <TextComponent
              text={`${(limit - (limit % 60)) / 60} : ${limit - (limit - (limit % 60))
                }`}
              flex={0}
              color={appColors.link}
            />
          </RowComponent>
        ) : (
          <RowComponent>
            <ButtonComponent
              type="link"
              text="Resend code"
              onPress={handlerResendVerification}
            />
          </RowComponent>
        )}
      </SectionComponent>
      <LoadingModal visible={isLoading} />
    </ContainerComponent>
  );
};

export default Verification;

const styles = StyleSheet.create({
  input: {
    height: 55,
    width: 55,
    borderWidth: 1,
    borderColor: appColors.gray2,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 24,
    fontFamily: fontFamilies.bold,
    textAlign: 'center',
  },
});
