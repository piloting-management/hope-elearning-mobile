import React, { useState } from 'react';
import { View, Button, Alert, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';

const FacebookLogin = () => {
  const [loading, setLoading] = useState(false);

  const handleFacebookLogin = async () => {
    try {
      setLoading(true);
      console.log('LoginManager:', LoginManager);

      // Facebook ile giriş yapma
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);
      if (result.isCancelled) {
        throw new Error('Kullanıcı giriş işlemini iptal etti');
      }

      // Access token al
      const data = await AccessToken.getCurrentAccessToken();
      if (!data || !data.accessToken) {
        throw new Error('Facebook erişim tokeni alınamadı');
      }

      // Facebook token ile Firebase giriş yap
      const facebookCredential = auth.FacebookAuthProvider.credential(
        data.accessToken,
      );
      await auth().signInWithCredential(facebookCredential);

      Alert.alert('Giriş başarılı!');
    } catch (error) {
      Alert.alert(
        'Giriş başarısız!',
        `Bu e-posta adresi zaten başka bir kimlik doğrulama yöntemiyle kullanılmış: ${error}.`,
      );
      // await auth().currentUser.linkWithCredential(pendingCred);
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
