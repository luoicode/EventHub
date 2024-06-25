import React, { useState } from 'react';
import { Alert, Image, TouchableOpacity, View } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import eventAPI from '../../apis/eventApi';
import {
  ButtonComponent,
  ContainerComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TagComponent,
  TextComponent,
} from '../../components';
import { appColors } from '../../constants/appColors';
import { fontFamilies } from '../../constants/fontFamilies';
import { dateTime } from '../../utils/dateTime';
import { Add, Minus } from 'iconsax-react-native';

const PaymentScreen = ({ navigation, route }: any) => {
  const { billDetail } = route.params;
  const [quantity, setQuantity] = useState(1);

  const handlerPaySuccessfully = async () => {
    Alert.alert(
      'Confirm Payment',
      'Are you sure you want to proceed with the payment?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            const updateQuantityApi = `/update-quantity`;
            const updateQuantityData = {
              billId: billDetail._id,
              quantity: quantity,
            };

            try {
              await eventAPI.HandlerEvent(updateQuantityApi, updateQuantityData, 'post');

              const paymentApi = `/update-payment-success?billId=${billDetail._id}`;
              await eventAPI.HandlerEvent(paymentApi);

              Alert.alert(
                'Payment Successful',
                'Your ticket has been purchased successfully!',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      navigation.navigate("MyTicket");
                    },
                  },
                ],
                { cancelable: false }
              );
            } catch (error) {
              console.log(error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };


  const increaseQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  return (
    <ContainerComponent back title="Payment">
      <RowComponent justify="center">
        <Entypo name="paypal" size={50} color={appColors.primary5} />
      </RowComponent>
      <SectionComponent>
        <RowComponent justify="center">
          <TextComponent
            text={` ${billDetail._id}`}
            size={18}
            color={appColors.primary3}
            font={fontFamilies.medium}
          />
        </RowComponent>
        <RowComponent justify="flex-end">
          <TagComponent label={billDetail.status === 'success' ? 'Success' : 'Unpaid'} />
        </RowComponent>
      </SectionComponent>
      <Image
        source={{ uri: billDetail.photoUrl }}
        style={{
          width: 420,
          height: 300,
          resizeMode: 'cover',
          margin: 10,
          borderRadius: 40,
        }}
      />
      <SectionComponent>
        <RowComponent justify="space-between">
          <TextComponent text="Event Name:   " title font={fontFamilies.medium} />
          <TextComponent
            text={` ${billDetail.title}`}
            size={18}
            styles={{ flex: 1 }}
            color={appColors.gray}
            font={fontFamilies.medium}
            numberOfLine={2}
            ellipsizeMode="tail"
          />
        </RowComponent>
        <SpaceComponent height={16} />
        <RowComponent justify="space-between">
          <TextComponent text="Time:" title font={fontFamilies.medium} />
          <TextComponent
            text={` ${dateTime.GetTime(billDetail.startAt)}`}
            size={18}
            color={appColors.gray}
            font={fontFamilies.medium}
          />
        </RowComponent>
        <SpaceComponent height={16} />
        <RowComponent justify="space-between">
          <TextComponent text="Date:" title font={fontFamilies.medium} />
          <TextComponent
            text={` ${dateTime.GetDayString(billDetail.startAt)}`}
            size={18}
            color={appColors.gray}
            font={fontFamilies.medium}
          />
        </RowComponent>
        <SpaceComponent height={16} />
        <RowComponent justify="space-between">
          <TextComponent text="Location:" title font={fontFamilies.medium} />
          <TextComponent
            text={`${billDetail.locationTitle}`}
            size={18}
            color={appColors.gray}
            font={fontFamilies.medium}
          />
        </RowComponent>
        <SpaceComponent height={16} />
        <RowComponent justify="space-between">
          <TextComponent text="Quantity:" title font={fontFamilies.medium} />
          <RowComponent styles={{ backgroundColor: appColors.gray3, borderRadius: 100 }}>
            <TouchableOpacity style={{ paddingHorizontal: 8 }} onPress={increaseQuantity}>
              <Add scale={24} color={appColors.primary5} />
            </TouchableOpacity>
            <TextComponent
              text={`${quantity}`}
              size={24}
              color={appColors.primary3}
              font={fontFamilies.medium}
            />
            <TouchableOpacity style={{ paddingHorizontal: 8 }} onPress={decreaseQuantity}>
              <Minus size={24} color={appColors.primary5} />
            </TouchableOpacity>
          </RowComponent>
        </RowComponent>
        <SpaceComponent height={16} />
        <RowComponent justify="space-between">
          <TextComponent text="Price:" title font={fontFamilies.medium} />
          <TextComponent
            text={`$${parseFloat(billDetail.price).toLocaleString()}`}
            font={fontFamilies.bold}
            size={24}
            color={appColors.primary3}
          />
        </RowComponent>
        <SpaceComponent height={16} />
      </SectionComponent>
      <SectionComponent
        styles={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 16,
        }}>
        <RowComponent justify="space-between">
          <TextComponent text="Total change" />
          <TextComponent
            font={fontFamilies.medium}
            color={appColors.primary3}
            text={`$${billDetail.price * quantity}`}
          />
        </RowComponent>
        <ButtonComponent
          onPress={handlerPaySuccessfully}
          text="Pay now"
          type="primary"
          styles={{ marginBottom: 12, marginVertical: 12 }}
        />
        <TextComponent
          text="Payment securely progressed by Paypal"
          styles={{ textAlign: 'center' }}
          size={12}
        />
      </SectionComponent>
    </ContainerComponent>
  );
};

export default PaymentScreen;
