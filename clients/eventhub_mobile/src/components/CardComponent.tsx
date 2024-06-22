// CardComponent.tsx
import React, { ReactNode } from 'react';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import { appColors } from '../constants/appColors';
import { globalStyles } from '../styles/globalStyles';

interface Props {
    onPress?: () => void;
    children: ReactNode;
    styles?: StyleProp<ViewStyle>;
    isShadows?: boolean;
    color?: string;
    disabled?: boolean;
}

const CardComponent = (props: Props) => {
    const { onPress, children, styles, isShadows, color, disabled } = props;
    const localStyles: StyleProp<ViewStyle>[] = [
        globalStyles.card,
        isShadows ? globalStyles.shadow : undefined,
        { backgroundColor: color ?? appColors.white },
        styles,
    ];

    if (disabled) {
        return (
            <View style={localStyles}>
                {children}
            </View>
        );
    }

    return (
        <TouchableOpacity style={localStyles} onPress={onPress}>
            {children}
        </TouchableOpacity>
    );
};

export default CardComponent;
