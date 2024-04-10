import React, { ReactNode } from 'react';
import { FlatList } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { TagComponent } from '.';
import { appColors } from '../constants/appColors';
interface Props {
    isColor?: boolean;
}

interface Category {
    icon: ReactNode;
    color: string;
    label: string;
    key: string;
}

const CategoriesList = (props: Props) => {
    const { isColor } = props;
    const categories: Category[] = [
        {
            key: 'sports',
            label: 'Sports',
            icon: (
                <FontAwesome5
                    name="basketball-ball"
                    size={22}
                    color={isColor ? appColors.white : '#F0635A'}
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
                    color={isColor ? appColors.white : '#F59762'}
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
                color={isColor ? appColors.white : '#29D697'}
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
                    color={isColor ? appColors.white : '#46CDFB'}
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
                    color={isColor ? appColors.white : '#E1AFD1'}
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
                    bgColor={isColor ? item.color : appColors.white}
                    onPress={() => { }}
                    icon={item.icon}
                    label={item.label}
                    textColor={isColor ? appColors.white : appColors.text2}
                />
            )}
        />
    );
};

export default CategoriesList;
