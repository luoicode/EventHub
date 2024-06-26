import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'iconsax-react-native';
import React, { ReactNode } from 'react';
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { RowComponent, TextComponent } from '.';
import { appColors } from '../constants/appColors';
import { fontFamilies } from '../constants/fontFamilies';
import { globalStyles } from '../styles/globalStyles';

interface Props {
  isImageBackground?: boolean;
  isScroll?: boolean;
  title?: string;
  children: ReactNode;
  back?: boolean;
  right?: ReactNode
  styles?: StyleProp<ViewStyle>
}

const ContainerComponent = (props: Props) => {
  const { children, isScroll, isImageBackground, title, back, right, styles } = props;

  const navigation: any = useNavigation();

  const headerComponent = () => {
    return (
      <View style={[{ flex: 1, paddingTop: 30, backgroundColor: appColors.primary7 }, styles]}>
        {(title || back || right) && (
          <RowComponent
            styles={{
              paddingHorizontal: 16,
              paddingVertical: 10,
              minWidth: 48,
              minHeight: 48,
              justifyContent: 'flex-start',
            }}>
            {back && (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ marginRight: 12 }}>
                <ArrowLeft size={28} color={appColors.primary5} />
              </TouchableOpacity>
            )}
            <View style={{ flex: 1 }}>
              {title ? (
                <TextComponent
                  text={title}
                  size={24}
                  font={fontFamilies.medium}
                />
              ) : (
                <></>
              )}
            </View>
            {right && right}
          </RowComponent>
        )}
        {returnContainer}
      </View>
    );
  };

  const returnContainer = isScroll ? (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View style={{ flex: 1 }}>{children}</View>
  );

  return isImageBackground ? (
    <ImageBackground
      source={require('../assets/images/splash-img.png')}
      style={{ flex: 1 }}
      imageStyle={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>{headerComponent()}</SafeAreaView>
    </ImageBackground>
  ) : (
    <SafeAreaView style={[globalStyles.container]}>
      <StatusBar barStyle={'dark-content'} />
      <View style={[globalStyles.container]}>{headerComponent()}</View>
    </SafeAreaView>
  );
};

export default ContainerComponent;
