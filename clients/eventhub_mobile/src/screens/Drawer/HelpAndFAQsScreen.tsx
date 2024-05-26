import React, { useState } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Linking,
} from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import {
    ButtonComponent,
    ContainerComponent,
    InputComponent,
    RowComponent,
    SectionComponent,
    SpaceComponent,
    TextComponent,
} from '../../components';
import { SearchNormal1 } from 'iconsax-react-native';
import { appColors } from '../../constants/appColors';
import { fontFamilies } from '../../constants/fontFamilies';

interface FAQ {
    question: string;
    answer: string;
}

const faqs: FAQ[] = [
    {
        question: 'What is Event Hub?',
        answer:
            'Eventhub is an innovative event management app developed by Nguyễn Huy in 2024. It allows users to book event tickets, invite friends, receive notifications, and explore upcoming and past events. Eventhub also helps you find events around your location, event sharing, follow other users, and search for specific events, making it your go-to app for all things event-related.',
    },
    {
        question: 'How can i buy tickets?',
        answer:
            'Once you have successfully registered and logged into the Event Hub app, you will be greeted with a curated selection of categories and events tailored to your interests. Simply tap on an event to view details, purchase tickets, and complete the payment process. Your tickets will then be conveniently sent to your email.',
    },
    {
        question: 'How can I invite my friends to an event?',
        answer:
            'You can easily share an event by selecting the event you want to invite friends to, then tapping the share button located in the upper right corner of the screen. Copy the provided link and send it to your friends for them to join.',
    },
    {
        question: 'What payment methods are accepted on Event Hub?',
        answer:
            'At present, Event Hub exclusively supports payments via PayPal. However, we are committed to enhancing our platform by integrating additional payment methods in the near future. Stay tuned for updates on new payment options!',
    },
    {
        question: 'Can I get a refund for my ticket if I can not attend the event?',
        answer:
            'Currently, Event Hub does not offer refunds. We apologize for any inconvenience this may cause and are continuously working to enhance our services to better meet your needs. Thank you for your understanding.',
    },
];

const HelpAndFAQsScreen = () => {
    const [selectedFaq, setSelectedFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setSelectedFaq(selectedFaq === index ? null : index);
    };

    const handleFAQPress = (question: string) => {
        console.log(question);
    };
    const sendEmail = () => {
        const email = 'eventhub.support@gmail.com';
        const subject = 'Help Request';
        const body =
            'Hello,\n\nI have a question regarding the Event Hub app. Can you please assist me?\n\nThank you.';

        Linking.openURL(`mailto:${email}?subject=${subject}&body=${body}`);
    };

    const renderItem = ({ item, index }: { item: FAQ; index: number }) => (
        <SectionComponent styles={styles.faqItem}>
            <TouchableOpacity onPress={() => toggleFaq(index)}>
                <TextComponent
                    text={item.question}
                    color={appColors.gray}
                    font={fontFamilies.medium}
                    size={18}
                />
            </TouchableOpacity>
            {selectedFaq === index && (
                <TextComponent text={item.answer} styles={styles.answer} size={16} />
            )}
        </SectionComponent>
    );

    const renderHeader = () => (
        <>
            <SectionComponent>
                <TextComponent
                    text="We’re here to help you with anything and everything on Event Hub"
                    title
                />
                <SpaceComponent height={16} />
                <TextComponent text="At Event Hub we expect at a day’s start is you, better and happier than yesterday. We have got you covered share your concern or check our frequently asked questions listed below." />
            </SectionComponent>
            <View>
                <InputComponent
                    styles={[
                        globalStyles.shadow,
                        { borderRadius: 100, backgroundColor: appColors.primary7 },
                    ]}
                    affix={
                        <TouchableOpacity onPress={() => console.log('FAQs')}>
                            <SearchNormal1
                                variant="TwoTone"
                                size={30}
                                color={appColors.primary5}
                            />
                        </TouchableOpacity>
                    }
                    placeholder="Search Help"
                    value=""
                    onChange={val => console.log(val)}
                />
            </View>
            <SectionComponent>
                <TextComponent text="FAQs" title />
            </SectionComponent>
        </>
    );

    const renderFooter = () => (
        <SectionComponent>
            <SpaceComponent height={16} />
            <RowComponent>
                <TextComponent size={22} text="Still suck? Help us a mail away" title />
            </RowComponent>
            <SpaceComponent height={8} />
            <ButtonComponent
                onPress={sendEmail}
                styles={{ width: '90%' }}
                text="Contact us"
                type="primary"
                textFont={fontFamilies.semiBold}
            />
            <TextComponent
                size={14}
                text="Need assistance? We're here to help! Contact us today for the best support."
                styles={{ textAlign: 'center' }}
            />
        </SectionComponent>
    );

    return (
        <ContainerComponent back title="Help & FAQs">
            <FlatList
                data={faqs}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderFooter}
                contentContainerStyle={styles.scrollContent}
            />
        </ContainerComponent>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    faqItem: {
        paddingVertical: 10,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: appColors.gray2,
    },
    answer: {
        marginTop: 8,
    },
});

export default HelpAndFAQsScreen;
