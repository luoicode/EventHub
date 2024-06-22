import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import TextComponent from './TextComponent';

interface Props {
    isLoading?: boolean
    values: number;
    mess?: string;
}

const LoadingComponent = (props: Props) => {
    const { isLoading, values, mess } = props;
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            {
                isLoading ? (<ActivityIndicator />
                ) : (
                    values === 0 && <TextComponent text={mess ?? "Data not found!"} />
                )}
        </View>
    )
}

export default LoadingComponent;