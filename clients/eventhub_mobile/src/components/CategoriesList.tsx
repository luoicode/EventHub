// import {View, Text, FlatList} from 'react-native';
// import React, {ReactNode} from 'react';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// import {appColors} from '../constants/appColors';
// import {TagComponent} from '.';
// import {ChefFork} from '../assets/svgs';
// interface Props {
//   isFill?: boolean;
// }

// interface Category {
//   icon: ReactNode;
//   color: string;
//   label: string;
//   key: string;
// }

// const CategoriesList = (props: Props) => {
//   const {isFill} = props;
//   const categories: Category[] = [
//     {
//       key: 'sports',
//       label: 'Sports',
//       icon: (
//         <FontAwesome5
//           name="basketball-ball"
//           size={20}
//           color={isFill ? appColors.white : '#F0635A'}
//         />
//       ),
//       color: '#F0635A',
//     },
//     {
//       key: 'music',
//       label: 'Music',
//       icon: (
//         <FontAwesome5
//           name="music"
//           size={20}
//           color={isFill ? appColors.white : '#F59762'}
//         />
//       ),
//       color: '#F59762',
//     },
//     {
//       key: 'food',
//       label: 'Food',
//       icon: <ChefFork color={isFill ? appColors.white : '#29D697'} />,
//       color: '#29D697',
//     },
//     {
//       key: 'arts',
//       label: 'Arts',
//       icon: (
//         <Ionicons
//           name="color-palette-outline"
//           size={20}
//           color={isFill ? appColors.white : '#46CDFB'}
//         />
//       ),
//       color: '#46CDFB',
//     },
//   ];
//   return (
//     <FlatList
//       style={{paddingHorizontal: 16}}
//       horizontal
//       showsHorizontalScrollIndicator={false}
//       data={categories}
//       renderItem={({item, index}) => (
//         <TagComponent
//           styles={{
//             marginRight: index === categories.length - 1 ? 28 : 12,
//             minWidth: 82,
//           }}
//           bgColor={isFill ? item.color : appColors.white}
//           onPress={() => {}}
//           icon={item.icon}
//           label={item.label}
//         />
//       )}
//     />
//   );
// };

// export default CategoriesList;
