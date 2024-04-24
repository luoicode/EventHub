import React from 'react';
import {
    ContainerComponent,
    SectionComponent,
    TextComponent,
} from '../components';

export default function NotFound() {
    return (
        <ContainerComponent back>
            <SectionComponent>
                <TextComponent text="Not Found!!!" />
            </SectionComponent>
        </ContainerComponent>
    );
}