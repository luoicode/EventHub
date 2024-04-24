import { Calendar, Clock } from 'iconsax-react-native';
import React, { useState } from 'react';
import { View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { RowComponent, TextComponent } from '.';
import { appColors } from '../constants/appColors';
import { fontFamilies } from '../constants/fontFamilies';
import { globalStyles } from '../styles/globalStyles';
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
                styles={[globalStyles.inputContainer]}
                onPress={() => setIsShowDatePicker(true)}>
                <TextComponent
                    styles={{ textAlign: 'center' }}
                    text={`${selected
                        ? type === 'time'
                            ? dateTime.GetTime(selected)
                            : dateTime.GetDate(selected)
                        : 'Choice'
                        }`}
                    flex={1}
                    font={fontFamilies.medium}
                />
                {
                    type === 'time' ? <Clock size={24} color={appColors.gray} /> : <Calendar size={24} color={appColors.gray} />
                }
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
