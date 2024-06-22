import { Location } from 'iconsax-react-native';
import React, { useState } from 'react';
import { RowComponent, SpaceComponent, TextComponent } from '.';
import { appColors } from '../constants/appColors';
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
                styles={{ marginLeft: -2 }}>

                <Location color={appColors.primary3} size={36} variant='Bold' />
                <SpaceComponent width={10} />
                <TextComponent
                    numberOfLine={1}
                    text={addressSelected ? addressSelected.address : 'Choice location'}
                    flex={1}
                    size={18}
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
