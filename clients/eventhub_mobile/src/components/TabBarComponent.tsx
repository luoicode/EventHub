import { ArrowRight2 } from 'iconsax-react-native';
import React from 'react';
import { RowComponent, TextComponent } from '.';
import { appColors } from '../constants/appColors';
interface Props {
    title: string;
    onPress?: () => void;
}

const TabBarComponent = (props: Props) => {
    const { title, onPress } = props;
    return (
        <RowComponent
            styles={{
                marginBottom: 20,
                paddingHorizontal: 16,
            }}>
            <TextComponent text={title} title flex={1} size={26} />
            {onPress && (
                <RowComponent onPress={onPress}>
                    <TextComponent text="See All " size={16} color={appColors.primary7} />
                    <ArrowRight2 size={24} color={appColors.primary7} variant="Bold" />
                </RowComponent>
            )}
        </RowComponent>
    );
};

export default TabBarComponent;
