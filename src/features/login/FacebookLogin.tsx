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
