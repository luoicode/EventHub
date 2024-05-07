import { View, Text, ScrollView, TextInput } from 'react-native'
import React from 'react'

// const handlerPustEvent = async (event: EventModel) => {
//     const api = `/add-new`;

//     setIsCreating(true);
//     try {
//       const res = await eventAPI.HandlerEvent(api, event, 'post');

//       setIsCreating(false);
//       navigation.navigate('Home', {
//         screen: 'HomeScreen',
//       });
//     } catch (error) {
//       setIsCreating(false);
//       console.log(error);
//     }
//   };
const Review = () => {
    return (
        <ScrollView>
            <TextInput
                placeholder='ádasd'
            />
        </ScrollView>
    )
}

export default Review