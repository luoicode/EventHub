import { useNavigation } from '@react-navigation/native';
import { Edit, Edit2 } from 'iconsax-react-native';
import React, { useEffect, useState } from 'react';
import eventAPI from '../../../apis/eventApi';
import {
  ButtonComponent,
  EventItem,
  LoadingComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TagComponent,
  TextComponent,
} from '../../../components';
import { appColors } from '../../../constants/appColors';
import { fontFamilies } from '../../../constants/fontFamilies';
import { Category } from '../../../models/Category';
import { ProfileModel } from '../../../models/ProfileModel';
import { globalStyles } from '../../../styles/globalStyles';
import { FlatList, View } from 'react-native';
import { ModalSelectCategories } from '../../../modals';
import { EventModel } from '../../../models/EventModel';

interface Props {
  profile: ProfileModel;
}

const EditProfile = (props: Props) => {
  const { profile } = props;

  const [isVisibleModalCategory, setIsVisibleModalCategory] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [events, setEvents] = useState<EventModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    getCategories();
  }, []);
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    setIsLoading(true);
    await getEvents();

    setIsLoading(false)
  }
  const getEvents = async () => {
    const api = `/get-events`;

    try {
      const res = await eventAPI.HandlerEvent(api);
      setEvents(res.data)
    } catch (error) {
      console.log(error);
    }
  };
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
      <>
        <RowComponent>
          <TextComponent
            flex={1}
            text="My Events"
            size={26}
            title
            styles={{ paddingVertical: 10 }}
          />
        </RowComponent>
        <RowComponent styles={{ flexWrap: 'wrap', justifyContent: 'flex-start' }}>
          {events.length > 0 ? (
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal
              data={events.filter(event => event.authorId === profile.uid)}
              renderItem={({ item, index }) => (
                <EventItem key={`event${index}`} item={item} type="card" />
              )}
            />
          ) : (
            <LoadingComponent isLoading={isLoading} values={events.length} />
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
