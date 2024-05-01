import { Lock1, Sms, User } from 'iconsax-react-native';
import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { appColors } from '../../constants/appColors';
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
import { LoadingModal } from '../../modals';
import authenticationAPI from '../../apis/authApi';
import { Validate } from '../../utils/validate';
import { useDispatch } from 'react-redux';
import { addAuth } from '../../redux/reducers/authReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ErrorMessages {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const initValue = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
};

const SignUpScreen = ({ navigation }: any) => {
    const [values, setValues] = useState(initValue);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<any>();
    const [isDisable, setIsDisable] = useState(true);

    const dispatch = useDispatch();

    useEffect(() => {
        if (
            !errorMessage ||
            (errorMessage &&
                (errorMessage.username ||
                    errorMessage.email ||
                    errorMessage.password ||
                    errorMessage.confirmPassword)) ||
            !values.username ||
            !values.email ||
            !values.password ||
            !values.confirmPassword
        ) {
            setIsDisable(true);
        } else {
            setIsDisable(false);
        }
    }, [errorMessage, values]);

    const handlerChangeValue = (key: string, value: string) => {
        const data: any = { ...values };
        data[`${key}`] = value;
        setValues(data);
    };

    const formValidator = (key: string) => {
        const data = { ...errorMessage };
        let messgae = ``;

        switch (key) {
            case 'username':
                if (!values.username) {
                    messgae = `Username is required`;
                } else {
                    messgae = '';
                }
                break;

            case 'email':
                if (!values.email) {
                    messgae = `Email is required`;
                } else if (!Validate.email(values.email)) {
                    messgae = 'Email is not valid!';
                } else {
                    messgae = '';
                }
                break;

            case 'password':
                messgae = !values.password ? `Password is required` : '';
                break;

            case 'confirmPassword':
                if (!values.confirmPassword) {
                    messgae = `Confirm password is required`;
                } else if (values.confirmPassword !== values.password) {
                    messgae = 'Pasword is not match!';
                } else {
                    messgae = '';
                }
                break;
        }
        data[`${key}`] = messgae;
        setErrorMessage(data);
    };
    const handlerRegister = async () => {
        const api = `/verification`;
        setIsLoading(true);
        try {
            const res = await authenticationAPI.HandlerAuthentication(
                api,
                { email: values.email },
                'post',
            );

            setIsLoading(false);
            navigation.navigate('Verification', {
                code: res.data.code,
                ...values,
            });
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };
    return (
        <>
            <ContainerComponent isImageBackground isScroll back styles={{ backgroundColor: appColors.primary4 }}>
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
                    <TextComponent text="Sign Up" size={24} title />
                    <SpaceComponent height={21} />
                    <InputComponent
                        value={values.username}
                        placeholder="Full name"
                        onChange={val => handlerChangeValue('username', val)}
                        allowClear
                        affix={<User size={22} color={appColors.gray} />}
                        onEnd={() => formValidator('username')}
                    />
                    <InputComponent
                        value={values.email}
                        placeholder="abcd123@gmail.com"
                        onChange={val => handlerChangeValue('email', val)}
                        allowClear
                        affix={<Sms size={22} color={appColors.gray} />}
                        onEnd={() => formValidator('email')}
                    />
                    <InputComponent
                        value={values.password}
                        placeholder="Password"
                        onChange={val => handlerChangeValue('password', val)}
                        isPassword
                        allowClear
                        affix={<Lock1 size={22} color={appColors.gray} />}
                        onEnd={() => formValidator('password')}
                    />
                    <InputComponent
                        value={values.confirmPassword}
                        placeholder="Confirm Password"
                        onChange={val => handlerChangeValue('confirmPassword', val)}
                        isPassword
                        allowClear
                        affix={<Lock1 size={22} color={appColors.gray} />}
                        onEnd={() => formValidator('confirmPassword')}
                    />
                </SectionComponent>

                {errorMessage && (
                    <SectionComponent>
                        {Object.keys(errorMessage).map(
                            (error, index) =>
                                errorMessage[`${error}`] && (
                                    <TextComponent
                                        text={errorMessage[`${error}`]}
                                        key={`error${index}`}
                                        color={appColors.danger}
                                    />
                                ),
                        )}
                    </SectionComponent>
                )}
                <SpaceComponent height={16} />
                <SectionComponent>
                    <ButtonComponent
                        text="Sign Up"
                        onPress={handlerRegister}
                        disabled={isDisable}
                        type="primary"
                    />
                </SectionComponent>
                <SocialLogin />
                <SectionComponent>
                    <RowComponent justify="center">
                        <TextComponent text="Already have an account? " />
                        <ButtonComponent
                            text="Sign In"
                            onPress={() => navigation.navigate('SignInScreen')}
                            type="link"
                        />
                    </RowComponent>
                </SectionComponent>
            </ContainerComponent>
            <LoadingModal visible={isLoading} />
        </>
    );
};
export default SignUpScreen;
