import Geolocation from '@react-native-community/geolocation';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StatusBar, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import GeoCoder from 'react-native-geocoding';
import MapView, { Marker } from 'react-native-maps';
import Foundation from 'react-native-vector-icons/Foundation';
import eventAPI from '../../apis/eventApi';
import {
  CardComponent,
  CategoriesList,
  EventItem,
  InputComponent,
  MarkerCustom,
  RowComponent,
  SpaceComponent,
  TextComponent
} from '../../components';
import { appColors } from '../../constants/appColors';
import { appInfo } from '../../constants/appInfos';
import { LoadingModal } from '../../modals';
import { EventModel } from '../../models/EventModel';
import { globalStyles } from '../../styles/globalStyles';

GeoCoder.init(process.env.MAP_API_KEY as string);

interface LocationItem {
  address: {
    label: string;
  };
}

const MapScreen = ({ navigation }: any) => {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; long: number } | null>(null);
  const [events, setEvents] = useState<EventModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [addressSelected, setAddressSelected] = useState('');
  const [isAddressListVisible, setIsAddressListVisible] = useState(false);
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
    if (currentLocation && isFocused) {
      getNearbyEvents();
    }
  }, [currentLocation, isFocused]);

  const getNearbyEvents = async (categoryId?: string) => {
    if (!currentLocation) return;
    setIsLoading(true);
    const api = `/get-events?isUpcoming=true&lat=${currentLocation?.lat}&long=${currentLocation?.long}&distance=${5}${categoryId ? `&categoryId=${categoryId}` : ''}`;
    try {
      const res = await eventAPI.HandlerEvent(api);
      setEvents(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlerSearchLocation = async () => {
    const api = `https://autocomplete.search.hereapi.com/v1/autocomplete?q=${searchKey}&limit=10&apiKey=9xtPpCx-_XvOPAIXkPFPAn-fXs2HOa9mvitLme7Mit4`;
    try {
      setIsLoading(true);
      const res = await axios.get(api);

      if (res && res.data && res.status === 200) {
        setLocations(res.data.items);
        setIsAddressListVisible(true);  // Show the address list
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLocationSelect = (item: LocationItem) => {
    setAddressSelected(item.address.label);
    setSearchKey('');
    setIsAddressListVisible(false);  // Hide the address list
    GeoCoder.from(item.address.label).then(res => {
      const position = res.results[0].geometry.location;
      setCurrentLocation({
        lat: position.lat,
        long: position.lng,
      });
    }).catch(error => console.log(error));
  };

  return (
    <TouchableWithoutFeedback onPress={() => setIsAddressListVisible(false)}>
      <View style={{ flex: 1 }}>
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
                  placeholder="Search place"
                  value={searchKey}
                  onChange={val => setSearchKey(val)}
                  onEnd={handlerSearchLocation}
                />
                {isLoading ? (
                  <ActivityIndicator />
                ) : isAddressListVisible && locations.length > 0 ? (
                  <FlatList
                    data={locations}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={{ marginBottom: 12 }}
                        onPress={() => handleLocationSelect(item)}>
                        <TextComponent text={item.address.label} />
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                  />
                ) : null}
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
      </View>
    </TouchableWithoutFeedback>

  );
};

export default MapScreen;
