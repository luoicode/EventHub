import { SearchNormal1, TickCircle } from 'iconsax-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Share, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { useSelector } from 'react-redux';
import userAPI from '../apis/userApi';
import {
  ButtonComponent,
  InputComponent,
  RowComponent,
  SectionComponent,
  TextComponent,
  UserComponent,
} from '../components';
import { appColors } from '../constants/appColors';
import { fontFamilies } from '../constants/fontFamilies';
import { authSelector } from '../redux/reducers/authReducer';

interface Props {
  visible: boolean;
  onClose: () => void;
  eventId: string
}

const ModalInvite = (props: Props) => {
  const { visible, onClose, eventId } = props;
  const [friendId, setFriendId] = useState<string[]>([]);
  const [userSelected, setUserSelected] = useState<string[]>([]);
  const modalizeRef = useRef<Modalize>();
  const auth = useSelector(authSelector);

  useEffect(() => {
    if (auth.following && auth.following.length > 0) {
      setFriendId(auth.following);
    }
  }, [auth]);

  useEffect(() => {
    if (visible) {
      modalizeRef.current?.open();
    } else {
      modalizeRef.current?.close();
    }
  }, [visible]);

  const handlerSelectedId = (id: string) => {
    const items: string[] = [...userSelected];
    const index = items.findIndex(element => element === id);

    if (index !== -1) {
      items.splice(index, 1);
    } else {
      items.push(id);
    }

    setUserSelected(items);
  };
  const onShare = async () => {
    try {
      const eventLink = 'https://example.com/eventhub';

      const result = await Share.share({
        message: `Join the event right here: ${eventLink}`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Chia sẻ với loại hoạt động result.activityType
        } else {
          // Chia sẻ thành công
        }
      } else if (result.action === Share.dismissedAction) {
        // Người dùng đã hủy chia sẻ
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  const handlerSendInviteNotification = async () => {
    if (userSelected.length > 0) {
      const api = `/send-invite`;

      try {
        await userAPI.HandlerUser(
          api,
          {
            ids: userSelected,
            eventId: '',
          },
          'post',
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      Alert.alert('', 'Please select user want to invite!!');
    }
  };

  return (
    <Portal>
      <Modalize
        handlePosition="inside"
        adjustToContentHeight
        ref={modalizeRef}
        FooterComponent={
          <SectionComponent>
            <ButtonComponent
              text="Invite"
              type="primary"
              onPress={() => {
                onShare();
                handlerSendInviteNotification();
              }}
            />
          </SectionComponent>
        }
        onClose={onClose}>
        <SectionComponent styles={{ marginTop: 30 }}>
          <TextComponent
            text="Invite Friend"
            title
            size={24}
            color={appColors.primary6}
            font={fontFamilies.medium}
          />
          <InputComponent
            styles={{ marginTop: 12, marginBottom: 24 }}
            placeholder="Search"
            value=""
            suffix={<SearchNormal1 size={24} color={appColors.primary6} />}
            onChange={val => console.log('')}
          />
          {friendId.length ? (
            friendId.map((id: string) => (
              <RowComponent key={id}>
                <View style={{ flex: 1 }}>
                  <UserComponent

                    types="Invite"
                    onPress={() => handlerSelectedId(id)}
                    userId={id}
                  />
                </View>
                <TickCircle
                  size={24}
                  variant="Bold"
                  color={
                    userSelected.includes(id)
                      ? appColors.primary6
                      : appColors.gray2
                  }
                />
              </RowComponent>
            ))
          ) : (
            <TextComponent text="No friends to invite" color={appColors.primary5} />
          )}
        </SectionComponent>
      </Modalize>
    </Portal>
  );
};

export default ModalInvite;
