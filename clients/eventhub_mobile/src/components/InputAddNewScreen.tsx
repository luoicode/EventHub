import React, { ReactNode } from 'react';
import { KeyboardType, StyleProp, StyleSheet, TextInput, View, ViewStyle } from 'react-native';
import { appColors } from '../constants/appColors';
import { fontFamilies } from '../constants/fontFamilies';

interface Props {
    value: string;
    onChange: (val: string) => void;
    affix?: ReactNode;
    placeholder?: string;
    suffix?: ReactNode;
    type?: KeyboardType;
    onEnd?: () => void;
    multiline?: boolean;
    numberOfLine?: number;
    styles?: StyleProp<ViewStyle>
    fontSize?: number
}

const InputAddNewScreen = (props: Props) => {
    const {
        value,
        onChange,
        affix,
        suffix,
        placeholder,
        type,
        onEnd,
        multiline,
        numberOfLine,
        styles

    } = props;

    return (
        <View style={[
            localStyles.input, styles
        ]}>
            {affix ?? affix}
            <TextInput
                style={[
                    localStyles.input,
                    localStyles.text,
                    {
                        paddingHorizontal: affix || suffix ? 12 : 0,
                        // textAlignVertical: multiline ? 'top' : 'auto',
                        textAlignVertical: 'center',

                        fontSize: props.fontSize ?? 18,
                    },
                ]}
                multiline={multiline}
                numberOfLines={numberOfLine}
                value={value}
                placeholder={placeholder ?? ''}
                onChangeText={val => onChange(val)}
                placeholderTextColor={'#747688'}
                keyboardType={type ?? 'default'}
                autoCapitalize="none"
                onEndEditing={onEnd}
            />
            {suffix ?? suffix}
        </View>
    );
};

export default InputAddNewScreen;
const localStyles = StyleSheet.create({
    input: {
        flexDirection: 'row',
        borderColor: appColors.primary5,
        width: '100%',
        minHeight: 56,
        paddingVertical: 5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
        backgroundColor: appColors.primary7,
        // marginBottom: 19,

    },
    text: {
        fontFamily: fontFamilies.regular,
        fontSize: 18,
        color: appColors.primary5,
    },

});