import { useNavigation } from '@react-navigation/native';
import { Edit } from 'iconsax-react-native';
import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import eventAPI from '../../../apis/eventApi';
import {
  ButtonComponent,
  EventItem,
  LoadingComponent,
  RowComponent,
  SectionComponent,
  TextComponent
} from '../../../components';
import { appColors } from '../../../constants/appColors';
import { EventModel } from '../../../models/EventModel';
import { ProfileModel } from '../../../models/ProfileModel';
import Interest from './Interest';

interface Props {
  profile: ProfileModel;
}

const EditProfile = (props: Props) => {
  const { profile } = props;
  const [events, setEvents] = useState<EventModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
      <Interest profile={profile || {}} />
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
    </SectionComponent>
  );
};

export default EditProfile;
