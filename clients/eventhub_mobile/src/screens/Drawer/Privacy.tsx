import AsyncStorage from '@react-native-async-storage/async-storage';
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
import { useDispatch, useSelector } from 'react-redux';
import { authSelector, removeAuth } from '../../redux/reducers/authReducer';
import { HandlerNotification } from '../../utils/handlerNotification';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager } from 'react-native-fbsdk-next';

const Privacy = () => {
    const [email, setEmail] = useState('');
    const [isDissble, setIsDissable] = useState(true);
    const [isLoading, setiIsLoading] = useState(false);
    const auth = useSelector(authSelector);
    const dispatch = useDispatch();

    const handlerCheckEmail = () => {
        const isValidEmail = Validate.email(email);
        setIsDissable(!isValidEmail);
    };
    const handlerLogout = async () => {
        const fcmtoken = await AsyncStorage.getItem('fcmtoken');
        if (fcmtoken) {
            if (auth.fcmTokens && auth.fcmTokens.length > 0) {
                const items = [...auth.fcmTokens];
                const index = items.findIndex(element => element === fcmtoken);
                if (index !== -1) {
                    items.splice(index, 1);
                }
                await HandlerNotification.Update(auth.id, items);
            }
        }
        await GoogleSignin.signOut();
        LoginManager.logOut();
        await AsyncStorage.removeItem('auth');
        dispatch(removeAuth({}));
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

            Alert.alert('Send mail', 'We sended a email includes new password');
            await handlerLogout();

            setiIsLoading(false);
        } catch (error) {
            setiIsLoading(false);
            console.log(`We couln't find your accoun, ${error}`);
        }
    };

    return (
        <ContainerComponent back isImageBackground title='Priavcy'>
            <SectionComponent>
                <TextComponent text="Change Password" title />
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

export default Privacy;
