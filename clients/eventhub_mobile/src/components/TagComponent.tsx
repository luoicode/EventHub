import React, { ReactNode } from 'react';
import { StyleProp, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { TextComponent } from '.';
import { appColors } from '../constants/appColors';
import { fontFamilies } from '../constants/fontFamilies';
import { globalStyles } from '../styles/globalStyles';

interface Props {
    onPress?: () => void;
    label: string;
    icon?: ReactNode;
    textColor?: string;
    bgColor?: string;
    styles?: StyleProp<ViewStyle>;
    textStyles?: StyleProp<TextStyle>;
}

const TagComponent = (props: Props) => {
    const { onPress, label, icon, textColor, bgColor, styles, textStyles } = props;

    return (
        <TouchableOpacity
            disabled={!onPress}
            onPress={onPress}
            style={[
                globalStyles.row,
                globalStyles.tag,
                globalStyles.center,
                {
                    backgroundColor: bgColor ? bgColor : appColors.primary7,
                },
                styles,
            ]}>
            {icon && icon}
            <TextComponent
                font={fontFamilies.medium}
                text={label}
                styles={[{ marginLeft: icon ? 8 : 0 }, textStyles]}
                color={
                    textColor ? textColor : bgColor ? appColors.primary7 : appColors.gray
                }
            />
        </TouchableOpacity>
    );
};

export default TagComponent;