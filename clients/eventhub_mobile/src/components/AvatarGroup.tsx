import React from 'react';
import { Image } from 'react-native';
import { AvatarComponent, RowComponent, SpaceComponent, TextComponent } from '.';
import { appColors } from '../constants/appColors';
import { fontFamilies } from '../constants/fontFamilies';

interface Props {
    size?: number;
    userIds: string[];
}

const AvatarGroup = (props: Props) => {
    const { size, userIds } = props;
    const photoUrl = 'https://cdn-icons-png.flaticon.com/512/5556/5556468.png';

    return (
        <RowComponent justify="flex-start" styles={{ marginVertical: 12 }}>
            {
                userIds.length > 0 && (<>

                    {userIds.map((item, index) => (
                        // <AvatarComponent
                        //     key={item}
                        //     uid={item} styles={{
                        //         borderWidth: 1,
                        //         borderColor: appColors.white,
                        //         marginLeft: index > 0 ? -8 : 0,
                        //     }} />
                        <Image
                            key={`img-${index}`}
                            source={{ uri: photoUrl }}
                            style={{
                                width: size ?? 24,
                                height: size ?? 24,
                                borderRadius: 100,
                                borderWidth: 1,
                                borderColor: appColors.primary5,
                                marginLeft: index > 0 ? -8 : 0,
                            }}
                        />
                    ))}

                    <SpaceComponent width={12} />
                    <TextComponent
                        text={`${userIds.length > 3 ? `+${userIds.length - 3}` : ' '} Going`}
                        size={12 + (size ? (size - 24) / 5 : 0)}
                        color={appColors.primary5}
                        font={fontFamilies.semiBold}
                    />
                </>)
            }
        </RowComponent>
    );
};

export default AvatarGroup;
