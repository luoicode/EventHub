export interface EventModel {
  authorID: string;
  date: number;
  description: string;
  endAt: number;
  image: string;
  imageUrl: string;
  location: Location;
  startAt: number;
  tags: any[];
  title: string;
  users: string[];
}

export interface Location {
  address: string;
  title: string;
}
