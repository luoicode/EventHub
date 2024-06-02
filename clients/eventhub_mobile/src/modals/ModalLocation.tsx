import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import { SearchNormal1 } from 'iconsax-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  TouchableOpacity,
  View,
} from 'react-native';
import GeoCoder from 'react-native-geocoding';
import MapView from 'react-native-maps';
import {
  ButtonComponent,
  InputComponent,
  RowComponent,
  SpaceComponent,
  TextComponent,
} from '../components';
import { appColors } from '../constants/appColors';
import { appInfo } from '../constants/appInfos';
import { fontFamilies } from '../constants/fontFamilies';
import { LocationModel } from '../models/LocationModel';

GeoCoder.init(process.env.MAP_API_KEY as string);

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (val: {
    address: string;
    position?: {
      lat: number;
      long: number;
    };
  }) => void;
}

const ModalLocation = (props: Props) => {
  const { visible, onClose, onSelect } = props;
  const [searchKey, setSearchKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState<LocationModel[]>([]);
  const [addressSelected, setAddressSelected] = useState('');

  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    long: number;
  }>();

  useEffect(() => {
    Geolocation.getCurrentPosition(position => {
      if (position.coords) {
        setCurrentLocation({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
      }
    }, error => {
      console.log(error);
    }, {},);
  }, []);

  useEffect(() => {
    GeoCoder.from(addressSelected).then(res => {
      const position = res.results[0].geometry.location;

      setCurrentLocation({
        lat: position.lat,
        long: position.lng,
      });
    }).catch(error => console.log(error));
  }, [addressSelected]);



  useEffect(() => {
    if (!searchKey) {
      setLocations([]);
    }
  }, [searchKey]);

  const handlerClose = () => {
    onClose();
  };

  const handlerSearchLocation = async () => {
    const api = `https://autocomplete.search.hereapi.com/v1/autocomplete?q=${searchKey}&limit=10&apiKey=9xtPpCx-_XvOPAIXkPFPAn-fXs2HOa9mvitLme7Mit4`;
    try {
      setIsLoading(true);
      const res = await axios.get(api);

      if (res && res.data && res.status === 200) {
        setLocations(res.data.items);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handlerGetAddressFromPosition =
    ({ latitude, longitude }: { latitude: number, longitude: number }) => {
      onSelect({
        address: 'This is demo address',
        position: {
          lat: latitude,
          long: longitude,
        },
      });
      onClose();
      GeoCoder.from(latitude, longitude).then(data => {
        // console.log('data');
        // console.log(data.results[0].address_components[0]);

      }).catch(error => console.log(error));
    };


  return (
    <Modal animationType="slide" visible={visible} style={{ flex: 1 }}>
      <View style={{ paddingVertical: 42 }}>
        <TextComponent color={appColors.primary5} styles={{ paddingLeft: 20 }} title font={fontFamilies.medium} text='Search Location' />
        <RowComponent
          justify="flex-end"
          styles={{ marginVertical: 20, paddingHorizontal: 20 }}>
          <View style={{ flex: 1 }}>
            <InputComponent
              styles={{ marginBottom: 0 }}
              affix={<SearchNormal1 size={20} color={appColors.gray} />}
              placeholder="Search"
              value={searchKey}
              allowClear
              onChange={val => setSearchKey(val)}
              onEnd={handlerSearchLocation}
            />
          </View>
          <View
            style={{
              position: 'absolute',
              top: 56,
              right: 10,
              left: 10,
              backgroundColor: appColors.white,
              zIndex: 5,
              padding: 20,
            }}>
            {isLoading ? (
              <ActivityIndicator />
            ) : locations.length > 0 ? (
              <FlatList

                data={locations}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{ marginBottom: 12 }}
                    onPress={() => {
                      setAddressSelected(item.address.label);
                      setSearchKey('');
                    }}>
                    <TextComponent text={item.address.label} />
                  </TouchableOpacity>
                )}
              />
            ) : (
              <View>
                <TextComponent
                  text={searchKey ? 'Location not found' : ' '}
                />
              </View>
            )}
          </View>
          <SpaceComponent width={12} />
          <ButtonComponent text="Cancel" type="link" onPress={handlerClose} />
        </RowComponent>
        {currentLocation && (
          <MapView
            style={{
              width: appInfo.sizes.WIDTH,
              height: 600,
              marginVertical: 40,
              zIndex: -1,
            }}
            showsMyLocationButton
            showsUserLocation
            initialRegion={{
              latitude: currentLocation.lat,
              longitude: currentLocation.long,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onPress={event => handlerGetAddressFromPosition(event.nativeEvent.coordinate)}
            region={{
              latitude: currentLocation.lat,
              longitude: currentLocation.long,
              latitudeDelta: 0.001,
              longitudeDelta: 0.015,
            }}
            mapType="standard"
          />
        )}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          }}>
          <ButtonComponent
            styles={{ marginBottom: 10 }}
            text="Confirm"
            onPress={() => {
              onSelect({
                address: addressSelected,
                position: currentLocation,
              });

              onClose();
            }}
            type="primary"
          />
        </View>
      </View>
    </Modal>
  );
};

export default ModalLocation;
