import React, { ReactNode, useEffect, useState } from 'react';
import { FlatList, Image } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { ButtonComponent, TagComponent } from '.';
import { appColors } from '../constants/appColors';
import { Category } from '../models/Category';
import eventAPI from '../apis/eventApi';
import { useIsFocused, useNavigation } from '@react-navigation/native';
interface Props {
    isFill?: boolean;
    onFilter?: (id: string) => void;
}

const CategoriesList = (props: Props) => {
    const { isFill, onFilter } = props;
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoriesSelected, setCategoriesSelected] = useState('');

    const navigation: any = useNavigation();

    useEffect(() => {
        getCategories();
    }, []);
    useEffect(() => {
        if (categoriesSelected && onFilter) {
            onFilter(categoriesSelected)
        };
    }, [categoriesSelected]);
    const getCategories = async () => {
        const api = `/get-categories`;

        try {
            const res = await eventAPI.HandlerEvent(api);
            setCategories(res.data);
        } catch (error) {
            console.log(error);
        }
    };



    const handlerSelecCategory = async (item: Category) => {
        if (!onFilter) {
            navigation.navigate('CategoryDetail', {
                id: item._id,
                title: item.title,
            });
        } else {
            setCategoriesSelected(item._id);
        }
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
                    bgColor={
                        isFill
                            ? item.color
                            : categoriesSelected === item._id
                                ? item.color
                                : appColors.primary7
                    }
                    onPress={() => handlerSelecCategory(item)}
                    icon={
                        <Image
                            source={{
                                uri: isFill
                                    ? item.iconWhite
                                    : categoriesSelected === item._id
                                        ? item.iconWhite
                                        : item.iconColor,
                            }}
                            style={{ width: 24, height: 24 }}
                        />
                    }
                    label={item.title}
                    textColor={isFill ? appColors.primary7 : categoriesSelected === item._id ? appColors.primary7 : appColors.text2}
                />
            )}
        />
    ) : (
        <></>
    );
};

export default CategoriesList;
