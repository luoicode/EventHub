import Geolocation from '@react-native-community/geolocation';
import { ArrowLeft2 } from 'iconsax-react-native';
import React, { useEffect, useState } from 'react';
import { FlatList, StatusBar, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Foundation from 'react-native-vector-icons/Foundation';
import {
  CardComponent,
  CategoriesList,
  EventItem,
  InputComponent,
  MarkerCustom,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import { appColors } from '../../constants/appColors';
import { appInfo } from '../../constants/appInfos';
import { globalStyles } from '../../styles/globalStyles';
import { MusicIcon } from '../../assets/svgs';
import eventAPI from '../../apis/eventApi';
import { EventModel } from '../../models/EventModel';
import { useIsFocused } from '@react-navigation/native';
import { LoadingModal } from '../../modals';
const MapScreen = ({ navigation }: any) => {
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    long: number;
  }>();
  const [events, setEvents] = useState<EventModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position: any) => {
        if (position.coords) {
          setCurrentLocation({
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });
        }
      },
      (error: any) => {
        console.log(error);
      },
      {},
    );
  }, []);

  useEffect(() => {
    currentLocation && isFocused && getNearbyEvents();
  }, [currentLocation, isFocused]);

  const getNearbyEvents = async (categoryId?: string) => {
    setIsLoading(true);
    const api = `/get-events?isUpcoming=true&lat=${currentLocation?.lat}&long=${currentLocation?.long
      }&distance=${5}${categoryId ? `&categoryId=${categoryId}` : ''}`;
    try {
      const res = await eventAPI.HandlerEvent(api);

      setEvents(res.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle={'dark-content'} />
      <View
        style={{
          position: 'absolute',
          backgroundColor: 'rgba(255,255,255,0.5)',
          top: 0,
          left: 0,
          right: 0,
          padding: 20,
          paddingTop: 42,
          zIndex: 2,
        }}>
        <RowComponent>
          <View style={{ flex: 1 }}>
            <InputComponent
              styles={{ marginBottom: 0, backgroundColor: appColors.primary7 }}
              affix={
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Home', {
                      screen: 'HomeScreen',
                    });
                  }}>
                  <ArrowLeft2 size={22} color={appColors.primary5} />
                </TouchableOpacity>
              }
              placeholder="Search"
              value=""
              onChange={val => console.log(val)}
            />
          </View>
          <SpaceComponent width={12} />
          <CardComponent
            onPress={getNearbyEvents}
            styles={[globalStyles.noSpaceCard, { width: 56, height: 56 }]}
            color={appColors.primary7}>
            <Foundation
              name="target-two"
              color={appColors.primary5}
              size={32}
            />
          </CardComponent>
        </RowComponent>
        <SpaceComponent height={20} />
        <CategoriesList onFilter={catId => getNearbyEvents(catId)} />
      </View>

      {currentLocation ? (
        <MapView
          style={{
            flex: 1,
            width: appInfo.sizes.WIDTH,
            height: appInfo.sizes.HEIGHT,
          }}
          // showsMyLocationButton
          showsUserLocation
          initialRegion={{
            latitude: currentLocation.lat,
            longitude: currentLocation.long,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          region={{
            latitude: currentLocation.lat,
            longitude: currentLocation.long,
            latitudeDelta: 0.001,
            longitudeDelta: 0.015,
          }}
          mapType="standard">
          {events.length > 0 &&
            events.map((event, index) => (
              <Marker
                key={`event${index}`}
                title={event.title}
                description=""
                onPress={() =>
                  navigation.navigate('EventDetail', { id: event._id })
                }
                coordinate={{
                  longitude: event.position.long,
                  latitude: event.position.lat,
                }}>
                <MarkerCustom categoryId={event.categories} />
              </Marker>
            ))}
        </MapView>
      ) : (
        <></>
      )}

      <View
        style={{
          position: 'absolute',
          bottom: 10,
          right: 0,
          left: 0,
        }}>
        <FlatList
          initialScrollIndex={0}
          data={events}
          renderItem={({ item }) => <EventItem type="list" item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <LoadingModal visible={isLoading} />
    </View>
  );
};

export default MapScreen;
