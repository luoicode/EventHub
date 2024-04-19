import {
    useAsyncStorage,
} from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import userAPI from '../apis/userApi';
import { AuthState, addAuth, addFollowedEvent, authSelector } from '../redux/reducers/authReducer';
import { SplashScreen } from '../screens';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { UserHandler } from '../utils/UserHandlers';
const AppRouters = () => {
    const [isShowSplash, setIsShowSplash] = useState(true);
    const { getItem } = useAsyncStorage('auth');
    const auth: AuthState = useSelector(authSelector);



    const dispatch = useDispatch();
    useEffect(() => {
        handlerGetDatas();

    }, []);

    useEffect(() => {
        if (auth.id) {
            UserHandler.getFollowersById(auth.id, dispatch);
            UserHandler.getFollowingByUid(auth.id, dispatch);

        }


    }, [auth.id]);

    const handlerGetDatas = async () => {
        await checkLogin();

        setIsShowSplash(false);
    };

    const checkLogin = async () => {
        const res = await getItem();
        res && dispatch(addAuth(JSON.parse(res)));
    };



    return (
        <>
            {isShowSplash ? (
                <SplashScreen />
            ) : auth.accesstoken ? (
                <MainNavigator />
            ) : (
                <AuthNavigator />
            )}
        </>
    );
};

export default AppRouters;
