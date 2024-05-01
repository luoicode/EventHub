import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { useSelector } from 'react-redux';
import eventAPI from '../apis/eventApi';
import userAPI from '../apis/userApi';
import {
    ButtonComponent,
    RowComponent,
    SectionComponent,
    TextComponent,
} from '../components';
import { appColors } from '../constants/appColors';
import { Category } from '../models/Category';
import { authSelector } from '../redux/reducers/authReducer';
import { globalStyles } from '../styles/globalStyles';
import { fontFamilies } from '../constants/fontFamilies';

interface Props {
    visible: boolean;
    onClose: () => void;
    onSelected: (vals: string[]) => void;
    selected?: string[];
    categories: Category[];
}

const ModalSelectCategories = (props: Props) => {
    const { visible, onClose, onSelected, selected, categories } = props;
    const [catsSelected, setCatsSelected] = useState<string[]>(selected ?? []);
    const modalizeRef = useRef<Modalize>();
    const auth = useSelector(authSelector);

    useEffect(() => {
        if (visible) {
            modalizeRef.current?.open();
        } else {
            modalizeRef.current?.close();
        }
    }, [visible]);

    const onSelectedCategory = (id: string) => {
        const items = [...catsSelected];

        const index = items.findIndex(element => element === id);
        if (index !== -1) {
            items.splice(index, 1);
            setCatsSelected(items);
        } else {
            setCatsSelected([...items, id]);
        }
    };

    const handlerUpdateInterest = async () => {
        const api = `/update-interest?uid=${auth.id}`;

        try {
            await userAPI.HandlerUser(api, catsSelected, 'put');

            onSelected(catsSelected);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <Portal>
            <Modalize
                handlePosition="inside"
                adjustToContentHeight
                ref={modalizeRef}
                onClose={onClose}>

                <SectionComponent styles={{ padding: 30, backgroundColor: appColors.primary7 }}>
                    <RowComponent>
                        {categories.length > 0 &&
                            categories.map(category => (
                                <TouchableOpacity
                                    onPress={() => onSelectedCategory(category._id)}
                                    style={[
                                        globalStyles.shadow,
                                        globalStyles.center,
                                        {
                                            padding: 12,
                                            marginRight: 8,
                                            marginBottom: 8,
                                            backgroundColor: appColors.primary7,
                                            borderRadius: 12,
                                            minWidth: 60,
                                            borderWidth: catsSelected?.includes(category._id)
                                                ? 2
                                                : 0,
                                            borderColor: catsSelected?.includes(category._id)
                                                ? appColors.primary5
                                                : appColors.gray2,

                                        },
                                    ]}
                                    key={category._id}>
                                    <TextComponent text={category.title} font={fontFamilies.medium} />
                                </TouchableOpacity>
                            ))}
                    </RowComponent>
                </SectionComponent>
                <SectionComponent styles={{ backgroundColor: appColors.primary7 }}>
                    <ButtonComponent
                        text="Agree"
                        type="primary"
                        onPress={handlerUpdateInterest}
                    />
                </SectionComponent>
            </Modalize>
        </Portal>
    );
};

export default ModalSelectCategories;
