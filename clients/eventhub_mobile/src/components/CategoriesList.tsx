import React, { ReactNode, useEffect, useState } from 'react';
import { FlatList, Image } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { ButtonComponent, TagComponent } from '.';
import { appColors } from '../constants/appColors';
import { Category } from '../models/Category';
import eventAPI from '../apis/eventApi';
import { useIsFocused, useNavigation } from '@react-navigation/native';
interface Props {
    isFill?: boolean;
}

const CategoriesList = (props: Props) => {
    const { isFill } = props;
    const [categories, setCategories] = useState<Category[]>([]);

    const navigation: any = useNavigation();

    useEffect(() => {
        getCategories();
    }, []);

    const getCategories = async () => {
        const api = `/get-categories`;

        try {
            const res = await eventAPI.HandlerEvent(api);
            setCategories(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    // const data = [
    //     {
    //         iconColor:
    //             'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADsAAAA7CAYAAADFJfKzAAAACXBIWXMAACE4AAAhOAFFljFgAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAARrSURBVHgB1ZpBcts2FED/h5JS6aY6gjadSrU7lU5Q5wbpCexsmnGyiHMD+QTRKm67sX2CNiewcwJpJh5LmSyinCDahUom/MGHBYekKAoAKRJ5G0s0COENPsAPgAgpeqPnrUXQ/LD8Ov64aN6f9R/OwSPao9PWvWBxSgt6Nu0fzkzvE+kL4d0fHsS+9u4F4QVXDp5wIxpeANADDOCiMzppm967IotC7KcueSP8TRR6+pIUPjW9PyHLISz/7GWUq104Q5SZEcJD0zoSsuGdZi+nbG3COaL3p13XMSuivQ3lKxc2FeWx270+yR3DSVnEtQVjVCZsI8qTlfy4lzdpJWSRxE9gxtaFHUTb+lYM8HlWnameJZvGb024gCgjc4Mgc9JKyBLQe7CjdOHioskkKN62ZBhH4JIplSZctmhn8s++rG+kx3C6Z8fgRmHhNaLzIqJI0RncJB5q0kqO2Ya4BHcKCWeIMi3ZwNuMzkFUI++T6WX6R/lZBdlZlCnWi4fu9d9y9qSjdf9HhEEUwrmjqJx3o+PrnSeDFdnO65M9bKhKi2AsvOytd5vKIZEMaWzl/UaeKH9eWQhMfzu8lH8uoRjGIY13aQAGFBVlRHbFKrmeQTHMhAX+AXbMXUTVT2XVxrMfz4JQjXAb7Gj92Ayf6i+mouo65NCZyPFEK5OCC5lj+OfRv707wZcROKAmLRAzU1FG5NRXdQ9bQQQDG1EmV5bZpvDb/l9jiswX33lsElVlwJBthnTn6uQAhfn2ShoTUVUOLPBR2FRUlQVLfBK2EVXlwQEfhG1F1T3gSF3CN2kjHE9+fTwES5xlVaMqEmbBCHEs16Cvwk/NoesJRSFZ1ahtCsu6w7A5L+v4pbAss+1MqyxKkWW+B+HSZBnfhUuVZXwWLl2W8VW4nAlquVUZPxj2Ubj4o+fbjh/QQm57eiy8cYmXR2prs50+VMpdHpLVHnUp62Fn2TV7uIbCdD7ZedyHiM7BnMLCbguBbNE4s/UhTa9kXnugrzvsUzuHtHXPGogya3s4LsoEi/BPrCik7RbvZqJxVno4s163icy6h823ZexFNTPZqP6mRlUhbBTGBUSBx6hJYzjMMYo4pG3GolVIb5QtKHqeHqN5XO8+GUeEz8AOY+Fc2SpFNdPdw7MoElsRXitbh6jmze6jodwEPwY7NgpnTlB1isbpXr0YyoOvp5a3rZ20Vs9nPRHVSOEzKbwPdmQKJ8LYN1Em+Lw4skw6mMyQvu1ZH0U1y3eg+bSvDXYkeljJ+iyqKbBcvBVWYey7KKNza8ukg+GQ/o8/4C9XL46EyH7XL5/qROO4vuBCSAeigWA700Fdogy/4OJypouEB4IQe1Z31Siq4SzLIeloC7sxUL+oZrpzOLARRqC5iBBemhX3R1TDwqZbO3wwJkREBkd//olqJruqXZcGRY8FL6vyB7y/opq8rR11niv91HpZX7x5aNNAnoH+DurVORoTNv6fdh/Z7ADWyvJMl58ubXUhopfUwKF+hfcr5pXIW/gjkdMAAAAASUVORK5CYII=',
    //         iconWhite:
    //             'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAtCAYAAAA6GuKaAAAACXBIWXMAACE4AAAhOAFFljFgAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHBSURBVHgB7dhtkcIwEAbgSkACEpCAhJNQB4eDOweHA+oACZVQCZFQCe8lR64NbZrspslmmOGd6Q9IuvvQ6VdoGicAznhE6e3YCEb3O+jtzu6rd+gwRwxuwUNSX7sDJOELMK+nnniCP8XgMbAZjxX4wHaywwngr2hfPfiNcFQuOBE8jTU70FngTLBJGyp2AS0qFb4HbOat+iJ8Tu+GZwCrVV9blBNFhXvAsJ8PDPB/7sviPQrA9Zyfjf0Hz1gbAE8/1C1+Bj8qBLeNqeGBncmUuwgZDvoFfkkCl4Dj+X0mlD9YEjg3HLzrZEAqOCccj3eaEfzwwZXh6eBK8P1gYXg+sBD8mh1cAG7Wgze9fRbD5oZXyRv+hm9DDy8Fx/xCc2teAY71G1gIbuZdq8I94BB8gkBolc8Bb8GX57zsESeAvXBPnY5QQ+2GM8DRhvCvyNl1xMALOKUmqV5xcEJtet2S4EUPyoIgXl8C7PQ67+4jCXZ6tsn9aoCd3tTH/9y3JjgZDvo/QKoE2IFTHb2ZnOcqzgPvCZaRglYSYIumPHzG2K9TUmAHHrvG+tCNXkmDCfARiztIZ78c7dE/NhWzYTqZsV9cGM1TkuiH9gAAAABJRU5ErkJggg==',
    //         color: '#29D697',
    //         key: 'food',
    //     },
    //     {
    //         iconColor: 'data:image/png;base64,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',
    //         iconWhite: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAtCAYAAAA6GuKaAAAACXBIWXMAACE4AAAhOAFFljFgAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAANVSURBVHgBvZmNddsgEMdRJ9AGVSeoO0HJBPUGcSeIN7A6QbyB1AmaTOBkArcT4E5gb3C9i6A+YwSckPN/755kGY4fB0h8VKpQALDAy1c0uv6pqmprn+/wotFOaAdrL2ivmOa3em8hUIO2QTvCpY4sjYZxGbSO/Khby8LuIC5t09aBSoXU3QTeAmwgT1uWbwf52qi5BEN0jaDwPcu7BZkMlEbdAuc08YVY/iXIReUtYlwfYn/iKD/g5VlNqKy9PSi5nie9Xfya4u8eZNIOHmTqYxwxYNclugJwbfPUgjy9V15nOZocaMMcTQXXLABTgZ0MWh0D3gQcTgHXAug+AuzUjgHHCpCC1zadhnJgpyYEnQLJBefv6TXMA0zaSaIsBedfxF8wD7BTkyp8Knhjn9czA5NantGATGPgHXu2gnmBSUeXcQHT5IO3wJoPrgNRCuy0SA2WlC7AGdAGbgNMWscGS64ePSB/UM8JTOrcTMzANNHUsw5Eur8RMGnPHWoLsUtkMuD1Xzc2vN+rGwC/lV+pEVkIHsW3BSpOG09eOkrzgNai9fj/94Av6vsr7zH5oSnoE9pfe38i/zYg5JeubuGsuUPq00uITUrClXJLMONF4t5Ltwq01IO0POuLOPuKvLDnL2ivttYHNUSDi2r9EW1p7/2Cf2KkVoHCerxQZX6gbUdaq/H8nUYXAzB9EPrqPb9+xP0+34y0lK89DGNN88x7mB+4s8+7QJCoW/UwTQZtKZ13SICdGu//RyjTU+kXMQXcqnCXLAnUumTukQI2Xv9tZwJfOAfSvY0UMOk+AFiyWCYZnrkVZMwBJtUsylwl4B3PmLvUzwV+Ymm20cJl4I3yMu5gHmDSmqUbe6VKwa+nwRBfJ0qASTqzBSXgjQoJwn27FwL/LwDSWwi54K0aEwyRMYXApNx9jxxwo1KC815ePxF4CvQYeN5engMvAAaQdY8YeN6uaaACHci1cJUHuTpVIhg+8eKTANQ35kOqZJdInQTQJPyLku/o37F7ya7+gcqzJxCjikKTyAHaJzWsOnL1md2/ZuYh/0lgsWDoozmfXGri3DdIB/B+h6AEbyIwmqW/OtmF4UMmXtySKlUoOJ+Na3Ve9pO9YFPf2TQ0F6EuQ/27+Gz8H4HRVavqTaQkAAAAAElFTkSuQmCC',
    //         color: '#F0635A',
    //         key: 'sports'
    //     },
    //     {
    //         iconColor: 'data:image/png;base64,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',
    //         iconWhite: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAtCAYAAAA6GuKaAAAACXBIWXMAACE4AAAhOAFFljFgAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAANGSURBVHgB1Zn/dZswEMfPef2/2aBsUGcDukE6gekE9gZmg7gTkE7gdgKSCexOIDpB0gm+1QVhyzJIJ4HT5POeHiQ+nb7ox6ETRO8AALe6PJmyoreOFrnAKU8fIh1c68utLpn51342m/2kC6HbW+tL6fz7WVKXK2e61OhH6TKniWHBA+3lkspLM5d8PJlRuLTgYkzlPkqaAO2nSvYfKZipaAS6/rUu29cUPEq0EbwbI7hAGgtKAO0iVwM+N2MdhMgokkB7W6mTe6ShKJKAYJ4q4WikjXKksxvwyXOVQ2Zli9D3cwyHUQVp+MTwy0NKhfbBeU1sLH/ca5nTOT7Bti0/8GJI8ByX4WSYcb6PCAnuWPeJTp3LPu4dwUvIBS96bBauaIWJBTv+1x5bnipzwagftwoYtwD7KCMEM7eWbQb/PqfsDFcYDzfE83flCL4L1CscwUrQzjUbb5FOjYGtItphVp66pWNfQ0YxJtQF0x60cXqDgGDLXhIQNqmL0J0GuRFXsSA4r3ScCi+dh8od212g7R0hnopO52E9YHfniFM4jyqdwLXTAT5UiujMakAFbG3hc0dw5djm1m/eTClWdG05LoR1Tobf1F332Nkj6A0OV9qmITm/rHvp/jl3BdN5hh0Fi5al5C0PpuHMFePhU3eDNi6XPt8G3y6vYdG/ScazPuPYm/uYI4O/dCqs6bFptO8ffCPokBfRe5Jh2+Uk57AOtLBGX77owgJ5hPnv77rcWPal353uBMj3HvZCqYV1ojIa+HeCHYsr/fQPJJvXf6x7SWbRUNurnSB+wfS+RdHGcQ6P4USW6NF2GKKwGvFRmx4b2ksr094Sx1QsdIJ18G0/qWSK5Fav2AK2RkSBntwO/mwllrNEoIZAtLHNKADaV/w9pkP1NRLq7VwolIe8xvQcennmNMoLYTmg6Ru1Ya+bApkuH6mN2Zm5TnZy6sDn4Iew6IrmRnd0PDR/C3BkuzEx/oUr+1f9Axt8pbhX+6VZ2YIHQfoh5NSUFAP+v/CSUsDxU9hrM+6zG8Yd/8aiIPkQJBQ+lFVPCfufPmRi+rccU2Oq3hWKV0iD10mJxO+PMxqJ6aXP1CYGmSn2MDfUxv29KY9WBpTEP9anryINZ0udAAAAAElFTkSuQmCC',
    //         color: '#46CDFB',
    //         key: 'arts'
    //     },
    //     {
    //         iconColor: 'data:image/png;base64,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',
    //         iconWhite: 'data:image/png;base64,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',
    //         color: '#F0635A',
    //         key: 'games'
    //     },
    //     {
    //         iconColor: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADsAAAA7CAYAAADFJfKzAAAACXBIWXMAACE4AAAhOAFFljFgAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAPgSURBVHgB7ZrBThpBGID/fwaptRdIrElP5Q3EJxDegD6BemhiqwcujdEe3B6qMb3QpJgmvdQnKD6B+ASlTyDnasNe2iKwM50BloLs6iy7y86iX6JZV5b1Y/75559/RZhBisVGqrUAa8h5AZClygeLK/J8AmaEzZ3LHKGJVSGYayPLoTzZ+1a3XxNbWTl6zUedLEEoICFr4lQKgPUFnYmV7HB4itHLUiApL9drL+sent7RTnaS8FRFC1m/4alKZLJBhqcqU5MNMzxVCVV2WuGpSuCyUYSnKoHKSlFKydm0w1MVAveIB9lZ5UF2VnmQjS2cVzmQIgeoOP067p0KUxhWOIPzZJNWSqW0KU++2r1aQRxf6GMnyznUgbNTwqHy6ehp1cu18ZCV4Ym0wqzm6eejZ3WYEF1lHcPTL9rI+glPVaKVDSg8VZm2bCjhqUrostMIT1VClUWL5csRCw4TagXVgU4dNOJe1caxq6BevvmZnaMkK48Z53WLcfPLh6WayrWxkO33tmT7tQDdFmwPKhpdlAJs7f2qiw1AiVkglrB03e19tJaVrdj2E9gX2bx4x0szCKwkxItbbxsGE9ZOaCu7udPItKn1DThmPVyWER/MV4LouH5rm6CoFAVPosM4NuO1lH2919j3IeqKdrIyfMX8MyAElOesTBa/59oZSrAbIvPXiVoYtS0llhHW44RbZW88mMolRbK3aS+wbsoXh1XLIu9uS/le4IirYT05cQ3j7d2rQmuBfZcpHZDnXF6WEV/rlLKL3jzzR9FopLD3nqHgOLLyD+di3nj5hOU8oxSVKhk3Wi25XobH2MhK0ckTRPAZNEhGZMPMhCqIwif4zbyon+3DEVlC2RlESD/JBSuM///DbSAri+0wk4MqoptfhQDhSAZPBwayhHZ3FJFDLPYRgkK0hI7fp08H720fIKfLoAHdPhXHKgQCMUZ+sg84Rh/CNhbDDfA7d0WbtnyYPhk+peVGQCYqDlYeJhUW4WsxunHzdKiy89fzE4/O8cFSTQp3W7FeECM695esOJWvQ7LcV/UzflOo+90oSGHGSF6s/TJpmXfdDzhZLx8u5t3uOygXObfOEWlwGRmDWUL6I1QUmxKj89jKiSZbDgg+Ry426Agi3GmNWJ0fKg34QSkqi/B2i12Ayy7fK7JBHvUTgJsMwrhkpE3OA1rjxLzRTVQykqCSjxIlzwlhHNMpE+rAiKwcXZkQ/AiLjf5GUBv5oHHcPsrdDyHsDL0VGqaYpy90DF+bW/fK27uXBgOydoe0iYydJJoJY9rPW72i1BiQLRqZ8hFxeejKbtpP/oET3SVt/gH/6s6jPliazgAAAABJRU5ErkJggg==',
    //         iconWhite: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAtCAYAAAA6GuKaAAAACXBIWXMAACE4AAAhOAFFljFgAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAI1SURBVHgB7Zj7UcJAEId/MP4vdoAVaAeGDuyAdCAdEDuACpAKxArECsQKEiqADs5dbg+JvC655C7M8M0sScjry94jlwMajlIqohhSfFLEaCIk1hHREcVK5Yn5mBs0ABalRZ/imeKRonPq+GDSnE1aPFFEEtZ4k5ZschY5m5zVDkpSq3TRYrelcmmXYrfFWbrKYrfFSZr7TlRY7La4ZjpCANq4QK7SvrhI6UaMPQ6QUXxQzKB7pvfdnU2SnlN8UcxardbC/CkvqxwhpdfQopuMkuja9kTf0hn+in1RRHQXH9JzHCh2F+qQLl3stlQlzWJTOBa7LVVJc0YH8MT15VIGGY+bL5tbiiV0FZsdOyfkhy3LDikGR/ZntHiD7nlyBJEmoS4t+AOie+Iw3pdA9+05vNdpS+Fd9o4L0RAT2Asf5Gz1kMxsoMaRwQG5Vh+OtI9cvCOTfivaTE3I3Npk90EKEqEC9qRJiDPBkgn2v7J5O4Z+gCGKE6ECctIk8gLdzdhMCSQIxFZainyEZsPVNZfpBPXjOjRdbtek4bkwsbmj3GelypGa65hMR/CADFnHKEdiVoy0z7k4bjcZijGmB56aDe9vRMl2D/bi0/9jdSOdwY1lkYP5zUpxT6uvJ+7N/8d0XLx3Pv8oPUzkil62mvTo4nOUROm5jQeKO+hu7cfqenRiosqRIhTSHaWqOF2EhAUKisdoAiL+fUY2VQfm2HzROrZDpGLoBmIaKL+G59DdUK1zG6f4BVmRJUHKgTcrAAAAAElFTkSuQmCC',
    //         color: '#F59762',
    //         key: 'music'
    //     },
    // ];

    // const handlerUpdateCategories = async () => {
    //     data.forEach(async cat => {
    //         const item = categories.find(element => element.key === cat.key)
    //         if (item) {
    //             const id = item._id

    //             const values = {
    //                 color: cat.color,
    //                 iconColor: cat.iconColor,
    //                 iconWhite: cat.iconWhite,
    //             };
    //             const api = `/update-category?id=${id}`
    //             try {
    //                 const res = await eventAPI.HandlerEvent(api, values, 'put')
    //                 console.log(res)
    //             } catch (error) {
    //                 console.log(error)
    //             }
    //         }
    //     })


    // };

    return categories.length > 0 ? (
        <FlatList
            style={{ paddingHorizontal: 16 }}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={item => item._id}
            renderItem={({ item, index }) => (
                <TagComponent
                    styles={{
                        marginRight: index === categories.length - 1 ? 38 : 12,
                        minWidth: 82,
                    }}
                    bgColor={isFill ? item.color : appColors.primary7}
                    onPress={() =>
                        navigation.navigate('CategoryDetail', {
                            id: item._id,
                            title: item.title,
                        })
                    }
                    icon={
                        <Image source={{ uri: isFill ? item.iconWhite : item.iconColor }}
                            style={{ width: 24, height: 24 }} />
                    }
                    label={item.title}
                    textColor={isFill ? appColors.primary7 : appColors.text2}
                />
            )}
        />
    ) : (
        <></>
    );
};

export default CategoriesList;
