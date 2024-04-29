import { SearchNormal1 } from 'iconsax-react-native'
import React, { useState } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { ButtonComponent, ContainerComponent, LoadingComponent, RowComponent, SpaceComponent } from '../../components'
import { appColors } from '../../constants/appColors'

const NearbyScreen = ({ navigation }: any) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <ContainerComponent
            back
            title="Nearby You"
            right={
                <RowComponent >
                    <ButtonComponent onPress={() => navigation.navigate('SearchEvents')}
                        icon={<SearchNormal1 size={26} color={appColors.primary5} />}
                    />
                    <SpaceComponent width={16} />
                    <ButtonComponent
                        icon={
                            <MaterialIcons
                                name="more-vert"
                                size={26}
                                color={appColors.primary5}
                            />
                        }
                    />
                </RowComponent>
            }>
            <LoadingComponent values={0} isLoading={isLoading} />
        </ContainerComponent>
    )
}

export default NearbyScreen