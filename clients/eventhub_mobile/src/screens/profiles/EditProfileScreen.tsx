import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';
import React, { useState } from 'react';
import { ImageOrVideo } from 'react-native-image-crop-picker';
import { useDispatch, useSelector } from 'react-redux';
import userAPI from '../../apis/userApi';
import {
    AvatarComponent,
    ButtonComponent,
    ContainerComponent,
    InputComponent,
    RowComponent,
    SectionComponent,
    SpaceComponent,
    UploadImagePicker,
} from '../../components';
import { LoadingModal } from '../../modals';
import { ProfileModel } from '../../models/ProfileModel';
import { addAuth, authSelector } from '../../redux/reducers/authReducer';

const EditProfileScreen = ({ navigation, route }: any) => {
    const { profile }: { profile: ProfileModel } = route.params;

    const [fileSelected, setFileSelected] = useState<any>();
    const [profileData, setProfileData] = useState<ProfileModel>(profile);
    const [isLoading, setIsLoading] = useState(false);
    const auth = useSelector(authSelector)
    const dispatch = useDispatch()

    const handlerFileSelected = (val: ImageOrVideo) => {
        setFileSelected(val);
        handlerChangeValue('photoUrl', val.path);
    };

    const handlerChangeValue = (key: string, value: string | Date | string[]) => {
        const items: any = { ...profileData };

        items[`${key}`] = value;

        setProfileData(items);
    };

    const onUpdateProfile = async () => {
        if (fileSelected) {
            const filename = `${fileSelected.filename ?? `image-${Date.now()}`}.${fileSelected.path.split('.')[1]
                }`;
            const path = `images/${filename}`;

            const res = storage().ref(path).putFile(fileSelected.path);

            res.on(
                'state_changed',
                snap => {
                    console.log(snap.bytesTransferred);
                },
                error => {
                    console.log(error);
                },
                () => {
                    storage()
                        .ref(path)
                        .getDownloadURL()
                        .then(url => {
                            profileData.photoUrl = url;

                            handlerUpdateProfile(profileData);
                        });
                },
            );
        } else {
            handlerUpdateProfile(profileData);
        }
    };

    const handlerUpdateProfile = async (data: ProfileModel) => {
        const api = `/update-profile?uid=${profile.uid}`;

        const newData = {
            bio: data.bio ?? '',
            familyName: data.giveName ?? '',
            givenName: data.giveName ?? '',
            name: data.name ?? '',
            photoUrl: data.photoUrl ?? '',
        };

        setIsLoading(true);

        try {
            const res: any = await userAPI.HandlerUser(api, newData, 'put');

            setIsLoading(false);

            const authData = { ...auth, photo: data.photoUrl ?? '' }

            await AsyncStorage.setItem('auth', JSON.stringify(authData))
            dispatch(addAuth(authData))

            navigation.navigate('ProfileScreen', {
                isUpdated: true,
                id: profile.uid,
            });
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    };

    return (
        <ContainerComponent isScroll back title='Edit Profile'>
            <SectionComponent>
                <RowComponent>
                    <AvatarComponent
                        photoURL={profileData.photoUrl}
                        name={profileData.name ? profileData.name : profileData.email}
                        size={120}
                    />
                </RowComponent>
                <SpaceComponent height={16} />
                <RowComponent>
                    <UploadImagePicker
                        onSelect={(val: any) =>
                            val.type === 'url'
                                ? handlerChangeValue('photoUrl', val.value as string)
                                : handlerFileSelected(val.value)
                        }
                    />
                </RowComponent>
                <InputComponent
                    placeholder="Full name"
                    allowClear
                    value={profileData.name}
                    onChange={val => handlerChangeValue('name', val)}
                />
                <InputComponent
                    placeholder="Introduce"
                    allowClear
                    value={profileData.bio}
                    multiline
                    numberOfLine={5}
                    onChange={val => handlerChangeValue('bio', val)}
                />
            </SectionComponent>
            <ButtonComponent
                disabled={profileData === profile}
                text="Update"
                onPress={onUpdateProfile}
                type="primary"
            />

            <LoadingModal visible={isLoading} />
        </ContainerComponent >
    );
};

export default EditProfileScreen;