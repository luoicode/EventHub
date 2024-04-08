import { ArrowRight2, Location } from 'iconsax-react-native';
import React, { useState } from 'react';
import { CardComponent, RowComponent, SpaceComponent, TextComponent } from '.';
import { appColors } from '../constants/appColors';
import { globalStyles } from '../styles/globalStyles';
import { ModalLocation } from '../modals';

interface Props {
    onSelect: (val: any) => void;
}

const ChoiceLocation = (props: Props) => {
    const { onSelect } = props;
    const [isVisibleModalLocation, setisVisibleModalLocation] = useState(false);
    const [addressSelected, setAddressSelected] = useState<{
        address: string;
        position?: {
            lat: number;
            long: number;
        };
    }>();

    return (
        <>
            <RowComponent
                onPress={() => setisVisibleModalLocation(!isVisibleModalLocation)}
                styles={[globalStyles.inputContainer]}>
                <CardComponent
                    styles={[
                        globalStyles.noSpaceCard,
                        { width: 56, height: 45, minHeight: 56 },
                    ]}
                    color={`${appColors.primary}33`}>
                    <CardComponent
                        styles={[globalStyles.noSpaceCard, { width: 30, height: 30 }]}
                        color={appColors.white}>
                        <Location color={appColors.primary} size={18} />
                    </CardComponent>
                </CardComponent>
                <SpaceComponent width={12} />

                <TextComponent
                    numberOfLine={1}
                    text={addressSelected ? addressSelected.address : 'Choice location'}
                    flex={1}
                />
                <ArrowRight2 size={22} color={appColors.primary} />
            </RowComponent>
            <ModalLocation
                visible={isVisibleModalLocation}
                onClose={() => setisVisibleModalLocation(false)}
                onSelect={val => {
                    setAddressSelected(val);
                    onSelect(val);
                }}
            />
        </>
    );
};

export default ChoiceLocation;
