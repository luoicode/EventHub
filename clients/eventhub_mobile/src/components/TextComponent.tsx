import React from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';
import { appColors } from '../constants/appColors';
import { fontFamilies } from '../constants/fontFamilies';
import { globalStyles } from '../styles/globalStyles';

interface Props {
  text: string;
  color?: string;
  size?: number;
  flex?: number;
  font?: string;
  styles?: StyleProp<TextStyle>;
  title?: boolean;
  numberOfLine?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
}

const TextComponent = (props: Props) => {
  const { text, size, flex, font, color, styles, title, numberOfLine, ellipsizeMode } = props;

  const fontSizeDefault = 16;

  return (
    <Text
      numberOfLines={numberOfLine}
      ellipsizeMode={ellipsizeMode}
      style={[
        globalStyles.text,
        {
          color: color ?? appColors.primary5,
          flex: flex ?? 0,
          fontSize: size ? size : title ? 24 : fontSizeDefault,
          fontFamily: font
            ? font
            : title
              ? fontFamilies.medium
              : fontFamilies.regular,
        },
        styles,
      ]}>
      {text}
    </Text>
  );
};

export default TextComponent;
