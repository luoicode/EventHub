import React, { ReactNode, useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { TagComponent } from '.';
import { appColors } from '../constants/appColors';
import { Category } from '../models/Category';
import eventAPI from '../apis/eventApi';
import { useNavigation } from '@react-navigation/native';
interface Props {
    isFill?: boolean;
}

const CategoriesList = (props: Props) => {
    const { isFill } = props;
    const [categories, setCategories] = useState<Category[]>([]);

    const navigation: any = useNavigation();

    useEffect(() => {
        getCategories();
    }, []);

    const getCategories = async () => {
        const api = `/get-categories`;

        try {
            const res = await eventAPI.HandlerEvent(api);
            setCategories(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const renderIcon = (key: string) => {
        let icon = <></>;
        switch (key) {
            case 'music':
                icon = (
                    <FontAwesome5
                        name="music"
                        size={22}
                        color={isFill ? appColors.primary7 : '#F59762'}
                    />
                );
                break;
            case 'food':
                icon = (
                    <FontAwesome6
                        name="bowl-food"
                        size={22}
                        color={isFill ? appColors.primary7 : '#29D697'}
                    />
                );
                break;
            case 'arts':
                icon = (
                    <Ionicons
                        name="color-palette-outline"
                        size={22}
                        color={isFill ? appColors.primary7 : '#46CDFB'}
                    />
                );
                break;
            case 'game':
                icon = (
                    <Ionicons
                        name="game-controller"
                        size={22}
                        color={isFill ? appColors.primary7 : '#E1AFD1'}
                    />
                );
                break;
            default:
                icon = (
                    <FontAwesome5
                        name="basketball-ball"
                        size={22}
                        color={isFill ? appColors.primary7 : '#F0635A'}
                    />
                );
                break;
        }
        return icon;
    };


    return categories.length > 0 ? (
        <FlatList
            style={{ paddingHorizontal: 16 }}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={item => item._id}
            renderItem={({ item, index }) => (
                <TagComponent
                    styles={{
                        marginRight: index === categories.length - 1 ? 38 : 12,
                        minWidth: 82,
                    }}
                    bgColor={isFill ? item.color : appColors.primary7}
                    onPress={() => navigation.navigate('CategoryDetail', {
                        id: item._id,
                        title: item.title
                    })}
                    icon={renderIcon(item.key)}
                    label={item.title}
                    textColor={isFill ? appColors.primary7 : appColors.text2}
                />
            )}
        />
    ) : (
        <></>
    );
};

export default CategoriesList;
