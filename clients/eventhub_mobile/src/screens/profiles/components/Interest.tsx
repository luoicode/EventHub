import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { RowComponent, SpaceComponent, TextComponent } from '../../../components';
import { globalStyles } from '../../../styles/globalStyles';
import { appColors } from '../../../constants/appColors';
import { Edit2 } from 'iconsax-react-native';
import { fontFamilies } from '../../../constants/fontFamilies';
import { ProfileModel } from '../../../models/ProfileModel';
import eventAPI from '../../../apis/eventApi';
import { Category } from '../../../models/Category';
import { ModalSelectCategories } from '../../../modals';
import { useNavigation } from '@react-navigation/native';
import { AuthState, authSelector } from '../../../redux/reducers/authReducer';
import { useSelector } from 'react-redux';

interface Props {
    profile: ProfileModel;
}

const Interest = (props: Props) => {
    const { profile } = props;
    const [isVisibleModalCategory, setIsVisibleModalCategory] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const auth: AuthState = useSelector(authSelector);
    const navigation: any = useNavigation();

    useEffect(() => {
        getCategories();
    }, []);

    const getCategories = async () => {
        const api = `/get-categories`;

        try {
            const res: any = await eventAPI.HandlerEvent(api);

            setCategories(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const isOwner = auth.id === profile.uid;

    return (
        <>
            <RowComponent>
                <TextComponent
                    flex={1}
                    text="Interest"
                    size={26}
                    title
                    styles={{ paddingVertical: 10 }}
                />
                {isOwner && (
                    <RowComponent
                        styles={[globalStyles.tag, { backgroundColor: appColors.primary7 }]}
                        onPress={() => setIsVisibleModalCategory(true)}>
                        <Edit2 size={18} color={appColors.primary5} />
                        <SpaceComponent width={8} />
                        <TextComponent
                            text="Change"
                            font={fontFamilies.medium}
                            color={appColors.primary5}
                        />
                    </RowComponent>
                )}
            </RowComponent>
            <RowComponent styles={{ flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                {categories.length > 0 &&
                    profile.interest &&
                    categories.map(
                        item =>
                            profile.interest?.includes(item._id) && (
                                <View
                                    key={item._id}
                                    style={[
                                        globalStyles.tag,
                                        { backgroundColor: item.color, margin: 6 },
                                    ]}>
                                    <TextComponent
                                        text={item.title}
                                        color={appColors.primary7}
                                        font={fontFamilies.medium}
                                    />
                                </View>
                            ),
                    )}
            </RowComponent>
            <ModalSelectCategories
                categories={categories}
                selected={profile.interest}
                onSelected={vals => {
                    setIsVisibleModalCategory(false);
                    navigation.navigate('ProfileScreen', {
                        isUpdated: true,
                        id: profile.uid,
                    });
                }}
                onClose={() => setIsVisibleModalCategory(false)}
                visible={isVisibleModalCategory}
            />
        </>

    )
}

export default Interest;
