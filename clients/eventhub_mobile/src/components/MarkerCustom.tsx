import {
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
    Image,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import TextComponent from './TextComponent';
import { globalStyles } from '../styles/globalStyles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { appColors } from '../constants/appColors';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import eventAPI from '../apis/eventApi';
import { Category } from '../models/Category';

interface Props {
    categoryId: string;
}

const MarkerCustom = (props: Props) => {
    const { categoryId } = props;
    const [category, setCategory] = useState<Category>();
    useEffect(() => {
        categoryId && getCategoryById();
    }, [categoryId]);

    const getCategoryById = async () => {
        const api = `/get-category-detail?id=${categoryId}`;

        try {
            const res = await eventAPI.HandlerEvent(api);
            setCategory(res.data);
        } catch (error: any) {
            console.log(error);
        }
    };
    return category ? (
        <ImageBackground
            source={require('../assets/images/Union.png')}
            style={[
                globalStyles.shadow,
                {
                    width: 56,
                    height: 56,
                    justifyContent: 'center',
                    alignItems: 'center',
                },
            ]}
            imageStyle={
                {
                    resizeMode: 'contain',
                    width: 56,
                    height: 56,
                }
            }>
            <View
                style={[
                    globalStyles.center,
                    {
                        top: -3,
                        width: 38,
                        height: 38,
                        backgroundColor: category.color,
                        borderRadius: 12,
                    },
                ]}>
                <Image
                    source={{ uri: category.iconWhite }}
                    style={{ width: 24, height: 24 }}
                />
            </View>
        </ImageBackground >
    ) : (
        <></>
    );
};

export default MarkerCustom;
