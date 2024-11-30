// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { useTolgee } from '@tolgee/react';

// const languages = [
//   { value: 'en', label: '🇬🇧' },
//   { value: 'tr', label: '🇹🇷' },
// ];

// const LanguageSwitcher = () => {
//   const [isDropdownVisible, setDropdownVisible] = useState(false);
//   const [selectedLanguage, setSelectedLanguage] = useState('en');
//   const tolgee = useTolgee();

//   const toggleDropdown = () => {
//     setDropdownVisible(!isDropdownVisible);
//   };

//   const changeLanguage = (lang: string) => {
//     setSelectedLanguage(lang);
//     tolgee.changeLanguage(lang);
//     setDropdownVisible(false); // Close dropdown
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity style={styles.comboBox} onPress={toggleDropdown}>
//         <Text style={styles.selectedText}>
//           {selectedLanguage === 'en' ? '🇬🇧' : '🇹🇷'}
//         </Text>
//       </TouchableOpacity>

//       {isDropdownVisible && (
//         <View style={styles.dropdown}>
//           {languages.map(lang => (
//             <TouchableOpacity
//               key={lang.value}
//               style={styles.dropdownItem}
//               onPress={() => changeLanguage(lang.value)}>
//               <Text style={styles.dropdownText}>{lang.label}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     position: 'relative',
//     alignItems: 'flex-end',
//   },
//   comboBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: 50,
//     height: 50,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 25,
//   },
//   selectedText: {
//     fontSize: 24, // Big emoji flag
//     textAlign: 'center',
//   },
//   dropdown: {
//     position: 'absolute',
//     top: 60,
//     right: 0,
//     backgroundColor: 'white',
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     elevation: 2,
//     zIndex: 1000,
//   },
//   dropdownItem: {
//     padding: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   dropdownText: {
//     fontSize: 16,
//   },
// });

// export default LanguageSwitcher;
