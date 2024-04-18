import React, { ReactNode } from 'react';
import { FlatList } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { TagComponent } from '.';
import { appColors } from '../constants/appColors';
import { Category } from '../models/Category';
interface Props {
    isFill?: boolean;
}


const CategoriesList = (props: Props) => {
    const { isFill } = props;
    const categories: Category[] = [
        {
            key: 'sports',
            label: 'Sports',
            icon: (
                <FontAwesome5
                    name="basketball-ball"
                    size={22}
                    color={isFill ? appColors.white : '#F0635A'}
                />
            ),
            color: '#F0635A',
        },
        {
            key: 'music',
            label: 'Music',
            icon: (
                <FontAwesome5
                    name="music"
                    size={22}
                    color={isFill ? appColors.white : '#F59762'}
                />
            ),
            color: '#F59762',
        },
        {
            key: 'food',
            label: 'Food',
            icon: <FontAwesome6
                name="bowl-food"
                size={22}
                color={isFill ? appColors.white : '#29D697'}
            />,
            color: '#29D697',
        },
        {
            key: 'arts',
            label: 'Arts',
            icon: (
                <Ionicons
                    name="color-palette-outline"
                    size={22}
                    color={isFill ? appColors.white : '#46CDFB'}
                />
            ),
            color: '#46CDFB',
        },
        {
            key: 'games',
            label: 'Games',
            icon: (
                <Ionicons
                    name="game-controller"
                    size={22}
                    color={isFill ? appColors.white : '#E1AFD1'}
                />
            ),
            color: '#E1AFD1',
        },
    ];

    return (
        <FlatList
            style={{ paddingHorizontal: 16 }}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            renderItem={({ item, index }) => (
                <TagComponent
                    styles={{
                        marginRight: index === categories.length - 1 ? 38 : 12,
                        minWidth: 82,
                    }}
                    bgColor={isFill ? item.color : appColors.white}
                    onPress={() => { }}
                    icon={item.icon}
                    label={item.label}
                    textColor={isFill ? appColors.white : appColors.text2}
                />
            )}
        />
    );
};

export default CategoriesList;
