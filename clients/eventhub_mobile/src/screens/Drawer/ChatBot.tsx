import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    ImageBackground,
    Keyboard,
    Platform,
    StatusBar,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { GiftedChat } from 'react-native-gifted-chat';
import { globalStyles, giftedChatStyles } from '../../styles/globalStyles';
import { ContainerComponent, RowComponent } from '../../components';
import { appColors } from '../../constants/appColors';
import { DirectRight } from 'iconsax-react-native';

interface Message {
    _id: string;
    text: string;
    createdAt: Date;
    user: {
        _id: number;
    };
}

const ChatBot = ({ navigation }: any) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [outputMessage, setOutputMessage] = useState('Results to be shown here:');

    const apiKey = 'sk-proj-VTTOwOOHAW2HDlQSCt8QT3BlbkFJWTpUuxP7KMhQUU4YSYrK';
    useEffect(() => {
        const welcomeMessage = {
            _id: Math.random().toString(36).substring(7),
            text: "Ask me about events that interest you",
            createdAt: new Date(),
            user: { _id: 2, name: 'Event' },
        };
        setMessages([welcomeMessage]);
    }, []);
    const handleKeyPress = ({ nativeEvent }: { nativeEvent: any }) => {
        if (nativeEvent.key === 'Enter') {
            handleButtonClick();
            Keyboard.dismiss();
        }
    };

    const handleButtonClick = () => {
        const allowedEvents = ['sport', 'game', 'art', 'food', 'music', 'show', 'concert'];
        const userMessage = inputMessage.toLowerCase();

        const isAllowedEvent = allowedEvents.some(event => userMessage.includes(event));

        if (!isAllowedEvent) {
            const errorMessage = "Sorry, I can only answer about events like Sport, Game, Art, Food, Music.";
            const errorMessageObj = {
                _id: Math.random().toString(36).substring(7),
                text: errorMessage,
                createdAt: new Date(),
                user: { _id: 2, name: 'Event' },
            };
            setMessages(previousMessages => {
                return GiftedChat.append(previousMessages, [errorMessageObj]);
            });
            setInputMessage('');
            return;
        }

        generateText();
        setInputMessage('');
    };


    const generateText = () => {
        console.log(inputMessage);
        const message = {
            _id: Math.random().toString(36).substring(7),
            text: inputMessage,
            createdAt: new Date(),
            user: { _id: 1 },
        };
        setMessages(previousMessages => {
            return GiftedChat.append(previousMessages, [message]);
        });
        fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization:
                    `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'user',
                        content: inputMessage,
                    },
                ],
                model: 'gpt-3.5-turbo',
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.choices && data.choices.length > 0 && data.choices[0].message) {
                    console.log(data.choices[0].message.content);
                    setInputMessage('');
                    setOutputMessage(data.choices[0].message.content.trim());
                    const message = {
                        _id: Math.random().toString(36).substring(7),
                        text: data.choices[0].message.content.trim(),
                        createdAt: new Date(),
                        user: { _id: 2, name: 'Event' },
                    };
                    setMessages(previousMessages => {
                        return GiftedChat.append(previousMessages, [message]);
                    });
                } else {
                    console.error("Invalid response format:", data);
                }
            })
            .catch(error => {
                console.error("Error:", error);
            });

    };

    const handleTextInput = (text: string) => {
        setInputMessage(text);
    };

    const navigateToAllEvents = () => {
        navigation.navigate('EventsScreen');
    };

    return (
        <ContainerComponent back title='EventHub bot'>

            <ImageBackground
                source={require('../../assets/images/splash-img.png')}
                resizeMode="cover"
                style={globalStyles.backgroundImage}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={0}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <GiftedChat
                                messages={messages}
                                user={{ _id: 1 }}
                                minInputToolbarHeight={0}
                                renderInputToolbar={() => null}
                                {...giftedChatStyles}
                            />
                        </View>
                        <RowComponent>
                            <View style={[globalStyles.inputContainerBot, { marginTop: 10 }]}>
                                <TextInput
                                    placeholder="Aa"
                                    style={{ fontSize: 20, marginLeft: 20 }}
                                    onChangeText={handleTextInput}
                                    value={inputMessage}
                                    onKeyPress={handleKeyPress}
                                />
                            </View>

                            <TouchableOpacity onPress={navigateToAllEvents}>
                                <View style={[globalStyles.sendButton, { backgroundColor: 'pink' }]}>
                                    <FontAwesome name="calendar" size={16} color={appColors.primary5} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleButtonClick}>
                                <View style={globalStyles.sendButton}>
                                    <DirectRight
                                        size="28"
                                        variant='Bold'
                                        color={appColors.primary5}
                                    />
                                </View>
                            </TouchableOpacity>
                        </RowComponent>

                        <StatusBar hidden />
                    </View>
                </KeyboardAvoidingView>
            </ImageBackground>
        </ContainerComponent>
    );
}
export default ChatBot;
