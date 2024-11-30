import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Alert,
  Linking,
} from 'react-native';
import { Divider } from '@/components/ui/Divider';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import LoginScreen from '../login/LoginScreen';
import { useAppSelector } from '@/lib/hooks';
import { selectTheme } from '../../features/themeSlice';
import { verifyUserWithApi } from '@/lib/services/LoginApi';
import { getUniqueId } from 'react-native-device-info';
import ApprovalModal from '@/components/ui/Approval';

const ProfileScreen = () => {
  const [user, setUser] = useState(auth().currentUser);
  const [isVerified, setIsVerified] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState(''); // Dinamik mesaj için state
  const { colors } = useAppSelector(selectTheme);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(authUser => {
      setUser(authUser);
      if (authUser) {
        verifyUser(authUser);
      }
    });
    return subscriber;
  }, []);

  const handleMailSend = (userEmail: string) => {
    const subject = encodeURIComponent(`Sorun: ${userEmail}`);
    const body = encodeURIComponent(
      'Merhaba, cihazımın başka bir kullanıcıya ait olduğunu belirten bir hata aldım. Lütfen bu sorunu çözmeme yardımcı olun.',
    );

    const mailtoURL = `mailto:account@thepiloting.com?subject=${subject}&body=${body}`;

    Linking.openURL(mailtoURL).catch(err => {
      console.error('Mail gönderme hatası:', err);
      Alert.alert(
        'Mail Gönderilemiyor',
        'E-posta gönderimi sırasında bir hata oluştu. Lütfen cihazınızda varsayılan e-posta uygulamasının kurulu olduğundan emin olun.',
      );
    });
  };

  const verifyUser = async (authUser: FirebaseAuthTypes.User) => {
    try {
      const deviceId = await getUniqueId();

      const response = await verifyUserWithApi(
        authUser.uid,
        authUser.email || '',
        deviceId,
        false,
      );

      if (response.success) {
        setIsVerified(true);
      } else if (response.requiresApproval) {
        setModalMessage(response.message); // Backend’den gelen mesajı al
        setModalVisible(true);
      } else {
        // Kullanıcı mailto bağlantısı ile yönlendirilecek
        Alert.alert('Hata', `${response.message}`, [
          {
            text: 'Mail Gönder',
            onPress: () => {
              const userEmail = authUser.email || 'belirtilmemiş';
              handleMailSend(userEmail); // Mail gönderimini tetikle
            },
          },
          { text: 'Tamam', style: 'cancel' },
        ]);

        await handleSignOut();
      }
    } catch (error) {
      console.error('Verification error:', error);
      Alert.alert('Hata', 'Doğrulama sırasında bir hata oluştu.');
      await handleSignOut();
    }
  };

  const handleApprove = async () => {
    try {
      setModalVisible(false); // Modal'ı kapat
      const deviceId = await getUniqueId();

      const approvalResult = await verifyUserWithApi(
        user?.uid || '',
        user?.email || '',
        deviceId,
        true,
      );

      if (approvalResult.success) {
        setIsVerified(true);
        Alert.alert('Başarılı!', approvalResult.message);
      } else {
        Alert.alert('Hata', approvalResult.message);
        await handleSignOut();
      }
    } catch (error) {
      console.error('Approval error:', error);
      Alert.alert('Hata', 'Bir hata oluştu.');
    }
  };

  const handleCancel = async () => {
    setModalVisible(false); // Modal'ı kapat
    await handleSignOut(); // Kullanıcıyı logout et
  };

  const handleSignOut = async () => {
    try {
      await auth().signOut();
      setUser(null);
      setIsVerified(false);
    } catch (error) {
      console.log('Sign out error:', error);
    }
  };

  const styles = getStyles(colors);

  return (
    <>
      <Divider orientation="horizontal" stroke={0.5} />
      <ApprovalModal
        visible={modalVisible}
        message={modalMessage} // Backend'den gelen mesajı modal’a geçir
        onApprove={handleApprove}
        onCancel={handleCancel}
      />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        {user && isVerified ? (
          <View style={styles.profileContainer}>
            <Text style={styles.userName}>
              {user.displayName || 'Kullanıcı'}
            </Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        ) : (
          <LoginScreen />
        )}
      </ScrollView>
      {user && isVerified && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
            <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

// Dinamik stil fonksiyonu
const getStyles = (colors: { background: any; primary: any; text: any }) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: 'space-between',
    },
    profileContainer: {
      padding: 20,
      alignItems: 'center',
    },
    userName: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    userEmail: {
      fontSize: 18,
      marginTop: 10,
      color: 'gray',
    },
    footer: {
      paddingBottom: 20,
      paddingHorizontal: 20,
      backgroundColor: colors.background,
    },
    logoutButton: {
      backgroundColor: colors.primary || '#FF3B30',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
    },
    logoutButtonText: {
      color: colors.text || '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
  });

export default ProfileScreen;
