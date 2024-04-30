import { Camera, Image, Link } from 'iconsax-react-native';
import React, { ReactNode, useRef, useState } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import ImageCropPicker, {
  ImageOrVideo,
  Options,
} from 'react-native-image-crop-picker';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { appColors } from '../constants/appColors';
import { fontFamilies } from '../constants/fontFamilies';
import { globalStyles } from '../styles/globalStyles';
import ButtonComponent from './ButtonComponent';
import InputComponent from './InputComponent';
import RowComponent from './RowComponent';
import SpaceComponent from './SpaceComponent';
import TextComponent from './TextComponent';
import CardComponent from './CardComponent';
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
      icon: <Camera size={22} color={appColors.primary5} />,
    },
    {
      key: 'library',
      title: 'Album',
      icon: <Image size={22} color={appColors.primary5} />,
    },
    {
      key: 'url',
      title: 'From Url',
      icon: <Link size={22} color={appColors.primary5} />,
    },
  ];

  const handlerChoiceImage = (key: string) => {
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
      onPress={() => handlerChoiceImage(item.key)}>
      {item.icon}
      <SpaceComponent width={12} />
      <TextComponent text={item.title} flex={1} font={fontFamilies.medium} color={appColors.primary5} />
    </RowComponent>
  );

  return (
    <View style={{ marginBottom: 20 }}>

      <RowComponent justify='flex-start' onPress={() => modalizeRef.current?.open()}>
        <CardComponent
          styles={[
            globalStyles.noSpaceCard,
            { width: 56, minHeight: 50 },
          ]}
          color='#E1F0DA'>
          <Image
            size="30"
            color="green"
          />
        </CardComponent>
        <SpaceComponent width={16} />
        <TextComponent size={20} text='Add cover photo' />
      </RowComponent>
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
                backgroundColor: appColors.primary7,
                margin: 20,
                borderRadius: 12,
                width: '90%',
                padding: 20,
              },
            ]}>
            <RowComponent justify="flex-end">
              <TouchableOpacity
                onPress={() => {
                  setImageUrl('');
                  setIsVisibleModalAddUr(false);
                }}>
                <AntDesign name="close" size={24} color={appColors.primary5} />
              </TouchableOpacity>
            </RowComponent>

            <TextComponent text="Image URL" title size={18} />
            <SpaceComponent height={8} />
            <InputComponent
              placeholder="URL"
              value={imageUrl}
              onChange={val => setImageUrl(val)}
              allowClear
            />
            <RowComponent justify="flex-end">
              <ButtonComponent
                text="Agree"
                type="primary"
                color={appColors.primary5}
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
