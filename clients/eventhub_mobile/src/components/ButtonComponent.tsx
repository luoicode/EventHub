import {
  View,
  Text,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import React, { ReactNode } from 'react';

import { globalStyles } from '../styles/globalStyles';
import { TextComponent } from '.';
import { appColors } from '../constants/appColors';
import { fontFamilies } from '../constants/fontFamilies';

interface Props {
  text: string;
  type?: 'primary' | 'text' | 'link';
  styles?: StyleProp<ViewStyle>;
  color?: string;
  textColor?: string;
  textStyles?: StyleProp<TextStyle>;
  icon?: ReactNode;
  onPress?: () => void;
  iconFlex?: 'right' | 'left';
  textFont?: string;
  disabled?: boolean;
}

const ButtonComponent = (props: Props) => {
  const {
    icon,
    text,
    color,
    type,
    styles,
    textColor,
    textStyles,
    onPress,
    iconFlex,
    textFont,
    disabled,
  } = props;
  return type === 'primary' ? (
    <View style={{ alignItems: 'center' }}>
      <TouchableOpacity
        disabled={disabled}
        onPress={onPress}
        style={[
          globalStyles.button,
          globalStyles.shadow,
          {
            backgroundColor: color
              ? color
              : disabled
                ? appColors.gray4
                : appColors.primary,
            marginBottom: 17,
            width: '80%',
          },
          styles,
        ]}>
        {icon && iconFlex === 'left' && icon}
        <TextComponent
          text={text}
          color={textColor ?? appColors.white}
          styles={[
            textStyles,
            {
              marginLeft: icon ? 12 : 0,
              fontSize: 16,
              textAlign: 'center',
            },
          ]}
          flex={icon && iconFlex === 'right' ? 1 : 0}
          font={textFont ?? fontFamilies.medium}
        />
        {icon && iconFlex === 'right' && icon}
      </TouchableOpacity>
    </View>
  ) : (
    <TouchableOpacity onPress={onPress}>
      <TextComponent
        flex={0}
        text={text}
        color={type === 'link' ? appColors.link : appColors.text}
      />
    </TouchableOpacity>
  );
};

export default ButtonComponent;
