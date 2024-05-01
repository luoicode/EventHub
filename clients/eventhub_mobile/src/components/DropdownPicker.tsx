import { ArrowDown2, Category, SearchNormal1 } from 'iconsax-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
    ButtonComponent,
    InputComponent,
    RowComponent,
    SpaceComponent,
    TextComponent,
} from '.';
import { appColors } from '../constants/appColors';
import { fontFamilies } from '../constants/fontFamilies';
import { SelectModel } from '../models/SelectModel';
import { globalStyles } from '../styles/globalStyles';

interface Props {
    label?: string;
    values: SelectModel[];
    selected?: string | string[];
    onSelect: (val: string | string[]) => void;
    multible?: boolean;
}

const DropdownPicker = (props: Props) => {
    const { onSelect, selected, values, label, multible } = props;
    const [searchKey, setSearchKey] = useState('');
    const [isVisibleModalize, setIsVisibleModalize] = useState(false);
    const modalieRef = useRef<Modalize>();
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [selectedCount, setSelectedCount] = useState(0);


    useEffect(() => {
        if (isVisibleModalize) {
            modalieRef.current?.open();
        }
    }, [isVisibleModalize]);

    useEffect(() => {
        if (isVisibleModalize && selected) {
            setSelectedItems(multible ? (selected as string[]) : []);
        }
    }, [isVisibleModalize, selected, multible]);

    const handlerSelectItem = (id: string) => {

        if (selectedItems.includes(id)) {
            const data = [...selectedItems];
            const index = selectedItems.findIndex(element => element === id);
            if (index !== -1) {
                data.splice(index, 1);
            }

            setSelectedItems(data);
            setSelectedCount(selectedCount - 1); // Giảm giá trị của selectedCount khi bỏ chọn
        } else {
            if (selectedCount < 5) { // Kiểm tra xem có thể chọn thêm người không
                setSelectedItems([...selectedItems, id]);
                setSelectedCount(selectedCount + 1); // Tăng giá trị của selectedCount khi chọn
            }
        }
    };

    const renderSelectedItem = (id: string) => {
        const item = values.find(element => element.value === id);

        return item ? (
            <RowComponent key={id} styles={[localStyles.selectedItem]}>
                <TextComponent
                    text={`${item.label.includes('@') ? item.label.split('@')[0] : item.label
                        }`}
                    color={appColors.primary3}
                />
                <SpaceComponent width={8} />
                <TouchableOpacity
                    onPress={() => {
                        handlerSelectItem(id);
                        onSelect(selectedItems);
                    }}>
                    <AntDesign name="close" size={18} color={appColors.primary5} />
                </TouchableOpacity>
            </RowComponent>
        ) : (
            <></>
        );
    };

    const renderSelectItem = (item: SelectModel) => {

        return (
            <RowComponent
                key={item.value}
                onPress={
                    multible && selectedCount < 5 ? () => handlerSelectItem(item.value) : () => {
                        onSelect(item.value);
                        modalieRef.current?.close();
                    }
                }
                styles={[localStyles.listItem]}>
                <TextComponent
                    text={item.label}
                    flex={1}
                    font={
                        selectedItems?.includes(item.value)
                            ? fontFamilies.medium
                            : fontFamilies.regular
                    }
                    color={
                        selectedItems?.includes(item.value)
                            ? appColors.primary3
                            : appColors.primary5
                    }
                />
                {selectedItems.includes(item.value) && (
                    <FontAwesome
                        name="check-square-o"
                        size={22}
                        color={appColors.primary3}
                    />
                )}
            </RowComponent>
        );
    };


    return (
        <View >
            {label && <TextComponent text={label} styles={{ marginBottom: 8 }} />}
            <RowComponent justify='flex-start'
                styles={[{ alignItems: 'center' }]}
                onPress={() => setIsVisibleModalize(true)}>
                <RowComponent styles={{ flexWrap: 'wrap', marginLeft: 12 }}>
                    {selected ? (
                        selectedItems.length > 0 ? (
                            selectedItems.map(item => renderSelectedItem(item))
                        ) : (
                            <TextComponent
                                styles={{ marginTop: 20 }}
                                size={18}
                                text={
                                    values.find(element => element.value === selected)?.label ??
                                    'Invite your friend'
                                }
                            />
                        )
                    ) : (
                        <TextComponent size={18} styles={{ marginTop: 20 }} text="Select category" />
                    )}
                </RowComponent>
            </RowComponent>
            <Portal>
                <Modalize
                    handlePosition="inside"
                    ref={modalieRef}
                    FooterComponent={
                        multible && (
                            <View style={{ paddingHorizontal: 20, paddingBottom: 30 }}>
                                <RowComponent>

                                    <ButtonComponent
                                        text="Agree"
                                        type="primary"
                                        onPress={() => {
                                            onSelect(selectedItems);
                                            modalieRef.current?.close();
                                        }}
                                    />
                                    <ButtonComponent
                                        type="primary"
                                        text="Cancel"
                                        color='red'
                                        onPress={() => modalieRef.current?.close()}
                                    />
                                </RowComponent>
                            </View>
                        )
                    }
                    scrollViewProps={{ showsVerticalScrollIndicator: false }}
                    HeaderComponent={
                        <RowComponent
                            styles={{
                                marginBottom: 12,
                                paddingHorizontal: 20,
                                paddingTop: 30,

                            }}>
                            <SpaceComponent width={20} />
                            <TextComponent title size={36} text='Select' />
                        </RowComponent>
                    }
                    onClose={() => setIsVisibleModalize(false)}>
                    <View style={{ paddingHorizontal: 20, paddingVertical: 30 }}>
                        {values.map(item => renderSelectItem(item))}
                    </View>
                </Modalize>
            </Portal>
        </View >
    );
};

export default DropdownPicker;

const localStyles = StyleSheet.create({
    listItem: {
        marginBottom: 20,
    },
    selectedItem: {
        borderWidth: 0.5,
        borderColor: appColors.gray,
        padding: 4,
        marginBottom: 8,
        marginRight: 8,
        borderRadius: 8,
    },
});