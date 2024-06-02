import { Call, DirectRight, Facebook, Instagram, Whatsapp } from 'iconsax-react-native';
import React from 'react';
import { Linking, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CardComponent, ContainerComponent, RowComponent, SectionComponent, SpaceComponent, TextComponent } from '../../components';
import { appColors } from '../../constants/appColors';

type SocialMediaType = 'instagram' | 'facebook' | 'callus';
const goToSocialMedia = (socialMedia: SocialMediaType) => { //
    let socialMediaURL = '';
    const phoneNumber = '0123456789';
    switch (socialMedia) {
        case 'instagram':
            socialMediaURL = 'https://www.instagram.com/huy.nguyen02/';
            break;
        case 'facebook':
            socialMediaURL = 'https://www.facebook.com/huy.nguyen268/';
            break;
        case 'callus':
            Linking.openURL(`tel:${phoneNumber}`);
            break;
        default:
            socialMediaURL = '';
    }

    if (socialMediaURL !== '') {
        Linking.openURL(socialMediaURL);
    } else {
    }
};

const sendEmail = () => {
    const email = 'eventhub.support@gmail.com';
    const subject = 'Help Request';
    const body =
        'Hello,\n\nI have a question regarding the Event Hub app. Can you please assist me?\n\nThank you.';

    Linking.openURL(`mailto:${email}?subject=${subject}&body=${body}`);
};

const ContactScreen = () => {


    return (
        <ContainerComponent back title='Contact Us'>
            <SectionComponent>
                <TextComponent text='Contact Us' title size={48} />
                <SpaceComponent height={8} />
                <TextComponent size={18} text="Don't hesitate to contact us whether you have a suggestion on our improvement, a complain to discuss or an issue to solve" />
            </SectionComponent>
            <SpaceComponent height={8} />
            <SectionComponent>
                <RowComponent>
                    <View style={{ borderRadius: 40, width: 200, height: 200, backgroundColor: appColors.primary5, justifyContent: 'center', alignItems: 'center' }}>
                        <CardComponent onPress={() => goToSocialMedia('callus')}>
                            <Call size={30} color={appColors.primary5} />
                        </CardComponent>
                        <TextComponent text='Call us' title color={appColors.primary7} />
                        <SpaceComponent height={8} />
                        <TextComponent text='Our team is on the line' color={appColors.primary7} />
                        <TextComponent text='Mon-Fri • 9-17' color={appColors.primary7} />

                    </View>
                    <SpaceComponent width={12} />
                    <View style={{ borderRadius: 40, width: 200, height: 200, backgroundColor: appColors.primary5, justifyContent: 'center', alignItems: 'center' }}>
                        <CardComponent onPress={sendEmail}>
                            <MaterialCommunityIcons name='email-edit-outline' size={30} color={appColors.primary5} />
                        </CardComponent>
                        <TextComponent text='Email us' title color={appColors.primary7} />
                        <SpaceComponent height={8} />
                        <TextComponent text='Our team is on the line' color={appColors.primary7} />
                        <TextComponent text='Mon-Fri • 9-17' color={appColors.primary7} />
                    </View>
                </RowComponent>
            </SectionComponent>
            <SectionComponent>
                <TextComponent text='Contact us in Social Media' />
                <SpaceComponent height={8} />
                <View style={{ marginBottom: 10, borderRadius: 20, borderWidth: 1, borderColor: appColors.gray2, width: "100%", height: 110, justifyContent: 'center', alignItems: 'center' }}>
                    <RowComponent justify='space-between' styles={{ width: "90%" }}>
                        <CardComponent onPress={() => goToSocialMedia('instagram')} color={appColors.primary5} styles={{ borderRadius: 16 }}>
                            <Instagram size="42" color={appColors.primary7} />
                        </CardComponent>
                        <View>
                            <TextComponent text='Instagram' size={28} color={appColors.primary5} />
                            <SpaceComponent height={8} />
                            <TextComponent text='29.8K Followers • 188 Posts' color={appColors.gray} />
                        </View>
                        <CardComponent onPress={() => goToSocialMedia('instagram')} color={appColors.gray2} styles={{ borderRadius: 50 }}>
                            <DirectRight
                                size="32"
                                color={appColors.primary5}
                            />
                        </CardComponent>

                    </RowComponent>

                </View>
                <View style={{ marginBottom: 10, borderRadius: 20, borderWidth: 1, borderColor: appColors.gray2, width: "100%", height: 110, justifyContent: 'center', alignItems: 'center' }}>
                    <RowComponent justify='space-between' styles={{ width: "90%" }}>
                        <CardComponent onPress={() => goToSocialMedia('facebook')} color={appColors.primary5} styles={{ borderRadius: 16 }}>
                            <Facebook size="42" color={appColors.primary7} />
                        </CardComponent>
                        <View>
                            <TextComponent text='Facebook' size={28} color={appColors.primary5} />
                            <SpaceComponent height={8} />
                            <TextComponent text='19.8K Followers • 202 Posts' color={appColors.gray} />
                        </View>
                        <CardComponent onPress={() => goToSocialMedia('facebook')} color={appColors.gray2} styles={{ borderRadius: 50 }}>
                            <DirectRight
                                size="32"
                                color={appColors.primary5}
                            />
                        </CardComponent>

                    </RowComponent>

                </View>
                <View style={{ marginBottom: 10, borderRadius: 20, borderWidth: 1, borderColor: appColors.gray2, width: "100%", height: 110, justifyContent: 'center', alignItems: 'center' }}>
                    <RowComponent justify='space-between' styles={{ width: "90%" }}>
                        <CardComponent color={appColors.primary5} styles={{ borderRadius: 16 }}>
                            <Whatsapp size="42" color={appColors.primary7} />
                        </CardComponent>
                        <View>
                            <TextComponent text='WhatsUp' size={28} color={appColors.primary5} />
                            <SpaceComponent height={8} />
                            <TextComponent text='Available Mon-Fri • 9-17 ' color={appColors.gray} />
                        </View>
                        <CardComponent onPress={() => { }} color={appColors.gray2} styles={{ borderRadius: 50 }}>
                            <DirectRight
                                size="32"
                                color={appColors.primary5}
                            />
                        </CardComponent>

                    </RowComponent>

                </View>
                <View style={{ marginBottom: 10, borderRadius: 20, borderWidth: 1, borderColor: appColors.gray2, width: "100%", height: 110, justifyContent: 'center', alignItems: 'center' }}>
                    <RowComponent justify='space-between' styles={{ width: "90%" }}>
                        <CardComponent color={appColors.primary5} styles={{ borderRadius: 16 }}>
                            <FontAwesome name="telegram" size={42} color={appColors.primary7} />
                        </CardComponent>
                        <View>
                            <TextComponent text='Telegram' size={28} color={appColors.primary5} />
                            <SpaceComponent height={8} />
                            <TextComponent text='9.8K Followers • 18 Posts' color={appColors.gray} />
                        </View>
                        <CardComponent onPress={() => { }} color={appColors.gray2} styles={{ borderRadius: 50 }}>
                            <DirectRight
                                size="32"
                                color={appColors.primary5}
                            />
                        </CardComponent>

                    </RowComponent>

                </View>

            </SectionComponent>
        </ContainerComponent>

    );
};


export default ContactScreen;
