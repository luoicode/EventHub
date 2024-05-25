import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import {
    ContainerComponent,
    InputComponent,
    SectionComponent,
    SpaceComponent,
    TextComponent,
} from '../../components';
import { SearchNormal1 } from 'iconsax-react-native';
import { appColors } from '../../constants/appColors';
import { fontFamilies } from '../../constants/fontFamilies';

const HelpAndFAQsScreen = ({ navigation }: any) => {
    const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

    const handleFAQPress = (question: string) => {
        setExpandedFAQ(expandedFAQ === question ? null : question);
    };

    return (
        <ContainerComponent back title="Help & FAQs">
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <SectionComponent>
                    <TextComponent
                        text="We’re here to help you with anything and everyting on Event Hub"
                        title
                    />
                    <SpaceComponent height={16} />
                    <TextComponent text="At Event Hub we expect at a day’s start is you, better and happier than yesterday. We have got you covered share your concern or check our frequently asked questions listed below." />
                </SectionComponent>
                <View >
                    <InputComponent
                        styles={[globalStyles.shadow, { borderRadius: 100, backgroundColor: appColors.primary7 }]}
                        affix={
                            <TouchableOpacity
                                onPress={() => console.log('FAQs')}
                            >
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

                    <TouchableOpacity
                        onPress={() => handleFAQPress('How do I change my settings?')}>
                        <TextComponent
                            text="How do I change my settings?"
                            styles={styles.faqItem}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleFAQPress('How do I reset my password?')}>
                        <TextComponent
                            text="How do I reset my password?"
                            styles={styles.faqItem}
                        />
                    </TouchableOpacity>
                </SectionComponent>

                <SectionComponent>
                    <TextComponent text="Contact Information" title />
                    <SpaceComponent height={16} />
                    <TextComponent text="If you need further assistance, please contact us at:" />
                    <TextComponent
                        text="eventhubSPTeam@gmail.com"
                        styles={styles.contactEmail}
                        font={fontFamilies.bold}
                        color='#007bff'
                    />
                </SectionComponent>
            </ScrollView>
        </ContainerComponent>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    faqItem: {
        paddingVertical: 10,
    },
    contactEmail: {
        textDecorationLine: 'underline',
    },
});

export default HelpAndFAQsScreen;
