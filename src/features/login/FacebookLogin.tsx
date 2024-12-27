import React, { useState } from 'react';
import { View, Button, Alert, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';
import { getUniqueId } from 'react-native-device-info'; // Benzersiz cihaz kimliği için
import { verifyUserWithApi } from '../../lib/services/LoginApi'; // verifyUserWithApi API isteği

const FacebookLogin = () => {
  const [loading, setLoading] = useState(false);

  const handleFacebookLogin = async () => {
    try {
      console.log('Facebook ile giriş yapılıyor...');
      setLoading(true);
      // Facebook ile giriş yapma
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);
      console.log('🚀 ~ handleFacebookLogin ~ result:', result);
      if (result.isCancelled) {
        throw new Error('Kullanıcı giriş işlemini iptal etti');
      }

      // Access token al
      const data = await AccessToken.getCurrentAccessToken();
      console.log('🚀 ~ handleFacebookLogin ~ data:', data);
      if (!data || !data.accessToken) {
        throw new Error('Facebook erişim tokeni alınamadı');
      }

      // Facebook token ile Firebase giriş yap
      const facebookCredential = auth.FacebookAuthProvider.credential(
        data.accessToken
      );
      console.log(
        '🚀 ~ handleFacebookLogin ~ facebookCredential:',
        facebookCredential
      );
      const userCredential = await auth().signInWithCredential(
        facebookCredential
      );
      console.log('🚀 ~ handleFacebookLogin ~ userCredential:', userCredential);
      const user = userCredential.user;
      const token = await user.getIdToken(); // Firebase token al
      const deviceId = await getUniqueId();

      // Kullanıcı bilgilerini Firestore'a kaydet
      // await checkAndStoreUser(user.uid, user.email, deviceId);

      // Doğrulama başarılı, giriş başarılı mesajı göster
      // Alert.alert('Giriş başarılı!');
    } catch (error: any) {
      console.error('Giriş hatası:', error);
      Alert.alert(
        'Giriş başarısız!',
        `Bir hata oluştu: ${error.message || 'Bilinmeyen hata'}.`
      );
    } finally {
      setLoading(false);
    }
  };

  // const retryWithBackoff = async (
  //   operation: any,
  //   maxRetries = 3,
  //   delay = 1000,
  // ) => {
  //   let retries = 0;
  //   while (retries < maxRetries) {
  //     try {
  //       return await operation(); // İşlemi dene
  //     } catch (error: any) {
  //       if (error.code === 'firestore/unavailable' && retries < maxRetries) {
  //         retries++;
  //         console.log(`Hata alındı. ${retries}. tekrar denemesi...`);
  //         await new Promise(resolve => setTimeout(resolve, delay * retries)); // Gecikmeli tekrar
  //       } else {
  //         throw error; // Başka bir hata veya maksimum deneme sınırına ulaşıldı
  //       }
  //     }
  //   }
  // };

  // const checkAndStoreUser = async (
  //   uid: string,
  //   email: string | null,
  //   deviceId: string,
  // ) => {
  //   try {
  //     await retryWithBackoff(async () => {
  //       const userRef = firestore().collection('users').doc(uid);
  //       const doc = await userRef.get();
  //       if (doc.exists) {
  //         const userData = doc.data();
  //         if (userData?.devices && userData.devices.includes(deviceId)) {
  //           console.log('Cihaz zaten kayıtlı, devam ediliyor.');
  //         } else {
  //           console.log('Yeni cihaz kaydediliyor.');
  //           await userRef.update({
  //             devices: firestore.FieldValue.arrayUnion(deviceId),
  //             lastLogin: firestore.FieldValue.serverTimestamp(),
  //           });
  //         }
  //       } else {
  //         console.log('Yeni kullanıcı oluşturuluyor.');
  //         await userRef.set({
  //           email: email || '',
  //           devices: [deviceId],
  //           lastLogin: firestore.FieldValue.serverTimestamp(),
  //         });
  //       }
  //     });
  //   } catch (error) {
  //     console.error(
  //       'Kullanıcı veya cihaz bilgileri kaydedilirken hata oluştu:',
  //       error,
  //     );
  //   }
  // };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Facebook ile Giriş Yap" onPress={handleFacebookLogin} />
      )}
    </View>
  );
};

export default FacebookLogin;
