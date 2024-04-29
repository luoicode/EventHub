import { Location } from 'iconsax-react-native';
import React, { useState } from 'react';
import { CardComponent, RowComponent, SpaceComponent, TextComponent } from '.';
import { appColors } from '../constants/appColors';
import { ModalLocation } from '../modals';
import { globalStyles } from '../styles/globalStyles';

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
                styles={{ marginLeft: 6 }}>
                <CardComponent
                    styles={[
                        globalStyles.noSpaceCard,
                        { width: 56, height: 45, minHeight: 56 },
                    ]}
                    color={appColors.primary}>
                    <Location color={appColors.primary3} size={36} variant='Bold' />
                </CardComponent>
                <SpaceComponent width={12} />
                <TextComponent
                    numberOfLine={1}
                    text={addressSelected ? addressSelected.address : 'Choice location'}
                    flex={1}
                />
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
