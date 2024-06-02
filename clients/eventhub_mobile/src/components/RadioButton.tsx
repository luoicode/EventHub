import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { SelectModel } from '../models/SelectModel';
import SectionComponent from './SectionComponent';
import RowComponent from './RowComponent';
import ButtonComponent from './ButtonComponent';
import { appColors } from '../constants/appColors';
import { globalStyles } from '../styles/globalStyles';
import { fontFamilies } from '../constants/fontFamilies';
import TextComponent from './TextComponent';

interface Props {
  selected?: string;
  onSelect: (id: string) => void;
  data: SelectModel[];
}

const RadioButton = (props: Props) => {
  const { selected, onSelect, data } = props;

  return (
    <SectionComponent>
      <RowComponent
        styles={[
          globalStyles.center,
          {
            paddingHorizontal: 20,
            backgroundColor: '#FCFBFB',
            // backgroundColor: 'coral',
            borderRadius: 100,
            paddingVertical: 8,
          },
        ]}>
        {data.map(item => (
          <TouchableOpacity
            style={[
              globalStyles.center,
              selected && item.value === selected ? globalStyles.shadow : null,
              {
                flex: 1,
                marginBottom: 0,
                paddingVertical: 12,
                backgroundColor:
                  selected === item.value ? appColors.white : '#FCFBFB',
                borderRadius: 100,
              },
            ]}
            key={item.value}
            onPress={() => onSelect(item.value)}>
            <TextComponent
              color={
                selected && selected === item.value
                  ? appColors.primary3
                  : appColors.gray4
              }
              styles={[
                {
                  textTransform: 'uppercase',
                },
              ]}
              font={
                selected && selected === item.value
                  ? fontFamilies.medium
                  : fontFamilies.regular
              }
              text={item.label}
              title
              size={20}
            />
          </TouchableOpacity>
        ))}
      </RowComponent>
    </SectionComponent>
  );
};

export default RadioButton;
