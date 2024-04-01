export interface AddressModel {
  address: Address;
  distance: number;
  id: string;
  mapView: MapView;
  postion: Position;
  title: string;
}

export interface Address {
  city: string;
  countryCode: string;
  countryName: string;
  country: string;
  district: string;
  label: string;
  postalCode: string;
  street: string;
}
export interface MapView {
  east: number;
  north: number;
  south: number;
  west: number;
}
export interface Position {
  lat: number;
  long: number;
}
