import { View, Text, Modal, TouchableOpacity } from 'react-native';
import React, { ReactNode, useRef, useState } from 'react';
import ButtonComponent from './ButtonComponent';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import TextComponent from './TextComponent';
import { Camera, Image, Link } from 'iconsax-react-native';
import { appColors } from '../constants/appColors';
import RowComponent from './RowComponent';
import SpaceComponent from './SpaceComponent';
import { fontFamilies } from '../constants/fontFamilies';
import ImageCropPicker, {
  ImageOrVideo,
  Options,
} from 'react-native-image-crop-picker';
import { globalStyles } from '../styles/globalStyles';
import AntDesgin from 'react-native-vector-icons/AntDesign';
import InputComponent from './InputComponent';
interface Props {
  onSelect: (val: { type: 'url' | 'file'; value: string | ImageOrVideo }) => void;
}

const UploadImagePicker = (props: Props) => {
  const { onSelect } = props;
  const modalizeRef = useRef<Modalize>();

  const [imageUrl, setImageUrl] = useState('');
  const [isVisibleModalAddUrl, setIsVisibleModalAddUr] = useState(false);
  const options: Options = {
    cropping: true,
    mediaType: 'photo',
  };

  const choiceImage = [
    {
      key: 'camera',
      title: 'Take a picture',
      icon: <Camera size={22} color={appColors.text} />,
    },
    {
      key: 'library',
      title: 'Album',
      icon: <Image size={22} color={appColors.text} />,
    },
    {
      key: 'url',
      title: 'From Url',
      icon: <Link size={22} color={appColors.text} />,
    },
  ];

  const handleChoiceImage = (key: string) => {
    switch (key) {
      case 'library':
        ImageCropPicker.openPicker(options).then(res => {
          onSelect({ type: 'file', value: res });
        });
        break;

      case 'camera':
        ImageCropPicker.openCamera(options).then(res => {
          onSelect({ type: 'file', value: res });
        });
        break;

      default:
        setIsVisibleModalAddUr(true);
        break;
    }

    modalizeRef.current?.close();
  };

  const renderItem = (item: { icon: ReactNode; key: string; title: string }) => (
    <RowComponent
      styles={{ marginBottom: 20 }}
      key={item.key}
      onPress={() => handleChoiceImage(item.key)}>
      {item.icon}
      <SpaceComponent width={12} />
      <TextComponent text={item.title} flex={1} font={fontFamilies.medium} />
    </RowComponent>
  );

  return (
    <View style={{ marginBottom: 20 }}>
      <ButtonComponent
        text="Upload Image"
        onPress={() => modalizeRef.current?.open()}
        type="link"
      />
      <Portal>
        <Modalize
          adjustToContentHeight
          ref={modalizeRef}
          handlePosition="inside">
          <View style={{ marginVertical: 30, paddingHorizontal: 20 }}>
            {choiceImage.map(item => renderItem(item))}
          </View>
        </Modalize>
      </Portal>

      <Modal
        visible={isVisibleModalAddUrl}
        statusBarTranslucent
        style={{ flex: 1 }}
        transparent
        animationType="slide">
        <View
          style={[
            globalStyles.container,
            {
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}>
          <View
            style={[
              {
                backgroundColor: appColors.white,
                margin: 20,
                borderRadius: 12,
                width: '90%',
                padding: 20,
              },
            ]}>

            <TextComponent text="Image URL" title size={18} />
            <InputComponent
              placeholder="URL"
              value={imageUrl}
              onChange={val => setImageUrl(val)}
              allowClear
            />
            <RowComponent justify="flex-end">
              <ButtonComponent
                text="Cancel"
                type="primary"
                color="#EE4266"
                onPress={() => {
                  setImageUrl('')
                  setIsVisibleModalAddUr(false)
                }}
              />
              <ButtonComponent
                text="Agree"
                type="primary"
                onPress={() => {
                  setIsVisibleModalAddUr(false);
                  onSelect({ type: 'url', value: imageUrl });
                  setImageUrl('');
                }}
              />

            </RowComponent>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default UploadImagePicker;
