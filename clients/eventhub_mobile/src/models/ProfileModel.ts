export interface ProfileModel {
  bio: string;
  createAt: string;
  email: string;
  familyName: string;
  giveName: string;
  name: string;
  photoUrl: string;
  updateAt: string;
  following: string[];
  uid: string;
  interest?: string[];
  type?: 'Organizer' | 'Personal' | undefined;
}
