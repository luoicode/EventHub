export interface BillModel {
  _id: string;
  createdAt: Date;
  createdBy: string;
  eventId: string;
  price: number;
  status: string;
  authorId?: string;
  updatedAt: Date;
  title: string;
  locationTitle: string;
  photoUrl?: string;
  startAt: number;
  date: number;
  quantity: number;
}
