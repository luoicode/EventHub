import firestore from '@react-native-firebase/firestore';
import { SearchNormal1, TickCircle } from 'iconsax-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, View } from 'react-native';
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
  eventId?: string;
  title: string;
  joined: string[]
}

const ModalInvite = (props: Props) => {
  const { visible, onClose, eventId, title, joined } = props;
  const [friendId, setFriendId] = useState<string[]>([]);
  const [isDissable, setIsDissable] = useState(true);
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
    setIsDissable(items.length === 0);
  };

  const handlerSendInviteNotification = async () => {
    if (userSelected.length > 0) {
      const api = `/send-invite`;

      try {
        await userAPI.HandlerUser(
          api,
          {
            ids: userSelected,
            eventId,
          },
          'post',
        );

        const data = {
          from: auth.id,
          // to: id,
          createAt: Date.now(),
          content: ` Invite A virtual Evening of ${title}`,
          eventId,
          isRead: false,
        };

        userSelected.forEach(async id => {
          await firestore()
            .collection('notifications')
            .add({ ...data, uid: id });

        });
        onClose();
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
              disabled={isDissable}
              onPress={() => {
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
            color={appColors.primary5}
            font={fontFamilies.medium}
          />
          <InputComponent
            styles={{ marginTop: 12, marginBottom: 24 }}
            placeholder="Search"
            value=""
            suffix={<SearchNormal1 size={24} color={appColors.primary5} />}
            onChange={val => console.log('')}
          />
          {friendId.length ? (
            friendId.map((id: string) =>
              !joined.includes(id) && id !== auth.id && (
                <RowComponent key={id} styles={{ marginBottom: 16 }}>
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
                        ? appColors.primary3
                        : appColors.gray2
                    }
                  />
                </RowComponent>
              ))
          ) : (
            <TextComponent
              text="No friends to invite"
              color={appColors.primary5}
            />
          )}
        </SectionComponent>
      </Modalize>
    </Portal>
  );
};

export default ModalInvite;
