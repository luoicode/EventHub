import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { useSelector } from 'react-redux';
import eventAPI from '../apis/eventApi';
import {
  ButtonComponent,
  ChoiceLocation,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../components';
import { appColors } from '../constants/appColors';
import { Category } from '../models/Category';
import { authSelector } from '../redux/reducers/authReducer';
import { globalStyles } from '../styles/globalStyles';
import { fontFamilies } from '../constants/fontFamilies';
import { ArrowRight, Calendar } from 'iconsax-react-native';
import DatePicker from 'react-native-date-picker';
import { dateTime } from '../utils/dateTime';
import { numberToString } from '../utils/numberToString';
import moment from 'moment';
import RnRangeSlider from 'rn-range-slider';
interface Props {
  visible: boolean;
  onClose: () => void;
  onFilter: (val: string) => void;
}

const ModalFilterEvents = (props: Props) => {
  const { visible, onClose, onFilter } = props;
  const [categories, setCategories] = useState<Category[]>([]);
  const [categorySelected, setCategorySelected] = useState<string[]>([]);
  const [isVisibleModalDate, setIsVisibleModalDate] = useState(false);
  const [datetime, setDatetime] = useState<{
    startAt: string;
    endAt: string;
  }>();
  const [timeChoice, settimeChoice] = useState<
    'today' | 'tomorrow' | 'thisWeek'
  >();
  const [postion, setPostion] = useState<{
    lat: number;
    long: number;
  }>();
  const [priceRange, setPriceRange] = useState<{
    low: number;
    high: number;
  }>();

  const modalizeRef = useRef<Modalize>();
  const auth = useSelector(authSelector);
  const timeChoices = [
    { key: 'today', label: 'Today' },
    {
      key: 'tomorrow',
      label: 'Tomorrow',
    },
    {
      key: 'thisWeek',
      label: 'This week',
    },
  ];

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (visible) {
      modalizeRef.current?.open();
    } else {
      modalizeRef.current?.close();
    }
  }, [visible]);

  useEffect(() => {
    if (timeChoice === 'today') {
      const d = new Date();

      const date = `${d.getFullYear()}-${numberToString(
        d.getMonth() + 1,
      )}-${numberToString(d.getDate())}`;

      setDatetime({
        startAt: `${date} 00:00:00`,
        endAt: `${date} 23:59:59`,
      });
    } else if (timeChoice === 'tomorrow') {
      const d = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const date = `${d.getFullYear()}-${numberToString(
        d.getMonth() + 1,
      )}-${numberToString(d.getDate())}`;

      setDatetime({
        startAt: `${date} 00:00:00`,
        endAt: `${date} 23:59:59`,
      });
    } else if (timeChoice === 'thisWeek') {
      const week = moment(new Date()).week();
      const now = moment(new Date()).week(week);

      const start = now.weekday(1).toISOString();
      const end = now.weekday(7).toISOString();

      setDatetime({
        startAt: start,
        endAt: end,
      });
    } else {

    }
  }, [timeChoice]);
  const getCategories = async () => {
    const api = `/get-categories`;

    try {
      const res = await eventAPI.HandlerEvent(api);
      setCategories(res.data);
    } catch (error) {
      console.log('error', error);
    }
  };

  // const handlerSelectCategory = (id: string) => {
  //   const items = [...categorySelected];

  //   const index = items.findIndex(element => element === id);
  //   if (items && items.includes(id)) {
  //     items.splice(index, 1);
  //   } else {
  //     items.push(id);
  //   }

  //   setCategorySelected(items);
  // };
  const handlerSelectCategory = (id: string) => {
    setCategorySelected([id]);
  };

  const handlerValueChange = useCallback((low: number, high: number) => {
    setPriceRange({
      low,
      high,
    });
  }, []);

  const handlerFilter = () => {
    onFilter(
      `/get-events?categoryId=${categorySelected.toString()}&${datetime ? `startAt=${datetime.startAt}&endAt=${datetime.endAt}` : ''
      }${postion ? `&lat=${postion.lat}&long=${postion.long}&distance=5` : ''}${priceRange
        ? `&minPrice=${priceRange.low}&maxPrice=${priceRange.high}`
        : ''
      }`,
    );
    onClose();

  };

  return (
    <>
      <Portal>
        <Modalize
          handlePosition="inside"
          adjustToContentHeight
          ref={modalizeRef}
          onClose={onClose}>
          <SectionComponent
            styles={{ padding: 30, backgroundColor: appColors.primary7 }}>
            <TextComponent title size={28} text="Filter" />
          </SectionComponent>
          {categories.length > 0 && (
            <FlatList
              style={{ marginBottom: 16 }}
              horizontal
              showsHorizontalScrollIndicator={false}
              data={categories}
              renderItem={({ item, index }) => (
                <View
                  style={[
                    globalStyles.center,
                    {
                      marginRight: index < categories.length - 1 ? 16 : 0,
                      marginLeft: index === 0 ? 16 : 0,
                    },
                  ]}
                  key={item._id}>
                  <TouchableOpacity
                    style={[
                      globalStyles.center,
                      {
                        width: 63,
                        height: 63,
                        backgroundColor: categorySelected.includes(item._id)
                          ? item.color
                          : appColors.primary7,
                        borderWidth: 1,
                        borderRadius: 100,
                        borderColor: categorySelected.includes(item._id)
                          ? item.color
                          : appColors.gray2,
                      },
                    ]}
                    onPress={() => handlerSelectCategory(item._id)}
                  >
                    <Image
                      source={{
                        uri: categorySelected.includes(item._id)
                          ? item.iconWhite
                          : item.iconColor,
                      }}
                      style={{ width: 32, height: 32 }}
                    />
                  </TouchableOpacity>
                  <SpaceComponent height={8} />
                  <TextComponent numberOfLine={1} text={item.title} />
                </View>
              )}
            />
          )}
          <SectionComponent>
            <TextComponent
              size={22}
              text="Time & Date"
              font={fontFamilies.medium}
              styles={{ marginVertical: 20, marginLeft: 8 }}
            />
            <RowComponent styles={{ marginVertical: 12 }} justify="flex-start">
              {timeChoices.map((itemChoice: any) => (
                <TouchableOpacity
                  key={itemChoice.key}
                  onPress={() => settimeChoice(itemChoice.key)}
                  style={[
                    globalStyles.button,
                    locaStyles.button,
                    {
                      borderColor:
                        timeChoice === itemChoice.key
                          ? appColors.primary
                          : appColors.gray2,
                      backgroundColor:
                        timeChoice === itemChoice.key
                          ? appColors.primary
                          : appColors.primary7,
                    },
                  ]}>
                  <TextComponent
                    text={itemChoice.label}
                    font={
                      timeChoice === itemChoice.key
                        ? fontFamilies.medium
                        : fontFamilies.regular
                    }
                  />
                </TouchableOpacity>
              ))}
            </RowComponent>
            <RowComponent
              onPress={() => {
                settimeChoice(undefined);
                setIsVisibleModalDate(true);
              }}
              styles={[
                globalStyles.button,
                locaStyles.button,
                {
                  paddingVertical: 14,
                  width: '70%',
                },
              ]}>
              <Calendar size={24} color={appColors.primary5} variant="Bold" />
              <TextComponent
                text="Choice form calendar"
                color={appColors.gray6}
                font={fontFamilies.medium}
                flex={1}
                styles={{ paddingHorizontal: 12 }}
              />
              <ArrowRight size={24} color={appColors.primary5} />
            </RowComponent>
            <TextComponent
              text="Location"
              size={22}
              font={fontFamilies.medium}
              styles={{ marginVertical: 20, marginLeft: 8 }}
            />
            <ChoiceLocation onSelect={val => setPostion(val.postion)} />

            <RowComponent
              justify='space-between'
              styles={{ paddingHorizontal: 8, marginVertical: 30 }}>
              <TextComponent
                text="Select price range"
                size={22}
                font={fontFamilies.medium}
              />
              <TextComponent
                color={appColors.primary3}
                size={22}
                font={fontFamilies.medium}
                text={`$${priceRange?.low} - $${priceRange?.high}`}
              />
            </RowComponent>
            <RowComponent>
              <TextComponent text={'10'} />
              <View style={{ flex: 1, paddingHorizontal: 12 }}>
                <RnRangeSlider
                  min={10}
                  max={10000}
                  step={10}
                  style={{
                    height: 5,
                    justifyContent: 'center',
                    borderRadius: 10,
                    backgroundColor: appColors.primary,
                  }}
                  renderThumb={() => (
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 100,
                        backgroundColor: appColors.primary3,
                      }}
                    />
                  )}
                  renderRail={() => null}
                  renderRailSelected={() => null}
                  onValueChanged={handlerValueChange}
                />
              </View>
              <TextComponent text={'10000'} />
            </RowComponent>
            <SpaceComponent height={16} />
          </SectionComponent>
          <SectionComponent styles={{ backgroundColor: appColors.primary7 }}>
            <RowComponent>
              <ButtonComponent
                text="Reset"
                type="primary"
                onPress={() => {
                  setCategorySelected([]);
                }}
                color={appColors.white}
                textColor={appColors.primary5}
              />
              <ButtonComponent
                text="Apply"
                type="primary"
                onPress={handlerFilter}
              />
            </RowComponent>
          </SectionComponent>
        </Modalize>
      </Portal>

      <DatePicker
        onCancel={() => setIsVisibleModalDate(false)}
        open={isVisibleModalDate}
        mode={'date'}
        date={new Date()}
        modal
        onConfirm={val => {
          const date = `${val.getFullYear()}-${numberToString(
            val.getMonth() + 1,
          )}-${numberToString(val.getDate())}`;
          setDatetime({
            startAt: `${date} 00:00:00`,
            endAt: `${date} 23:59:59`,
          });

          setIsVisibleModalDate(false);
        }}
      />
    </>
  );
};

export default ModalFilterEvents;

const locaStyles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: appColors.gray2,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
  },
});
