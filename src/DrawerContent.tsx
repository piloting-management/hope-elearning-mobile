// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import { DrawerContentScrollView } from '@react-navigation/drawer';

// const DrawerContent = (props) => {
//   const [isSubmenuVisible, setIsSubmenuVisible] = useState(false);

//   return (
//     <DrawerContentScrollView {...props}>
//       {/* Ana Menü Öğesi */}
//       <TouchableOpacity onPress={() => props.navigation.navigate('Home')}>
//         <Text style={styles.menuItem}>Home</Text>
//       </TouchableOpacity>

//       {/* Alt Menü Açılır/Kapanır */}
//       <TouchableOpacity onPress={() => setIsSubmenuVisible(!isSubmenuVisible)}>
//         <Text style={styles.menuItem}>Categories</Text>
//       </TouchableOpacity>

//       {/* Alt Menü */}
//       {isSubmenuVisible && (
//         <View style={styles.submenu}>
//           <TouchableOpacity onPress={() => props.navigation.navigate('Category1')}>
//             <Text style={styles.submenuItem}>Category 1</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => props.navigation.navigate('Category2')}>
//             <Text style={styles.submenuItem}>Category 2</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* Profil Öğesi */}
//       <TouchableOpacity onPress={() => props.navigation.navigate('Profile')}>
//         <Text style={styles.menuItem}>Profile</Text>
//       </TouchableOpacity>
//     </DrawerContentScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   menuItem: {
//     fontSize: 18,
//     marginVertical: 10,
//     marginLeft: 15,
//   },
//   submenu: {
//     marginLeft: 30,
//   },
//   submenuItem: {
//     fontSize: 16,
//     marginVertical: 5,
//   },
// });

// export default DrawerContent;
