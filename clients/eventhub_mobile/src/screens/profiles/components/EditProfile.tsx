import { useNavigation } from '@react-navigation/native';
import { Edit, Edit2 } from 'iconsax-react-native';
import React, { useEffect, useState } from 'react';
import eventAPI from '../../../apis/eventApi';
import {
  ButtonComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TagComponent,
  TextComponent,
} from '../../../components';
import { appColors } from '../../../constants/appColors';
import { fontFamilies } from '../../../constants/fontFamilies';
import ModalSelectCategories from '../../../modals/ModalSelectCategories';
import { Category } from '../../../models/Category';
import { ProfileModel } from '../../../models/ProfileModel';
import { globalStyles } from '../../../styles/globalStyles';
import { View } from 'react-native';

interface Props {
  profile: ProfileModel;
}

const EditProfile = (props: Props) => {
  const { profile } = props;

  const [isVisibleModalCategory, setIsVisibleModalCategory] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    const api = `/get-categories`;

    try {
      const res: any = await eventAPI.HandlerEvent(api);

      setCategories(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const navigation: any = useNavigation();

  return (
    <SectionComponent>
      <RowComponent justify='flex-start'>
        <ButtonComponent
          iconFlex="left"
          icon={<Edit size="20" color={appColors.primary5} />}
          styles={{
            height: 54,
            width: 'auto',
            borderWidth: 1,
            borderColor: appColors.gray2,
            backgroundColor: appColors.primary4,
          }}
          text="Edit profile"
          type="primary"
          textColor={appColors.primary5}
          onPress={() =>
            navigation.navigate('EditProfileScreen', {
              profile,
            })
          }
        />
      </RowComponent>
      <TextComponent
        text="About"
        title
        size={26}
        styles={{ paddingVertical: 10 }}
      />
      <TextComponent text={profile.bio} />
      <>
        <RowComponent>
          <TextComponent
            flex={1}
            text="Interest"
            size={26}
            title
            styles={{ paddingVertical: 10 }}
          />
          <RowComponent
            styles={[globalStyles.tag, { backgroundColor: appColors.primary7 }]}
            onPress={() => setIsVisibleModalCategory(true)}>
            <Edit2 size={18} color={appColors.primary5} />
            <SpaceComponent width={8} />
            <TextComponent
              text="Change"
              font={fontFamilies.medium}
              color={appColors.primary5}
            />
          </RowComponent>
        </RowComponent>
        <RowComponent styles={{ flexWrap: 'wrap', justifyContent: 'flex-start' }}>
          {categories.length > 0 &&
            profile.interest &&
            categories.map(
              item =>
                profile.interest?.includes(item._id) && (
                  <View
                    key={item._id}
                    style={[
                      globalStyles.tag,
                      { backgroundColor: item.color, margin: 6 },
                    ]}>
                    <TextComponent
                      text={item.title}
                      color={appColors.primary7}
                      font={fontFamilies.medium}
                    />
                  </View>
                ),
            )}
        </RowComponent>
      </>

      <ModalSelectCategories
        categories={categories}
        selected={profile.interest}
        onSelected={vals => {
          setIsVisibleModalCategory(false);
          navigation.navigate('ProfileScreen', {
            isUpdated: true,
            id: profile.uid,
          });
        }}
        onClose={() => setIsVisibleModalCategory(false)}
        visible={isVisibleModalCategory}
      />
    </SectionComponent>
  );
};

export default EditProfile;
