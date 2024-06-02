import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import Swiper from 'react-native-swiper';
import eventAPI from '../../apis/eventApi';
import { ButtonComponent, ContainerComponent, EventItem, SectionComponent, SpaceComponent, TextComponent } from '../../components';
import { appColors } from '../../constants/appColors';
import { EventModel } from '../../models/EventModel';
import { globalStyles } from '../../styles/globalStyles';
import { dateTime } from '../../utils/dateTime';

const { width } = Dimensions.get('window');

const Calendar = ({ navigation }: any) => {

    const swiper = useRef<Swiper | null>(null);
    const [value, setValue] = useState(new Date());
    const [week, setWeek] = useState(0);
    const [events, setEvents] = useState<EventModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [eventDates, setEventDates] = useState<string[]>([]); // Mảng chứa các ngày có sự kiện

    useEffect(() => {
        getEventByDate(value);
    }, [value]);
    useEffect(() => {
        const dates = events.map(event => moment(event.startAt).format('YYYY-MM-DD'));
        setEventDates(dates);
    }, [events]);

    const weeks = React.useMemo(() => {
        const start = moment().add(week, 'weeks').startOf('week');

        return [-1, 0, 1].map(adj => {
            return Array.from({ length: 7 }).map((_, index) => {
                const date = moment(start).add(adj, 'week').add(index, 'day');
                const formattedDate = date.format('YYYY-MM-DD');
                const isActive = value.toDateString() === date.toDate().toDateString();
                const hasEvent = eventDates.includes(formattedDate);

                return {
                    weekday: date.format('ddd'),
                    date: date.toDate(),
                    isActive,
                    hasEvent,
                };
            });
        });
    }, [week, eventDates]);

    const filterEventsByDate = (events: EventModel[], selectedDate: Date): EventModel[] => {
        return events.filter((event: EventModel) => moment(event.startAt).isSame(selectedDate, 'day'));
    };


    const getEventByDate = async (selectedDate: any) => {
        setLoading(true);
        try {
            const res = await eventAPI.HandlerEvent('/get-events', {
                params: {
                    date: moment(selectedDate).format('YYYY-MM-DD'),
                },
            });

            const eventsData = res.data;
            if (Array.isArray(eventsData)) {
                setEvents(eventsData);
            } else {
                setEvents([]);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };





    return (
        <ContainerComponent isScroll back title='Calendar'>

            <View style={styles.picker}>
                <Swiper
                    index={1}
                    ref={swiper}
                    loop={false}
                    showsPagination={false}
                    onIndexChanged={ind => {
                        if (ind === 1) {
                            return;
                        }
                        setTimeout(() => {
                            const newIndex = ind - 1;
                            const newWeek = week + newIndex;
                            setWeek(newWeek);
                            setValue(moment(value).add(newIndex, 'week').toDate());
                            swiper.current?.scrollTo(1, false);
                        }, 100);
                    }}>
                    {weeks.map((dates, index) => (
                        <View style={styles.itemRow} key={index}>
                            {dates.map((item, dateIndex) => {
                                const isActive =
                                    value.toDateString() === item.date.toDateString();
                                const isDayWithEvent = item.hasEvent; // Kiểm tra xem ngày có sự kiện hay không
                                return (
                                    <TouchableWithoutFeedback
                                        key={dateIndex}
                                        onPress={() => {
                                            setValue(item.date);
                                            getEventByDate(item.date);
                                        }}>
                                        <View
                                            style={[
                                                styles.item,
                                                isActive && {
                                                    backgroundColor: '#111',
                                                    borderColor: appColors.primary,
                                                },
                                                isDayWithEvent && styles.dayWithEvent, // Sử dụng kiểu CSS cho ngày có sự kiện
                                            ]}>
                                            <Text
                                                style={[
                                                    styles.itemWeekday,
                                                    isActive && { color: appColors.primary7 },
                                                ]}>
                                                {item.weekday}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.itemDate,
                                                    isActive && { color: appColors.primary7 },
                                                ]}>
                                                {item.date.getDate()}
                                            </Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                );
                            })}
                        </View>
                    ))}
                </Swiper>
            </View>
            <SpaceComponent height={16} />

            <SectionComponent >
                <TextComponent text={dateTime.GetDate(value)} color='#FF9EAA' title />
                {loading ? (
                    <TextComponent text='Loading...' />
                ) : (
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        data={filterEventsByDate(events, value)}
                        renderItem={({ item, index }) => (
                            <EventItem key={`event${index}`} item={item} type="card" />
                        )}
                        ListEmptyComponent={
                            <View style={{ marginTop: 20, flex: 1, marginLeft: 20 }}>
                                <View style={[globalStyles.center, { flex: 1 }]}>
                                    <Image
                                        source={require('../../assets/images/empty_event.png')}
                                        style={{ width: 202, height: 202 }}
                                    />
                                    <TextComponent
                                        text="No Upcoming Event"
                                        title
                                        size={24}
                                        styles={{ marginVertical: 12 }}
                                    />

                                    <View style={{ width: '70%' }}>
                                        <TextComponent
                                            text="There are currently no Events in the Calendar"
                                            size={18}
                                            color={appColors.gray4}
                                            styles={{ textAlign: 'center' }}
                                        />
                                    </View>
                                </View>

                            </View>
                        }
                    />
                )}
            </SectionComponent>


            <SectionComponent>
                <ButtonComponent text='Add new Event' type='primary' onPress={() => navigation.navigate('AddNewScreen')} />
            </SectionComponent>
        </ContainerComponent >
    );
}
export default Calendar;
const styles = StyleSheet.create({
    dayWithEvent: {
        backgroundColor: appColors.primary,
    },
    picker: {
        flex: 1,
        maxHeight: 74,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },

    /** Item */
    item: {
        flex: 1,
        height: 50,
        marginHorizontal: 4,
        paddingVertical: 6,
        paddingHorizontal: 4,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#e3e3e3',
        flexDirection: 'column',
        alignItems: 'center',
    },
    itemRow: {
        width: width,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
    },
    itemWeekday: {
        fontSize: 13,
        fontWeight: '500',
        color: '#737373',
        marginBottom: 4,
    },
    itemDate: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111',
    },

});