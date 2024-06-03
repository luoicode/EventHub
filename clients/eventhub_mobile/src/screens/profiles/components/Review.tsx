import React, { useState } from 'react';
import { View, Modal, Text, TouchableOpacity, Image, StyleSheet, TextInput } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import { appColors } from '../../../constants/appColors';
import { ButtonComponent, InputAddNewScreen, InputComponent, RowComponent, SpaceComponent, TextComponent } from '../../../components';
import { globalStyles } from '../../../styles/globalStyles';

const Review = () => {
    const [rating, setRating] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [reviewText, setReviewText] = useState('');

    const ratingCompleted = (rating: any) => {
        setRating(rating);
    };

    const handleSubmit = () => {
        setModalVisible(true);
        setReviewText('');
    };

    return (
        <View>
            <Image source={require('../../../assets/images/shakeHands.png')} style={styles.imageBackGround} />
            {rating === 0 &&
                <RowComponent styles={{ marginBottom: -40 }}>
                    <TextComponent text="How was your experience?" title />
                </RowComponent>
            }
            <AirbnbRating
                reviews={['Very Bad', 'Bad', 'Normal', 'Good', 'Wooww, you rated 5 stars!!!']}
                defaultRating={rating}
                selectedColor={appColors.primary}
                reviewColor={appColors.primary5}
                onFinishRating={ratingCompleted}
            />
            <SpaceComponent height={16} />
            <InputComponent
                onChange={text => setReviewText(text)}
                value={reviewText}
                placeholder="Let me know how you feel about your experience."
                numberOfLine={2}
                multiline
                styles={styles.input}
            />


            <ButtonComponent onPress={handleSubmit} text='Submit' type='primary' />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={[globalStyles.shadow, styles.modalView]}>
                        <Image
                            source={require('../../../assets/images/thankYouRating.png')}
                            style={styles.image}
                        />
                        <TextComponent styles={styles.modalText} text='Thank you for review' />

                        <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <TextComponent styles={styles.textStyle} text='OK' />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: appColors.primary7,
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonClose: {
        backgroundColor: appColors.primary5,
    },
    textStyle: {
        color: appColors.primary7,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 15,
    },
    imageBackGround: {
        width: 'auto',
        height: 250,
        marginBottom: 15,
    },
    input: {
        width: '100%',
        height: 100,
        borderColor: appColors.gray2,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 15,
        color: appColors.primary5,
    },
});

export default Review;
