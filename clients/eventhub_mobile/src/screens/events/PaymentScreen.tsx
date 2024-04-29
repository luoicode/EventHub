import React from 'react';
import {
  ButtonComponent,
  ContainerComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TagComponent,
  TextComponent,
} from '../../components';
import { fontFamilies } from '../../constants/fontFamilies';
import { dateTime } from '../../utils/dateTime';
import { appColors } from '../../constants/appColors';
import eventAPI from '../../apis/eventApi';

const PaymentScreen = ({ navigation, route }: any) => {
  const { billDetail } = route.params;

  const handlerPaySuccessfully = async () => {
    const api = `/update-payment-success?billId=${billDetail._id}`;

    try {
      const res = await eventAPI.HandlerEvent(api);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ContainerComponent back title='Payment'>
      <SectionComponent>
        <RowComponent justify="flex-end">
          <TagComponent
            label={billDetail.status === 'success' ? 'Success' : 'Unpaid'}
          />
        </RowComponent>
      </SectionComponent>
      <SectionComponent styles={{ alignItems: 'center' }}>
        <TextComponent
          text={`ID: ${billDetail._id}`}
          font={fontFamilies.bold}
          size={20}
        />
        <TextComponent
          text={`Date: ${dateTime.GetDayString(billDetail.updateAt)}`}
        />
        <SpaceComponent height={16} />
        <TextComponent
          text={`$${parseFloat(billDetail.price).toLocaleString()}`}
          font={fontFamilies.bold}
          size={24}
          color={appColors.primary3}
        />
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
            text={`$${billDetail.price}`}
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
