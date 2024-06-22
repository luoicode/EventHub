import { Calendar, Clock } from 'iconsax-react-native';
import React, { useState } from 'react';
import { View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { RowComponent, TextComponent } from '.';
import { appColors } from '../constants/appColors';
import { fontFamilies } from '../constants/fontFamilies';
import { dateTime } from '../utils/dateTime';

interface Props {
    selected?: Date;
    type: 'date' | 'time';
    onSelect: (val: number) => void;
    label?: string;
}

const DateTimePicker = (props: Props) => {
    const { selected, type, onSelect, label } = props;
    const [isShowDatePicker, setIsShowDatePicker] = useState(false);

    return (
        <View style={{ flex: 1 }}>
            {label && <TextComponent text={label} styles={{ marginBottom: 8 }} />}
            <RowComponent
                onPress={() => setIsShowDatePicker(true)}>
                {
                    type === 'time' ? <Clock size={30} color={appColors.gray} /> : <Calendar size={30} color={appColors.gray} />
                }
                <TextComponent
                    styles={{ marginLeft: 16 }}
                    text={`${selected
                        ? type === 'time'
                            ? dateTime.GetTime(selected)
                            : dateTime.GetDate(selected)
                        : 'Choice'
                        }`}
                    flex={1}
                    font={fontFamilies.medium}
                />

            </RowComponent>
            <DatePicker
                onCancel={() => setIsShowDatePicker(false)}
                onConfirm={val => {
                    setIsShowDatePicker(false);
                    onSelect(new Date(val).getTime());
                }}
                open={isShowDatePicker}
                mode={type}
                date={new Date()}
                modal
            />
        </View>
    );
};

export default DateTimePicker;
