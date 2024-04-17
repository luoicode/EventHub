import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
    ButtonComponent,
    RowComponent,
    SectionComponent,
    SpaceComponent,
    TagComponent,
    TextComponent,
} from '../../../components';
import { appColors } from '../../../constants/appColors';
import { ProfileModel } from '../../../models/ProfileModel';
import { ArrowCircleRight2, Edit } from 'iconsax-react-native';

interface Props {
    profile: ProfileModel;

}

const EditProfile = (props: Props) => {
    const { profile } = props;


    const navigation: any = useNavigation();


    return (
        <SectionComponent>
            <RowComponent >
                <ButtonComponent
                    iconFlex="left"
                    icon={<Edit
                        size="26"
                        color={appColors.primary}
                    />}
                    styles={{
                        borderWidth: 1,
                        borderColor: appColors.primary,
                        backgroundColor: appColors.white,
                    }}
                    text="Edit profile"
                    type="primary"
                    textColor={appColors.primary}
                    onPress={() =>
                        navigation.navigate('EditProfileScreen', {
                            profile,
                        })
                    }
                />
            </RowComponent>
            <TextComponent text="About" title size={26} styles={{ paddingVertical: 10 }} />
            <TextComponent text={profile.bio} />
            <>
                <RowComponent>
                    <TextComponent flex={1} text="Interest" size={26} title styles={{ paddingVertical: 10 }} />
                    <ButtonComponent text="Change" />
                </RowComponent>
                <RowComponent styles={{ flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                    {Array.from({ length: 8 }).map((item, index) => (
                        <TagComponent
                            key={`tag${index}`}
                            bgColor="#e0e0e0"
                            label="Music"
                            onPress={() => { }}
                            styles={{
                                marginRight: 8,
                                marginBottom: 12,
                            }}
                        />
                    ))}
                </RowComponent>
            </>
        </SectionComponent>
    );
};

export default EditProfile;
