// import React, { useState } from 'react';
// import { View, Button, Alert, ActivityIndicator } from 'react-native';
// import auth from '@react-native-firebase/auth';
// import { AccessToken, LoginManager } from 'react-native-fbsdk-next';

// const FacebookLogin = () => {
//   const [loading, setLoading] = useState(false);

//   const handleFacebookLogin = async () => {
//     try {
//       setLoading(true);
//       // Facebook ile giriş yapma
//       console.log('LoginManager', LoginManager);
//       const result = await LoginManager.logInWithPermissions([
//         'public_profile',
//         'email',
//       ]);
//       if (result.isCancelled) {
//         throw 'Kullanıcı giriş işlemini iptal etti';
//       }

//       // Access token al
//       const data = await AccessToken.getCurrentAccessToken();
//       if (!data) {
//         throw 'Facebook erişim tokeni alınamadı';
//       }

//       // Facebook token ile Firebase giriş yap
//       const facebookCredential = auth.FacebookAuthProvider.credential(
//         data.accessToken,
//       );

//       // Facebook hesabı ile oturum açma
//       await auth().signInWithCredential(facebookCredential);

//       Alert.alert('Giriş başarılı!');
//     } catch (error: any) {
//       if (error.code === 'auth/account-exists-with-different-credential') {
//         // Aynı email başka bir kimlik doğrulama yöntemiyle daha önce kayıt olmuş
//         const existingEmail = error.email;
//         const pendingCred = error.credential;

//         // Bu hatayı çözmek için mevcut oturumu Google, e-posta vs ile açmalı ve hesapları birleştirmelisin.
//         Alert.alert(
//           'Giriş başarısız!',
//           `Bu e-posta adresi zaten başka bir kimlik doğrulama yöntemiyle kullanılmış: ${existingEmail}.`,
//         );

//         // Burada mevcut kullanıcı ile pendingCred birleştirilebilir
//         // await auth().currentUser.linkWithCredential(pendingCred);
//       } else {
//         Alert.alert('Giriş başarısız!', error.toString());
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       {loading && <ActivityIndicator size="large" />}
//       <Button title="Facebook ile Giriş Yap" onPress={handleFacebookLogin} />
//     </View>
//   );
// };

// export default FacebookLogin;
